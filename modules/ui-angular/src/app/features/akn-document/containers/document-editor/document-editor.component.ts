import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  SecurityContext,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EuiDialogComponent,
  EuiDialogService,
} from '@eui/components/eui-dialog';
import { EuiBreadcrumbService } from '@eui/components/layout';
import { uniqueId, UxAppShellService } from '@eui/core';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash-es';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  filter,
  Observable,
  Subject,
  take,
  takeUntil,
} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { AppConfigService } from '@/core/services/app-config.service';
import { DOCUMENT_ACTIONS_SERVICE } from '@/features/akn-document/akn-document.module';
import { DocumentTocComponent } from '@/features/akn-document/containers/document-toc/document-toc.component';
import { Version } from '@/features/akn-document/models';
import { DocumentActionsService } from '@/features/akn-document/services/document-actions.service';
import { MergeContributionsService } from '@/features/akn-document/services/merge-contributions.service';
import { VersionCompareService } from '@/features/akn-document/services/version-compare.service';
import { ViewVersionService } from '@/features/akn-document/services/view-version.service';
import {
  ContributionStatus,
  DOCUMENT_STYLES,
  DocumentConfig,
  Profile,
} from '@/shared';
import { CoEditionDetectedDialogComponent } from '@/shared/components/co-edition-detected-dialog/co-edition-detected-dialog.component';
import { ConfirmDeleteDialogComponent } from '@/shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import {
  MilestoneDescriptor,
  ProposalMilestoneViewComponent,
} from '@/shared/components/proposal-milestone-view/proposal-milestone-view.component';
import { ContributionVO } from '@/shared/models/contribution-vo.model';
import { DocumentViewResponse } from '@/shared/models/document-view-response.model';
import { TableOfContentItemVO, TocItem } from '@/shared/models/toc.model';
import { VersionInfoVO } from '@/shared/models/version-info.model';
import { VersionSearchParams } from '@/shared/models/versionSearch';
import { AnnotateService } from '@/shared/services/annotate.service';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';
import { DomService } from '@/shared/services/dom.service';
import { EnvironmentService } from '@/shared/services/enviroment.service';
import { LeosLightService } from '@/shared/services/leos-light.service';
import { LoadingService } from '@/shared/services/loading.service';
import { capitalizeFirstLetter } from '@/shared/utils/string.utils';
import { findNodeById } from '@/shared/utils/toc.utils';

import { BlockDocumentEditorService } from '../../services/block-document-editor.service';
import { CKEditorService } from '../../services/ckeditor.service';
import { PageMode, PageModeService } from '../../services/page-mode.service';
import { SyncDocumentScrollService } from '../../services/sync-document-scroll.service';
import { TableOfContentService } from '../../services/table-of-content.service';
import { TableOfContentEditService } from '../../services/table-of-content-edit.service';

@Component({
  selector: 'app-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.scss'],
  providers: [AnnotateService],
})
export class DocumentEditorComponent
  implements OnDestroy, OnInit, AfterViewInit
{
  pageTitle$: Observable<string>;
  profile: Profile;
  presenterId: string;
  connectedEntity: string;
  containerId = 'docContainer';
  mainContainerId = 'mainContainer';
  versionMainContainerId = "versionMainContainer";
  versionComparisonMainContainerId = "versionComparisonMainContainer";
  contributionViewMainContainerId = "contributionViewMainContainer";
  documentRef: string;
  documentType: string;
  proposalRef: string;
  showStatusFilter: boolean;
  loadDocument: boolean;
  isCollapseToc = false;
  versionForView: string;
  versionForViewHeaderTitle: string;
  versionsComparisonForView: string;
  documentConfig: DocumentConfig;
  contributionForView: string;

  isTocPaneExpanded = true;
  isAnnotationsPaneCollapsed = true;
  isContributionAnnotationsPaneCollapsed = true;
  isVersionsPaneCollapsed = true;
  isViewContributionPaneCollapsed = true;
  applyActionDisabled$: Observable<boolean>;
  tocItems: Array<TocItem> = [];
  dragItems: Array<Partial<TableOfContentItemVO>> = [];

  isSyncScrollEnabled$: Observable<boolean>;

  isEditMode = false;
  isReady = false;
  tooltipsDelay = 1000;

  versionSearchForm = new FormGroup({
    type: new FormControl('all'),
    author: new FormControl(''),
  });

  isCNInstance = process.env.NG_APP_LEOS_INSTANCE === 'cn';

  id: string;

  showContributionsPane = false;
  isVersionsPaneExpanded = false;
  isContributionsPaneExpanded = false;
  contributionActionSelected = 'accept_selected';
  processed = false;
  contributions: ContributionVO[] = [];
  contribution: ContributionVO;
  contributionChanges$: Observable<HTMLElement[]>;
  contributionIndex = 0;
  contributionTemporaryDataId?: string;
  contributionTemporaryDataDocument?: string;
  tasksOngoing: { name: string; key: string }[] = [];

  @ViewChild(DocumentTocComponent) documentTocComponent: DocumentTocComponent;
  @ViewChild('unSavedDialog') unSavedDialog: EuiDialogComponent;
  @ViewChild('openEditorDialog') openEditorDialog: EuiDialogComponent;
  @ViewChild('confirmAnnexStructureChangeDialog')
  annexStructureChangeDialog: ConfirmDeleteDialogComponent;

  @ViewChild('milestoneViewDialog')
  protected milestoneViewDialog: ProposalMilestoneViewComponent;
  protected milestoneViewData: MilestoneDescriptor = null;
  protected PageMode = PageMode;
  protected pageMode: PageMode;

  @ViewChild('tocPane', { read: ElementRef }) tocPaneElement: ElementRef;
  @ViewChild('documentPane', { read: ElementRef })
  documentPaneElement: ElementRef;
  @ViewChild('annotationsPane', { read: ElementRef })
  annotationsPaneElement: ElementRef;
  @ViewChild('versionsPane', { read: ElementRef })
  versionsPaneElement: ElementRef;
  @ViewChild('versionForViewPane', { read: ElementRef })
  versionForViewPaneElement: ElementRef;
  @ViewChild('compareModePane', { read: ElementRef })
  compareModePaneElement: ElementRef;
  @ViewChild('contributionViewPane', { read: ElementRef })
  contributionViewPaneElement: ElementRef;
  @ViewChild('contributionViewContainer', { read: ElementRef })
  contributionViewContainerElement: ElementRef;
  @ViewChild('contributionAnnotationsPane', { read: ElementRef })
  contributionAnnotationsPaneElement: ElementRef;

  private unloadStyleSheet?: () => void;
  private destroy$: Subject<any> = new Subject();
  private applyActionDisabledBS = new BehaviorSubject<boolean>(true);
  private contributionChangesBS = new BehaviorSubject<HTMLElement[]>([]);

  constructor(
    public blockDocumentEditorService: BlockDocumentEditorService,
    public documentService: DocumentService,
    private domService: DomService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private cdkEditor: CKEditorService,
    private tranlsateService: TranslateService,
    private config: AppConfigService,
    private coEditionWSService: CoEditionServiceWS,
    private dialogService: EuiDialogService,
    private appShellService: UxAppShellService,
    public breadcrumbService: EuiBreadcrumbService,
    public environmentService: EnvironmentService,
    private loadingService: LoadingService,
    private domSanitizer: DomSanitizer,
    public tocService: TableOfContentService,
    private tocEditService: TableOfContentEditService,
    private hostElRef: ElementRef,
    private syncScrollingService: SyncDocumentScrollService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(DOCUMENT_ACTIONS_SERVICE)
    private documentActions: DocumentActionsService,
    public versionCompareService: VersionCompareService,
    private viewVersionService: ViewVersionService,
    private pageModeService: PageModeService,
    public mergeContributionService: MergeContributionsService,
    private leosLightService: LeosLightService,
  ) {
    this.contributionChanges$ = this.contributionChangesBS.asObservable();

    combineLatest([this.route.params, this.route.data])
      .pipe(take(1))
      .subscribe(([params, data]) => {
        this.documentRef = params.id;
        this.documentType = data.category;

        //init services
        this.tocService.setDocumentRefAndCategory(
          this.documentRef,
          this.documentType,
        );
        this.documentService.setDocumentRefAndCategory(
          this.documentRef,
          this.documentType,
        );
      });

    this.documentService.refreshConnectors$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.documentService.updateElementContent(data);
        this.cdkEditor.refreshStateAllAvailableConnectors();
      });

    this.pageModeService.pageMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((pageMode) => {
        this.pageMode = pageMode;
        window.requestAnimationFrame(() => {
          const documentPanes =
            this.hostElRef?.nativeElement.querySelectorAll('.document-pane') ??
            [];
          [...documentPanes].forEach((el) => (el.style.flexBasis = ''));
        });
      });

    this.contributionChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe((changes) => {
        this.mergeContributionService.updateContributionChanges(changes);
      });

    this.applyActionDisabled$ = this.applyActionDisabledBS.asObservable();
  }

  ngOnInit(): void {
    this.presenterId = uuidv4();
    this.coEditionWSService.setPresenterId(this.presenterId);
    this.isSyncScrollEnabled$ = this.syncScrollingService.isSyncScrollEnabled$;

    this.config.config.pipe(takeUntil(this.destroy$)).subscribe((config) => {
      this.profile = config.profile;
      this.connectedEntity = (
        config.user.connectedEntity ?? config.user.defaultEntity
      ).name;
      this.showStatusFilter = config.annotateAuthority === 'LEOS';
    });

    this.loadStyleSheet();

    this.documentService.documentView$
      .pipe(takeUntil(this.destroy$), filter(Boolean))
      .subscribe((documentView) => {
        this.loadingService.setTaskOver('refresh', this.documentRef);
        this.documentService.setDidDocumentLoadAndRender(true);
        this.loadDocument = true;
        this.proposalRef = documentView.proposalRef;
      });

    this.tocService.isEditMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((editMode) => {
        this.isEditMode = editMode;
      });

    this.tocService.tocItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tocItems) => {
        this.tocItems = tocItems;
        if (tocItems?.length > 0)
          this.dragItems = this.buildTocItemToTOC(tocItems);
      });

    this.viewVersionService.versionView$
      .pipe(takeUntil(this.destroy$))
      .subscribe((versionView) => {
        if (versionView) {
          this.versionForView = this.cleanupAndSerializeXML(
            versionView.editableXml,
            `doubleCompare-${this.documentRef}`,
          );
        }
      });

    this.versionCompareService.versionCompareView$
      .pipe(takeUntil(this.destroy$))
      .subscribe((versionCompareXML) => {
        if (versionCompareXML) {
          this.versionsComparisonForView = this.cleanupAndSerializeXML(
            versionCompareXML,
            `marked-${this.documentRef}`,
          );
        } else {
          this.versionCompareService.clearVersionComparisonView();
        }
      });

    this.pageTitle$ = this.documentService.pageTitle$.pipe(
      takeUntil(this.destroy$),
    );

    this.viewVersionService.cleanVersionView$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cleanVersionView) => {
        if (!!cleanVersionView && !!cleanVersionView.editableXml) {
          this.versionForView = this.cleanupAndSerializeXML(
            cleanVersionView.editableXml,
            `doubleCompare-${this.documentRef}`,
          );
          setTimeout(() => this.syncScrollingService.setSyncScroll(true));
        }
      });

    this.mergeContributionService.contributionViewAndMerge$
      .pipe(takeUntil(this.destroy$))
      .subscribe(([contributionView, contribution]) => {
        this.handleContributionView(contributionView, contribution);
        this.contribution = contribution;
        setTimeout(() => this.syncScrollingService.setSyncScroll(true));
        this.mergeContributionService.checkHandleNavCompareBtnDisabled();
        this.cdkEditor.refreshStateAllAvailableConnectors();
      });

    this.documentService.documentConfig$
      .pipe(takeUntil(this.destroy$))
      .subscribe((config) => {
        this.documentConfig = config;
        this.manageBreadCrumbsDocumentScreen();
      });

    this.mergeContributionService.contributions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((contributions) => {
        this.contributions = contributions;
        this.showContributionsPane = this.contributions.length > 0;
        if (this.contribution) {
          this.contribution = contributions.find(
            (c) => c.legFileName === this.contribution.legFileName,
          );
          if (this.pageMode === PageMode.Contribution) {
            this.mergeContributionService.viewAndMergeContribution(
              this.contribution,
            );
          }
        }
      });

    this.mergeContributionService.processed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(([processed, contribution]) => {
        this.processed = processed;
        if (contribution) {
          this.handleGreyedContribution(contribution, processed);
          this.mergeContributionService.setIsContributionDeclinedOrProcessed(
            contribution.contributionStatus ===
              ContributionStatus.ContributionDone,
          );
          this.contribution = contribution;
        }
      });
  }

  ngAfterViewInit(): void {
    const presenterId = this.coEditionWSService.presenterId;
    this.coEditionWSService.joinSubDocumentChannel(this.documentRef);
    this.coEditionWSService.latestMessage
      .pipe(takeUntil(this.destroy$))
      .subscribe((latestMessage) => {
        if (
          latestMessage.info?.sessionId !== null &&
          latestMessage.info.presenterId !== presenterId &&
          latestMessage.info.documentId === this.documentRef
        ) {
          this.appShellService.growl({
            severity: 'info',
            summary: 'Co Edition update',
            detail: `${latestMessage.info.userName} ${this.translate.instant(
              `page.editor.co-edition-update.co-edition-${
                latestMessage.operation === 'REMOVE' ? 'stopped' : 'started'
              }`,
            )}`,
            life: 6000,
          });
        }
      });

    this.loadingService.task$
      .pipe(takeUntil(this.destroy$), debounceTime(500))
      .subscribe((latestTask) => {
        if (latestTask.ongoing) {
          if (
            !this.tasksOngoing.some(
              (i) => i.name === latestTask.taskName && i.key === latestTask.key,
            )
          ) {
            this.tasksOngoing.push({
              name: latestTask.taskName,
              key: latestTask.key,
            });
          }
        } else if (
          this.tasksOngoing.some(
            (i) => i.name === latestTask.taskName && i.key === latestTask.key,
          )
        ) {
          this.tasksOngoing = this.tasksOngoing.filter(
            (item) =>
              item.name !== latestTask.taskName && item.key !== latestTask.key,
          );
        }
        let target = '';
        this.tasksOngoing
          .filter(
            (value, index, array) =>
              index === array.findIndex((item) => item.name === value.name),
          )
          .forEach(
            (c) =>
              (target =
                target +
                ' ' +
                this.translate.instant('task.' + c.name + '.ongoing') +
                ' '),
          );
        if (this.tasksOngoing.length > 0) {
          this.appShellService.growl({
            severity: 'info',
            summary: 'Tasks ongoing',
            detail: target,
            sticky: true,
          });
        } else {
          this.appShellService.growl({
            severity: 'info',
            summary: 'Tasks over',
            detail: target,
            life: 1,
          });
        }
      });
  }

  onSearch() {
    const values = this.versionSearchForm.value;
    this.documentService.setVersionSearchParams(values);
  }

  ngOnDestroy() {
    this.tocService.setIsEditMode(false);
    // called on every document view page destruction in order to avoid multiple instances of ckeditor
    this.cdkEditor.destroyDocumentEditor();
    //remove every session related actions from the user and clean the document relaod if it is present
    this.coEditionWSService.setShouldReloadAfterUpdate();
    this.coEditionWSService.removeDocumentCoEditInfo(this.documentRef);
    this.coEditionWSService.removeSession();
    this.viewVersionService.closeVersionView();
    this.versionCompareService.closeVersionComparisonView();
    this.mergeContributionService.closeContributionMergeView();
    this.closeContributionsView();
    this.destroy$.next(null);
    this.destroy$.complete();
    this.unloadStyleSheet?.();
    this.documentActions.resetDocumentActions();
  }

  disableUndoButton() {
    if (this.documentTocComponent)
      return this.tocEditService.getTreeHistorySize() === 0;
    return false;
  }

  disableSaveButton() {
    if (this.documentTocComponent)
      return (
        this.documentTocComponent.invalidNodes?.size > 0 ||
        !this.documentTocComponent.isToCDraft
      );

    return false;
  }

  hanldeListItemDragged(event, isAdd) {
    this.documentTocComponent.dragMoved(event, isAdd);
  }

  onRebuildTocItems(event: boolean) {
    if (event && this.tocItems) {
      this.dragItems = this.buildTocItemToTOC(this.tocItems);
    }
  }

  onToggleAnnotationsPaneCollapsed(
    collapsed = !this.isAnnotationsPaneCollapsed,
  ) {
    this.isAnnotationsPaneCollapsed = collapsed;
    if (!collapsed) {
      this.onToggleContributionAnnotationsPaneCollapsed(true);
    }
  }

  onToggleContributionAnnotationsPaneCollapsed(
    collapsed = !this.isContributionAnnotationsPaneCollapsed,
  ) {
    this.isContributionAnnotationsPaneCollapsed = collapsed;
    if (!collapsed) {
      this.onToggleAnnotationsPaneCollapsed(true);
    }
  }

  handleEdit() {
    const coEdition = this.coEditionWSService.checkForCoEdition('EDIT_TOC');
    if (coEdition) {
      this.dialogService.openDialog({
        title: this.tranlsateService.instant(
          'page.editor.co-edition-detected.title',
        ),
        bodyComponent: {
          component: CoEditionDetectedDialogComponent,
        },
        accept: () => {
          this.editInlineToC();
        },
        dismiss: () => {
          this.tocService.setIsEditMode(false);
        },
      });
    } else {
      this.editInlineToC();
    }
  }

  editInlineToC() {
    this.tocService.setIsEditMode(true);
    //set the styling for the toc
    this.documentService.setAnnotationMode('READ_ONLY');
    this.coEditionWSService.sendTocInlineEdit(this.documentRef);
  }

  handleUndo() {
    const oldToc = this.tocEditService.popTreeHistory();
    if (oldToc.length > 0) {
      this.tocEditService.setTree(oldToc);
      if (this.documentTocComponent.isNodeSelected()) {
        const newSelectedNode = findNodeById(
          oldToc,
          this.documentTocComponent.selectedNode.id,
        );
        if (newSelectedNode)
          this.documentTocComponent.handleNodeSelect(newSelectedNode);
      }
    }
  }

  handleSave() {
    const toc = cloneDeep(this.tocStructure);
    this.prepareTocForSave(toc);
    this.tocService
      .saveToc(this.documentRef, this.documentType, toc)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.documentTocComponent.isToCDraft = false;
          this.documentTocComponent.clearSelectedNode();
          this.tocEditService.resetTreeHistory();
          this.documentService.reloadDocument();
          this.tocService.reload();
        },
        error: (err) => {},
      });
  }

  handleCancel() {
    if (this.documentTocComponent.isToCDraft) {
      //TODO: handle confirm you want to discard changes
      this.unSavedDialog.openDialog();
      //reset toc state
      this.documentTocComponent.isToCDraft = false;
    } else {
      this.closeInlineToCEdit();
    }
  }

  getTocItemDisplayTitle(item: TocItem) {
    if (item.numberingType === 'BULLET_NUM') {
      return this.tranlsateService.instant('toc.item.type.bullet');
    }
    if (item.aknTag === 'CROSS_HEADING') {
      return this.tranlsateService.instant('toc.item.type.crossheading');
    } else {
      return this.tranlsateService.instant(
        'toc.item.type.' + item.aknTag.toLowerCase(),
      );
    }
  }

  getTranlsations(msg: string) {
    return this.tranlsateService.instant(msg);
  }

  hanldeUnSaveDialogClose(save: boolean) {
    if (this.documentTocComponent.invalidNodes?.size > 0) {
      this.appShellService.growl({
        severity: 'danger',
        summary: this.tranlsateService.instant(
          'global.notifications.title.error',
        ),
        detail: this.tranlsateService.instant(
          'page.editor.toc.invalid-node.save-and-close-error',
        ),
        life: 4000,
      });
    } else {
      if (save) {
        this.handleSave();
      }
      this.closeInlineToCEdit();
    }
    this.unSavedDialog.closeDialog();
  }

  handleSaveAndClose() {
    this.handleSave();
    this.closeInlineToCEdit();
  }

  expandAll() {
    this.isCollapseToc = !this.isCollapseToc;
    if (this.isCollapseToc) {
      this.documentTocComponent.colllapseAll();
      return;
    }
    this.documentTocComponent.expandAll();
  }

  toggleVersionComparisonView() {
    this.versionCompareService.toggleCompareMode();
  }

  handleClose() {
    if (this.document.querySelectorAll('.cke').length > 0) {
      this.openEditorDialog.openDialog();
    } else {
      this.cdkEditor.closeElementEditor();
      const proposalRef = this.documentConfig.proposalMetadata?.ref;
      if (proposalRef) {
        this.router.navigate([`/collection/${proposalRef}`]);
      }
    }
  }

  onCancelClose() {
    this.openEditorDialog.closeDialog();
  }

  onConfirmClose() {
    this.openEditorDialog.closeDialog();
    this.cdkEditor.closeElementEditor();
    //wait for the API where we get all the metadata for each document
    if (this.proposalRef) {
      this.router.navigate([`/collection/${this.proposalRef}`]);
    }
  }

  onSidebarShown() {
    if (this.isAnnotationsPaneCollapsed) {
      this.onToggleAnnotationsPaneCollapsed(false);
    }
  }

  onContributionAnnotationsSidebarShown() {
    if (this.isContributionAnnotationsPaneCollapsed) {
      this.onToggleContributionAnnotationsPaneCollapsed(false);
    }
  }

  onTocPaneExpanded(e: any) {
    this.isTocPaneExpanded = !this.isTocPaneExpanded;
    if (this.isVersionsPaneExpanded) {
      this.isVersionsPaneExpanded = false;
    }
    if (this.isContributionsPaneExpanded) {
      this.isContributionsPaneExpanded = false;
    }
  }

  onVersionsPaneExpanded(e: any) {
    this.isVersionsPaneExpanded = !this.isVersionsPaneExpanded;
    if (this.isTocPaneExpanded) {
      this.isTocPaneExpanded = false;
    }
    if (this.isContributionsPaneExpanded) {
      this.isContributionsPaneExpanded = false;
    }
  }

  onContributionsPaneExpanded(e: any) {
    this.isContributionsPaneExpanded = !this.isContributionsPaneExpanded;
    if (this.isTocPaneExpanded) {
      this.isTocPaneExpanded = false;
    }
    if (this.isVersionsPaneExpanded) {
      this.isVersionsPaneExpanded = false;
    }
  }

  closeContributionsView(setMode = true) {
    if (setMode) this.pageModeService.setPageMode(PageMode.Normal);
    if (
      this.contribution &&
      this.contribution.contributionStatus ===
        ContributionStatus.ContributionDone
    ) {
      this.syncScrollingService.setSyncScroll(true);
    }
    this.mergeContributionService.handleContributionSelectCount(false, true);
    this.mergeContributionService.setContributionViewAndMergeCollapsed(true);
  }

  onSelectAction(e: any) {
    this.contributionActionSelected = e.target.value;
    this.mergeContributionService.contributionSelections$.subscribe(
      (selections) => {
        if (selections > 0) {
          this.applyActionDisabledBS.next(false);
        }
      },
    );
  }

  protected exploreMilestone(version: Version) {
    this.milestoneViewData = {
      createdBy: version.createdBy,
      createdDate: version.updatedDate,
      versionedReference: version.versionedReference,
      legDocumentName: null,
      proposalRef: this.proposalRef,
      title: version.checkinCommentVO.title,
    };
    setTimeout(() => this.milestoneViewDialog.open(), 0);
  }

  protected onMilestoneViewDialogClosed() {
    this.milestoneViewData = null;
  }

  private handleContributionView(
    contributionView: DocumentViewResponse,
    contribution: ContributionVO,
  ) {
    if (contributionView) {
      const html = this.cleanupAndSerializeXML(contributionView.editableXml);
      this.contributionForView = html.replace(
        /\s(id|leos:softmove_to|leos:softmove_from)="/gi,
        (match) => `${match}revision-`,
      );
      this.isViewContributionPaneCollapsed = false;
      this.mergeContributionService.setContributionViewAndMergeCollapsed(false);
      this.mergeContributionService.setIsContributionDeclinedOrProcessed(
        contribution.contributionStatus === ContributionStatus.ContributionDone,
      );
      if (
        contribution.contributionStatus === ContributionStatus.ContributionDone
      ) {
        this.handleGreyedContribution(contribution, true);
      } else {
        this.cdkEditor.triggerMergeContributionConnectorStateChange();
        setTimeout(() => {
          this.handleContributionsChanges();
          this.cdkEditor.refreshStateSpecificConnectors();
        }, 100);
      }
    }
    this.contributionTemporaryDataId = contributionView?.temporaryAnnotationsId;
    this.contributionTemporaryDataDocument =
      contributionView?.temporaryDataDocument;
  }

  private handleGreyedContribution(
    contribution: ContributionVO,
    greyed: boolean,
  ) {
    contribution.greyed = greyed;
    return contribution;
  }

  private handleContributionsChanges() {
    const nodeList = this.contributionViewContainerElement
      ? this.contributionViewContainerElement.nativeElement?.querySelectorAll(
          '.merge-contribution-wrapper',
        )
      : [];
    const elemList = nodeList ? [...nodeList] : [];
    this.contributionChangesBS.next(elemList);
  }

  private reloadComponent() {
    // TODO: reload document and services without page reload
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  private disableDocument() {
    const xml = this.document.getElementById(`${this.documentRef}`);
    xml.style.opacity = '0.3';
    xml.style.pointerEvents = 'none';
    xml.style.userSelect = 'none';
  }

  private enableDocument() {
    const xml = this.document.getElementById(`${this.documentRef}`);
    xml.style.opacity = '1';
    xml.style.pointerEvents = 'all';
    xml.style.userSelect = 'all';
  }

  private closeInlineToCEdit() {
    this.documentTocComponent.messageFromValidation = null;
    this.documentTocComponent.isDropValid = null;
    this.tocService.setIsEditMode(false);
    this.documentTocComponent.resetTreeState();
    this.documentTocComponent.clearHighlightInvalidNodes();
    this.coEditionWSService.removeTocInlineEdit(this.documentRef);
    this.documentService.setAnnotationMode('NORMAL');
  }

  private get tocStructure() {
    return this.documentTocComponent.treeControl.dataNodes;
  }

  private prepareTocForSave(node: TableOfContentItemVO[]) {
    for (const n of node) {
      n['childItemsView'] = [];
      if (n.childItems && n.childItems.length > 0) {
        this.prepareTocForSave(n.childItems);
      }
    }
  }

  private buildTocItemToTOC(
    tocItems: TocItem[],
  ): Array<Partial<TableOfContentItemVO>> {
    const dragItems: Array<Partial<TableOfContentItemVO>> = [];
    for (const item of tocItems) {
      if (!item.root && item.draggable) {
        let number = null;
        let heading = null;
        let content = '';

        if (item.itemNumber === 'MANDATORY' || item.itemNumber === 'OPTIONAL') {
          number = this.tranlsateService.instant('toc.item.type.number');
        }

        if (item.itemHeading === 'MANDATORY') {
          heading = this.tranlsateService.instant(
            'toc.item.type.' + item.aknTag.toLowerCase() + '.heading',
          );
        }

        if (item.contentDisplayed) {
          content =
            item.aknTag.toLowerCase() === 'recital' ||
            item.aknTag.toLowerCase() === 'citation'
              ? capitalizeFirstLetter(item.aknTag) + '...'
              : 'Text...';
        }
        dragItems.push({
          tocItem: item,
          heading,
          number,
          content,
          childItems: [],
          id: '_' + uniqueId(),
        });
      }
    }
    return dragItems;
  }

  private loadStyleSheet() {
    const typeLC = this.documentType.toLowerCase();
    const category = typeLC === 'council_explanatory' ? 'explanatory' : typeLC;

    this.config.config.subscribe((config) => {
      // 'http://localhost:8080/leos-pilot/assets/css/annex.css?cacheToken_1667202194805'
      // FIXME: import stylesheets to ngui?
      const stylesName = DOCUMENT_STYLES[category] ?? category;
      const cssUrl = `${config.mappingUrl}/assets/css/${stylesName}.css`;
      const unloadStyleSheet = this.domService.setDynamicStyle(cssUrl);
      this.unloadStyleSheet = () => {
        unloadStyleSheet();
        document
          .querySelector('.leos-document-view')
          ?.classList.remove('leos-document-view');
      };
    });

    // Add `leos-document-view` class on closest parent `div` (important!)
    // element. It is required for some style selectors. It used to reside on
    // the VAADIN `div.v-customcomponent.v-widget` element, surrounding the
    // editor page content.
    this.hostElRef.nativeElement
      .closest('div')
      .classList.add('leos-document-view');
  }

  private cleanupAndSerializeXML(xml: string, akomantosoId?: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/html');
    const akomantosoEl = xmlDoc.querySelector('akomantoso');

    if (this.documentType !== 'coverPage') {
      akomantosoEl
        .querySelectorAll('meta, coverPage')
        .forEach((el) => el.remove());
    }

    if (akomantosoId) {
      akomantosoEl.id = akomantosoId;
    }
    return akomantosoEl.outerHTML;
  }

  private sanitizePageTitle(title: string): string {
    if (!title) {
      return title;
    }
    let resultTitle = title.replace(/<del[^>]*?>[\s\S]*?<\/del>/gi, '');
    resultTitle = resultTitle.replace(/<\/?ins[^>]*?>/gi, '');
    return this.domSanitizer.sanitize(SecurityContext.HTML, resultTitle) || '';
  }

  private getBreadCrumbsDocumentName(name: string): string {
    switch (this.documentType) {
      case 'bill':
        return this.tranlsateService.instant('global.breadcrumb.bill');
      case 'memorandum':
        return this.tranlsateService.instant('global.breadcrumb.memorandum');
      case 'coverPage':
        return this.tranlsateService.instant('global.breadcrumb.cover.page');
      case 'stat_financ_legis':
        return this.tranlsateService.instant(
          'global.breadcrumb.financial-statement',
        );
      default:
        return capitalizeFirstLetter(name);
    }
  }

  private manageBreadCrumbsDocumentScreen() {
    if (!this.documentConfig.proposalMetadata) {
      return;
    }
    this.breadcrumbService.setBreadcrumb([
      {
        id: 'home',
        label: this.tranlsateService.instant('app.breadcrumb.home'),
        link: `/home`,
      },
      {
        id: 'workspace',
        label: this.tranlsateService.instant('global.breadcrumb.proposals'),
        link: `/workspace`,
      },
      {
        id: 'proposal_view',
        label: this.tranlsateService.instant('global.breadcrumb.proposal_view'),
        link: `/collection/${this.documentConfig.proposalMetadata.ref}`,
      },
      {
        id: 'document_view',
        label: this.getBreadCrumbsDocumentName(this.documentType),
        link: null,
      },
    ]);
  }

  get showBreadcrumb() {
    return !this.profile || this.profile.breadcrumb;
  }

  get showCloseButton() {
    return !this.profile || this.profile.closeDocument;
  }

  get showMarkAsDoneButton() {
    return this.documentActions.showMarkAsDoneButton;
  }

  get showTocEditButton() {
    return !this.profile || this.profile.tocEdition;
  }

  get showAnnotations() {
    return !this.profile || this.profile.annotations;
  }
}
