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
import {EuiDialogComponent} from '@eui/components/eui-dialog';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {
  Milestone,
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

type MilestoneDocument = {
  ref: string;
  type: string;
  xml: string;
  version: string;
  label: string;
  state: string;
  tocData: MilestoneTocItem[];
};

export type MilestoneDescriptor = Pick<Milestone,
  | 'createdBy'
  | 'createdDate'
  | 'legDocumentName'
  | 'proposalRef'
  | 'title'
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
  @Output() closed = new EventEmitter();
  @ViewChild('dialog') dialog: EuiDialogComponent;

  @ViewChild('tocPane', {read: ElementRef}) tocPaneElement: ElementRef;
  @ViewChild('documentPane', {read: ElementRef})
  documentPaneElement: ElementRef;
  @ViewChild('annotationsPane', {read: ElementRef})
  annotationsPaneElement: ElementRef;
  status: string;
  isOpened = false;

  documents: MilestoneDocument[] = [];
  containerId = 'view-container-id';
  activeTabIndex: number;
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
  ) {
  }

  ngOnInit(): void {
    this.milestonesService.readyToMergeStatus$.subscribe((status) => {
      this.status = status;
    });

    this.readyToMergeMessage = this.translateService.instant(
      'page.workspace.proposal-item.ready-status',
    );

    this.milestonesService.requestStoredDocumentAnnotations$.subscribe((request) => this.requestStoredDocumentAnnotations(request))

    if (this.status === this.readyToMergeMessage) {
      this.loadContribution(this.hiddenCategories);
    } else {
      this.loadDocuments(this.hiddenCategories);
    }
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  open() {
    this.isOpened = true;
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
      this.milestonesService.sendRequestStoredDocumentAnnotations(this.milestone.proposalRef, this.milestone.legDocumentName, doc.ref, true);
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
      .filter((x) => !hiddenCategories.includes(x.leosCategory))
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
          return sortOrder(5);
        case 'STAT_FINANC_LEGIS':
          return sortOrder(6);
        default:
          return sortOrder(9);
      }
    };
    return getSortOrder(a) - getSortOrder(b);
  }

  private setActiveTab(index: number) {
    const doc = this.documents[index];
    if (doc) {
      this.documentService.setDocumentRefAndCategory(doc.ref, doc.type);
    }
    this.activeTabIndex = index;
  }
}
