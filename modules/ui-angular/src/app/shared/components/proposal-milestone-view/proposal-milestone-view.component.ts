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
import { EuiDialogComponent } from '@eui/components/eui-dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';
import {
  Milestone,
  MilestoneViewItem,
} from '@/features/proposal-view/models/milestone.model';
import { MilestoneTocItem } from '@/features/proposal-view/models/milestone-toc-item.model';
import { DocumentServiceAnnotationsStub } from '@/shared/components/proposal-milestone-view/document-service-annotations-stub';
import { AnnotateService } from '@/shared/services/annotate.service';
import { DocumentService } from '@/shared/services/document.service';
import { ProposalMilestonesService } from '@/shared/services/proposal-milestones.service';

type MilestoneDocument = {
  ref: string;
  type: string;
  xml: string;
  version: string;
  label: string;
  tocData: MilestoneTocItem[];
};

export type MilestoneDescriptor = Pick<
  Milestone,
  'createdBy' | 'createdDate' | 'legDocumentName' | 'proposalRef' | 'title'
>;

@Component({
  selector: 'app-proposal-milestone-view',
  templateUrl: './proposal-milestone-view.component.html',
  styleUrls: ['./proposal-milestone-view.component.scss'],
  providers: [
    { provide: DocumentService, useClass: DocumentServiceAnnotationsStub },
    AnnotateService,
  ],
})
export class ProposalMilestoneViewComponent implements OnInit, OnDestroy {
  @Input() milestone: MilestoneDescriptor;
  @Output() closed = new EventEmitter();
  @ViewChild('dialog') dialog: EuiDialogComponent;

  @ViewChild('tocPane', { read: ElementRef }) tocPaneElement: ElementRef;
  @ViewChild('documentPane', { read: ElementRef })
  documentPaneElement: ElementRef;
  @ViewChild('annotationsPane', { read: ElementRef })
  annotationsPaneElement: ElementRef;

  documents: MilestoneDocument[] = [];
  containerId = 'view-container-id';
  connectedEntity: string;
  showStatusFilter: boolean;
  activeTabIndex: number;
  showPdfExport = false;

  isTocPaneCollapsed = false;
  isAnnotationsPaneCollapsed = false;
  hideTocSplitter: boolean;
  hideAnnotationsSplitter: boolean;

  private destroy$: Subject<any> = new Subject();

  constructor(
    public documentService: DocumentService,
    public milestonesService: ProposalMilestonesService,
    public translateService: TranslateService,
    private config: AppConfigService,
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
    this.loadConfig();
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  open() {
    this.dialog.openDialog();
  }

  close() {
    this.dialog.closeDialog();
    this.closed.emit();
  }

  onTabSelected({ index }: { index: number }) {
    this.setActiveTab(index);
  }

  exportPdf() {
    this.milestonesService.exportMilestonePdf(
      this.milestone.proposalRef,
      this.milestone.legDocumentName,
    );
  }

  onToggleTocPaneCollapsed(isTocPaneCollapsed = !this.isTocPaneCollapsed) {
    this.isTocPaneCollapsed = isTocPaneCollapsed;
    if (!this.isTocPaneCollapsed) this.onHideTocSplitter(false);
  }

  onHideTocSplitter(hideTocSplitter = !this.hideTocSplitter) {
    this.hideTocSplitter = hideTocSplitter;
  }

  onToggleAnnotationsPaneCollapsed(
    isAnnotationsPaneCollapsed = !this.isAnnotationsPaneCollapsed,
  ) {
    this.isAnnotationsPaneCollapsed = isAnnotationsPaneCollapsed;
    if (!this.isAnnotationsPaneCollapsed) this.onHideAnnotationsSplitter(false);
  }

  onHideAnnotationsSplitter(
    hideAnnotationsSplitter = !this.hideAnnotationsSplitter,
  ) {
    this.hideAnnotationsSplitter = hideAnnotationsSplitter;
  }

  private loadConfig() {
    this.config.config.pipe(takeUntil(this.destroy$)).subscribe((config) => {
      this.connectedEntity = (
        config.user.connectedEntity ?? config.user.defaultEntity
      ).name;
      this.showStatusFilter = config.annotateAuthority === 'LEOS';
    });
  }

  private loadDocuments() {
    const hiddenCategories = [
      ...(process.env.NG_APP_LEOS_INSTANCE !== 'ec'
        ? ['COVERPAGE', 'STAT_FINANC_LEGIS']
        : []),
    ];
    this.milestonesService
      .listMilestoneView(
        this.milestone.proposalRef,
        this.milestone.legDocumentName,
      )
      .subscribe((response) => {
        this.showPdfExport = response.pdfRenditionsPresent;

        this.documents = response.documents
          .filter((x) => !hiddenCategories.includes(x.leosCategory))
          .sort(this.tabOrderComparator)
          .map((x) => this.viewToDoc(x));
        this.setActiveTab(0);
      });
  }

  private viewToDoc(item: MilestoneViewItem): MilestoneDocument {
    return {
      ref: item.contentFileName,
      type: item.leosCategory,
      xml: item.xmlContent,
      version: item.version,
      label: this.createTabLabel(item),
      tocData: JSON.parse(item.tocData),
    };
  }

  private createTabLabel(item: MilestoneViewItem) {
    return this.translateService.instant(
      `page.collection.milestone-view-dialog.tab-title.${item.leosCategory}`,
      { number: item.order ?? 0 },
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
        case 'STAT_FINANC_LEGIS':
          return sortOrder(5);
        case 'ANNEX':
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
