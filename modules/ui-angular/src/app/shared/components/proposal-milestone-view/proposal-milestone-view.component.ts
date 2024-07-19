import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {EuiDialogComponent, EuiDialogService} from '@eui/components/eui-dialog';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {
  Milestone, MilestoneStatus,
  MilestoneViewItem,
  MilestoneViewResponse,
} from '@/features/proposal-view/models/milestone.model';
import {MilestoneTocItem} from '@/features/proposal-view/models/milestone-toc-item.model';
import {
  DocumentServiceAnnotationsStub
} from '@/shared/components/proposal-milestone-view/document-service-annotations-stub';
import {AnnotateService} from '@/shared/services/annotate.service';
import {DocumentService} from '@/shared/services/document.service';
import {ProposalMilestonesService} from '@/shared/services/proposal-milestones.service';
import {ConfirmDeleteDialogComponent} from "@/shared/components/confirm-delete-dialog/confirm-delete-dialog.component";
import {EuiGrowlService} from "@eui/core";

type MilestoneDocument = {
  ref: string;
  type: string;
  xml: string;
  version: string;
  label: string;
  selected: boolean;
  state: string;
  tocData: MilestoneTocItem[];
};

export type MilestoneDescriptor = Pick<Milestone,
  | 'createdBy'
  | 'createdDate'
  | 'legDocumentName'
  | 'proposalRef'
  | 'title'
  | 'legFileId'
  | 'versionedReference'>;

@Component({
  selector: 'app-proposal-milestone-view',
  templateUrl: './proposal-milestone-view.component.html',
  styleUrls: ['./proposal-milestone-view.component.scss'],
  providers: [
    {provide: DocumentService, useClass: DocumentServiceAnnotationsStub},
    AnnotateService,
  ],
})
export class ProposalMilestoneViewComponent implements OnInit, OnDestroy {
  @Input() milestone: MilestoneDescriptor;
  @Input() parentClonedProposal: boolean;
  @Input() parentLegDocumentName: string;
  @Output() closed = new EventEmitter();
  @ViewChild('dialog') dialog: EuiDialogComponent;

  @ViewChild('tocPane', {read: ElementRef}) tocPaneElement: ElementRef;
  @ViewChild('documentPane', {read: ElementRef})
  documentPaneElement: ElementRef;
  @ViewChild('annotationsPane', {read: ElementRef})
  annotationsPaneElement: ElementRef;
  @ViewChild('confirmationForDelete')
  confirmDeleteAnnex: ConfirmDeleteDialogComponent;
  status: string;
  isOpened = false;

  documents: MilestoneDocument[] = [];
  containerId = 'view-container-id';
  activeTabIndex: number;
  tmpSelectedTab: number;
  showPdfExport = false;
  contributionChanged = false;

  readyToMergeMessage: string;

  isTocPaneCollapsed = false;
  isAnnotationsPaneCollapsed = false;

  hiddenCategories = [
    ...(process.env.NG_APP_LEOS_INSTANCE !== 'ec'
      ? ['COVERPAGE']
      : []),
  ];

  private destroy$: Subject<any> = new Subject();

  constructor(
    public documentService: DocumentService,
    public milestonesService: ProposalMilestonesService,
    public translateService: TranslateService,
    private appShell: EuiGrowlService,
    private dialogService: EuiDialogService,
  ) {
  }

  ngOnInit(): void {
    this.milestonesService.readyToMergeStatus$.subscribe((status) => {
      this.status = status;
    });

    this.milestonesService.requestStoredDocumentAnnotations$.subscribe(
      (request) => this.requestStoredDocumentAnnotations(request),
    );

    this.reloadDocs();
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  reloadDocs() {
    let isReadyToMerge = MilestoneStatus.ReadyToMerge === this.status;
    if (isReadyToMerge) {
      this.loadContribution(this.hiddenCategories);
    } else {
      this.loadDocuments(this.hiddenCategories);
    }
  }

  open() {
    this.isOpened = true;
    this.reloadDocs();
    this.dialog.dialogClose.subscribe((value) => {
      this.isOpened = false;
      this.closed.emit();
    });
    this.dialog.openDialog();
  }

  close() {
    this.dialog.closeDialog();
    this.isOpened = false;
    this.closed.emit();
  }

  onTabSelected({index}: { index: number }) {
    this.setActiveTab(index);
  }

  exportPdf() {
    if (this.milestone?.legDocumentName) {
      this.milestonesService.exportMilestonePdf(
        this.milestone.proposalRef,
        this.milestone.legDocumentName,
        this.milestone.legFileId
      );
    } else {
      this.milestonesService.exportMilestonePdfFromVersion(
        this.milestone.proposalRef,
        this.milestone.versionedReference,
      );
    }
  }

  onToggleTocPaneCollapsed(isTocPaneCollapsed = !this.isTocPaneCollapsed) {
    this.isTocPaneCollapsed = isTocPaneCollapsed;
  }

  onToggleAnnotationsPaneCollapsed(
    isAnnotationsPaneCollapsed = !this.isAnnotationsPaneCollapsed,
  ) {
    this.isAnnotationsPaneCollapsed = isAnnotationsPaneCollapsed;
  }

  requestStoredDocumentAnnotations(request: string) {
    if (request && this.isOpened) {
      const doc = this.documents[this.activeTabIndex];
      this.milestonesService.sendRequestStoredDocumentAnnotations(
        this.milestone.proposalRef,
        this.milestone.legDocumentName,
        doc.ref,
        true,
      );
    } else {
      this.milestonesService.sendEmptyStoredDocumentAnnotations();
    }
  }

  private loadContribution(hiddenCategories) {
    this.milestonesService
      .listContributionsView(
        this.milestone.proposalRef,
        this.milestone.legDocumentName,
      )
      .subscribe((response) => {
        this.handleMilestoneExplorerDocuments(response, hiddenCategories);
      });
    this.milestonesService.resetReadyToMergeStatus();
  }

  private loadDocuments(hiddenCategories: string[]) {
    if (!!this.milestone.legDocumentName) {
      this.milestonesService
        .listMilestoneView(
          this.milestone.proposalRef,
          this.milestone.legDocumentName,
          this.milestone.legFileId,
        )
        .subscribe((response) => {
          this.handleMilestoneExplorerDocuments(response, hiddenCategories);
        });
    } else {
      this.milestonesService
        .listMilestoneViewFromVersion(
          this.milestone.proposalRef,
          this.milestone.versionedReference,
        )
        .subscribe((response) => {
          this.handleMilestoneExplorerDocuments(response, hiddenCategories);
        });
    }
  }

  private handleMilestoneExplorerDocuments(
    response: MilestoneViewResponse,
    hiddenCategories: string[],
  ) {

    this.showPdfExport = response.pdfRenditionsPresent;
    this.contributionChanged = response.contributionChanged;
    this.documents = response.documents
      .filter((x) => !hiddenCategories.includes(x.leosCategory) && (!this.parentClonedProposal || x.contentStatus !== 'Deleted'))
      .sort(this.tabOrderComparator)
      .map((x) => this.viewToDoc(x));
    this.setActiveTab(0);
  }

  private viewToDoc(item: MilestoneViewItem): MilestoneDocument {
    return {
      ref: item.contentFileName,
      type: item.leosCategory,
      xml: item.xmlContent,
      version: item.version,
      label: this.createTabLabel(item),
      state: item.contentStatus,
      tocData: JSON.parse(item.tocData),
      selected: false,
    };
  }

  private createTabLabel(item: MilestoneViewItem) {
    return this.translateService.instant(
      `page.collection.milestone-view-dialog.tab-title.${item.leosCategory}`,
      {number: item.order ?? 0},
    );
  }

  private tabOrderComparator(a: MilestoneViewItem, b: MilestoneViewItem) {
    const getSortOrder = (item: MilestoneViewItem) => {
      const sortOrder = (o: number) => o * 1000 + (item.order ?? 0);
      switch (item.leosCategory) {
        case 'COVERPAGE':
          return sortOrder(1);
        case 'MEMORANDUM':
          return sortOrder(2);
        case 'COUNCIL_EXPLANATORY':
          return sortOrder(3);
        case 'BILL':
          return sortOrder(4);
        case 'ANNEX':
          return sortOrder(6);
        case 'STAT_FINANC_LEGIS':
          return sortOrder(5);
        default:
          return sortOrder(9);
      }
    };
    return getSortOrder(a) - getSortOrder(b);
  }

  private setActiveTab(index: number) {
    this.documents.forEach(doc => {
      doc.selected = false;
    });
    const doc = this.documents[index];
    if (doc) {
      this.documentService.setDocumentRefAndCategory(doc.ref, doc.type);
      doc.selected = true;
    }
    this.activeTabIndex = index;
  }

  shouldDisplayButtons(): boolean {
    const doc= this.documents[this.activeTabIndex];
    return this.contributionChanged &&
      !this.parentClonedProposal &&
      (doc.state === 'Added' || doc.state === 'Deleted' || doc.state === 'Processed');
  }

  evaluateState(state: string): boolean {
    if (state === 'Added') {
      return true;
    } else if (state === 'Deleted') {
      return false;
    }
    return false;
  }

  handleAcceptReject(doc: MilestoneDocument, accept: boolean) {
    this.tmpSelectedTab = this.activeTabIndex;
    if (accept) {
      if (!this.evaluateState(doc.state)) {
        if (doc.type === 'STAT_FINANC_LEGIS') {
          this.dialogService.openDialog({
            title: this.translateService.instant(
              'page.collection.drafts.financial-statement.delete.confirm-dialog.title',
            ),
            content: this.translateService.instant(
              'page.collection.drafts.financial-statement.delete.confirm-dialog.body',
            ),
            acceptLabel: this.translateService.instant('global.actions.delete'),
            accept: () => {
              this.doAccept();
            },
          });
        } else {
          this.confirmDeleteAnnex.deleteDialog.openDialog();
        }
      } else {
        this.doAccept();
      }
    } else {
      this.milestonesService.handleReject(this.milestone.proposalRef, this.parentLegDocumentName, this.milestone.legDocumentName, this.evaluateState(doc.state), doc.ref).subscribe({
        next: (milestoneViewResponse: MilestoneViewResponse) => {
          this.handleMilestoneExplorerDocuments(milestoneViewResponse, this.hiddenCategories);
          this.setActiveTab(this.tmpSelectedTab);
          this.appShell.growl({
            severity: 'success',
            summary: this.translateService.instant('global.notifications.title.success'),
            detail: this.translateService.instant(
              'page.collection.milestone-view-dialog.handle-doc.processed',
            ),
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
        },
        error: (res) => {
          this.appShell.growl({
            severity: 'danger',
            summary: this.translateService.instant(
              'page.collection.milestone-view-dialog.handle-doc.error',
            ),
            detail: res,
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',

          });
        }
      });
    }
  }

  doAccept() {
    const doc:MilestoneDocument = this.documents[this.activeTabIndex];
    this.milestonesService.handleAccept(this.milestone.proposalRef, this.milestone.legDocumentName, this.evaluateState(doc.state), doc.ref, doc.type).subscribe({
      next: (milestoneViewResponse: MilestoneViewResponse) => {
        this.handleMilestoneExplorerDocuments(milestoneViewResponse, this.hiddenCategories);
        this.setActiveTab(this.tmpSelectedTab);
        this.appShell.growl({
          severity: 'success',
          summary: this.translateService.instant('global.notifications.title.success'),
          detail: this.translateService.instant(
            'page.collection.milestone-view-dialog.handle-doc.processed',
          ),
          life: 3000,
          isGrowlSticky: false,
          position: 'bottom-right',
        });
      },
      error: (res) => {
        this.appShell.growl({
          severity: 'danger',
          summary: this.translateService.instant(
            'page.collection.milestone-view-dialog.handle-doc.error',
          ),
          detail: res,
          life: 3000,
          isGrowlSticky: false,
          position: 'bottom-right',

        });
      },
    });
  }
}
