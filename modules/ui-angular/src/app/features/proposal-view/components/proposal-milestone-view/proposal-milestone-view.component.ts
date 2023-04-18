import {
  Component,
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
import { DocumentServiceAnnotationsStub } from '@/features/proposal-view/components/proposal-milestone-view/document-service-annotations-stub';
import {
  Milestone,
  MilestoneViewItem,
} from '@/features/proposal-view/models/milestone.model';
import { ProposalMilestonesService } from '@/features/proposal-view/services/proposal-milestones.service';
import { AnnotateService } from '@/shared/services/annotate.service';
import { DocumentService } from '@/shared/services/document.service';

import { MilestoneTocItem } from '../../models/milestone-toc-item.model';

type MilestoneDocument = {
  ref: string;
  type: string;
  xml: string;
  version: string;
  label: string;
  tocData: MilestoneTocItem[];
};

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
  @Input() milestone: Milestone;
  @Output() closed = new EventEmitter();
  @ViewChild('dialog') dialog: EuiDialogComponent;
  documents: MilestoneDocument[] = [];
  containerId = 'view-container-id';
  connectedEntity: string;
  showStatusFilter: boolean;
  activeTabIndex: number;

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

  private loadConfig() {
    this.config.config.pipe(takeUntil(this.destroy$)).subscribe((config) => {
      this.connectedEntity = (
        config.user.connectedEntity ?? config.user.defaultEntity
      ).name;
      this.showStatusFilter = config.annotateAuthority === 'LEOS';
    });
  }

  private loadDocuments() {
    this.milestonesService
      .listMilestoneView(
        this.milestone.proposalRef,
        this.milestone.legDocumentName,
      )
      .subscribe((items) => {
        this.documents = items
          .filter(
            (x) =>
              x.leosCategory !== 'STAT_FINANC_LEGIS' && // out of scope for now
              x.leosCategory !== 'COVERPAGE',
          )
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
        case 'MEMORANDUM':
          return sortOrder(1);
        case 'COUNCIL_EXPLANATORY':
          return sortOrder(2);
        case 'BILL':
          return sortOrder(3);
        case 'STAT_FINANC_LEGIS':
          return sortOrder(4);
        case 'ANNEX':
          return sortOrder(5);
        default:
          return sortOrder(9);
      }
    };
    return getSortOrder(a) - getSortOrder(b);
  }

  private setActiveTab(index: number) {
    const doc = this.documents[index];
    this.documentService.setDocumentId(doc.ref);
    this.documentService.setDocumentCategory(doc.type);
    this.activeTabIndex = index;
  }
}
