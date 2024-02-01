import { TemplatePortal } from '@angular/cdk/portal';
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
  combineLatestWith,
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  Observable,
  of,
  Subject,
  take,
  takeUntil,
} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { AppConfigService } from '@/core/services/app-config.service';
import { DOCUMENT_ACTIONS_SERVICE } from '@/features/akn-document/akn-document.module';
import { DownloadEconsiliumModalComponent } from '@/features/akn-document/components/download-econsilium-modal/download-econsilium-modal.component';
import { DocumentTocComponent } from '@/features/akn-document/containers/document-toc/document-toc.component';
import { Version } from '@/features/akn-document/models';
import { DocumentActionsService } from '@/features/akn-document/services/document-actions.service';
import { TocInlineEditMenuService } from '@/features/akn-document/services/toc-inline-edit-menu.service';
import { ContributionStatus, DOCUMENT_STYLES, DocumentConfig } from '@/shared';
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
import { LoadingService } from '@/shared/services/loading.service';
import { parentHasClass } from '@/shared/utils';
import { capitalizeFirstLetter } from '@/shared/utils/string.utils';
import { findNodeById } from '@/shared/utils/toc.utils';

import { BlockDocumentEditorService } from '../../services/block-document-editor.service';
import { CKEditorService } from '../../services/ckeditor.service';
import { SyncDocumentScrollService } from '../../services/sync-document-scroll.service';
import { TableOfContentService } from '../../services/table-of-content.service';
import { TableOfContentEditService } from '../../services/table-of-content-edit.service';

enum PageMode {
  Normal,
  ViewVersion,
  CompareVersions,
  Contribution,
}

const compareClasses = [
  'leos-content-removed',
  'leos-content-removed-cn',
  'leos-content-new',
  'leos-content-new-cn',
  'leos-double-compare-removed',
  'leos-double-compare-added',
];

@Component({
  selector: 'app-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.scss'],
  providers: [AnnotateService],
})
export class DocumentEditorComponent
  implements OnDestroy, OnInit, AfterViewInit
{
  presenterId: string;
  connectedEntity: string;
  containerId = 'docContainer';
  documentRef: string;
  documentType: string;
  pageTitle: string;
  pageSubTitle: string;
  proposalRef: string;
  showStatusFilter: boolean;
  loadDocument: boolean;
  isCollapseToc = false;
  versionForView: string;
  versionForViewHeaderTitle: string;
  versionsComparisonForView: string;
  versionsComparisonForViewHeaderTitle$: Observable<string>;
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
  compareChanges: NodeListOf<HTMLElement>;
  navigationAnchorsList: HTMLElement[];
  navigationAnchorIndex = -1;
  arrowClicked = false;
  tooltipsDelay = 1000;

  versionSearchForm = new FormGroup({
    type: new FormControl('all'),
    author: new FormControl(''),
  });

  isCNInstance = process.env.NG_APP_LEOS_INSTANCE === 'cn';

  id: string;
  baseECVersion = '0.1.0';

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
  @ViewChild('mergeAllContributionsChangesDialog')
  mergeAllContributionsChangesDialog: EuiDialogComponent;
  //   @ViewChild('markContributionAsProcessedDialog')
  //   markContributionAsProcessedDialog: EuiDialogComponent;
  @ViewChild('confirmAnnexStructureChangeDialog')
  annexStructureChangeDialog: ConfirmDeleteDialogComponent;

  @ViewChild('milestoneViewDialog')
  protected milestoneViewDialog: ProposalMilestoneViewComponent;
  protected milestoneViewData: MilestoneDescriptor = null;
  protected PageMode = PageMode;
  protected pageMode = PageMode.Normal;

  @ViewChild('eConsiliumModal')
  eConsiliumModal: DownloadEconsiliumModalComponent;

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
    private tableOfContentService: TableOfContentService,
    private domSanitizer: DomSanitizer,
    public tocService: TableOfContentService,
    private tocEditService: TableOfContentEditService,
    private tocInlineMenu: TocInlineEditMenuService,
    private hostElRef: ElementRef,
    private syncScrollingService: SyncDocumentScrollService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(DOCUMENT_ACTIONS_SERVICE)
    private documentActions: DocumentActionsService,
  ) {
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
      });

    this.documentService.refreshConnectors$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.documentService.updateElementContent(data);
        this.cdkEditor.refreshStateAllAvailableConnectors();
      });

    this.applyActionDisabled$ = this.applyActionDisabledBS.asObservable();
    this.contributionChanges$ = this.contributionChangesBS.asObservable();
  }

  ngOnInit(): void {
    this.presenterId = uuidv4();
    this.coEditionWSService.setPresenterId(this.presenterId);
    this.isSyncScrollEnabled$ = this.syncScrollingService.isSyncScrollEnabled$;
    combineLatest([this.route.params, this.route.data, this.config.config])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([params, data, config]) => {
        this.connectedEntity = (
          config.user.connectedEntity ?? config.user.defaultEntity
        ).name;
        this.showStatusFilter = config.annotateAuthority === 'LEOS';
        this.documentService.setDocumentRefAndCategory(
          this.documentRef,
          this.documentType,
        );
      });
    this.loadStyleSheet();

    this.documentService.documentView$
      .pipe(takeUntil(this.destroy$))
      .subscribe((documentView) => {
        this.loadingService.setTaskOver('refresh', this.documentRef);
        this.documentService.setDidDocumentLoadAndRender(true);
        this.loadDocument = true;
        this.setPageSubTitle(
          documentView.versionInfoVO.documentVersion,
          `${documentView.versionInfoVO.lastModifiedBy} (${documentView.versionInfoVO.entity})`,
          documentView.versionInfoVO.lastModificationInstant,
          documentView.versionInfoVO.baseVersionTitle,
          documentView.versionInfoVO.revisedBaseVersion,
        );
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

    this.documentService.versionView$
      .pipe(takeUntil(this.destroy$))
      .subscribe((versionView) => {
        if (versionView !== null) {
          this.setPageMode(PageMode.ViewVersion);
          this.versionForView = this.cleanupAndSerializeXML(
            versionView.editableXml,
            `doubleCompare-${this.documentRef}`,
          );
          this.setVersionForViewHeader(versionView.versionInfoVO);
        }
      });

    this.documentService.cleanVersionView$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cleanVersionView) => {
        this.setPageMode(PageMode.ViewVersion);
        if (!!cleanVersionView && !!cleanVersionView.editableXml) {
          this.versionForView = this.cleanupAndSerializeXML(
            cleanVersionView.editableXml,
            `doubleCompare-${this.documentRef}`,
          );
          this.setVersionForViewHeader(cleanVersionView.versionInfoVO);
        }
      });

    this.documentService.compareModeEnabled$
      .pipe(takeUntil(this.destroy$))
      .subscribe((enabled) => {
        this.setPageMode(enabled ? PageMode.CompareVersions : PageMode.Normal);
      });

    this.documentService.contributionModeEnabled$
      .pipe(takeUntil(this.destroy$))
      .subscribe((enabled) => {
        this.setPageMode(enabled ? PageMode.Contribution : PageMode.Normal);
      });

    this.documentService.contributionViewAndMerge$
      .pipe(takeUntil(this.destroy$))
      .subscribe(([contributionView, contribution]) => {
        this.handleContributionView(contributionView, contribution);
        this.contribution = contribution;
      });

    this.versionsComparisonForViewHeaderTitle$ =
      this.documentService.versionCompareIds$.pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        combineLatestWith(merge(of(null), this.translate.onLangChange)),
        map(([versions]) => this.getVersionComparisonViewHeaderTitle(versions)),
      );

    this.documentService.documentConfig$
      .pipe(takeUntil(this.destroy$))
      .subscribe((config) => {
        this.documentConfig = config;
        this.setPageTitle();
        this.manageBreadCrumbsDocumentScreen();
      });

    this.documentService.versionCompareView$
      .pipe(takeUntil(this.destroy$))
      .subscribe((versionCompareXML) => {
        if (versionCompareXML) {
          this.versionsComparisonForView = this.cleanupAndSerializeXML(
            versionCompareXML,
            `marked-${this.documentRef}`,
          );
          setTimeout(() => {
            this.syncScrollingService.setSyncScroll(true);
            this.handleCompareChanges();
          });
        } else {
          this.syncScrollingService.setSyncScroll(false);
          this.clearVersionComparisonView();
        }
      });

    this.documentService.contributions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((contributions) => {
        this.contributions = contributions;
        this.showContributionsPane = this.contributions.length > 0;
        this.greyContributions();
      });

    this.documentService.processed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(([processed, contribution]) => {
        this.processed = processed;
        if (contribution) {
          this.handleGreyedContribution(contribution, processed);
          this.documentService.setIsContributionDeclinedOrProcessed(
            contribution.contributionStatus ===
              ContributionStatus.ContributionDone,
          );
          this.contribution = contribution;
        }
      });

    this.documentService.versionLatest$.subscribe((version) => {
      if (version)
        this.setPageSubTitle(
          this.formatVersionNumber(version),
          version.createdBy,
          version.updatedDate,
          null,
          null,
        );
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

    this.documentService.titlePageBS
      .pipe(takeUntil(this.destroy$))
      .subscribe((title) => {
        this.pageTitle = title;
      });
  }

  onSearch() {
    const values = this.versionSearchForm.value;
    this.documentService.setVersionSearchParams(values);
  }

  toggleSyncScroll() {
    this.syncScrollingService.setSyncScroll(
      !this.syncScrollingService.isSyncScrollEnabled,
    );
  }

  downloadXmlFile(v: any) {
    this.documentService.versionCompareIds$
      .pipe(take(1))
      .subscribe((versions) => {
        this.documentService.compareDocumentsDownloadXML(
          versions[1],
          versions[0],
          this.getIntermediateVersion(versions),
        );
      });
  }

  downloadPdfFile() {
    this.documentService.versionCompareIds$
      .pipe(take(1))
      .subscribe((versions) => {
        this.documentService.compareDocumentsExportAsPdf(
          versions[1],
          versions[0],
          this.getIntermediateVersion(versions),
        );
      });
  }

  downloadVersionOfFile() {
    this.documentService.versionCompareIds$
      .pipe(take(1))
      .subscribe((versions) => {
        this.documentService.compareDocumentsDownloadDocuwrite(
          versions[1],
          versions[0],
          this.getIntermediateVersion(versions),
        );
      });
  }

  downloadVersionOfPDF() {
    this.documentService.versionCompareIds$
      .pipe(take(1))
      .subscribe((versions) => {
        this.documentService.compareDocumentsDownloadPDF(
          versions[1],
          versions[0],
          this.getIntermediateVersion(versions),
        );
      });
  }

  downloadVersionOfFileEConsil() {
    this.documentService.versionCompareIds$
      .pipe(take(1))
      .subscribe((versions) => {
        this.eConsiliumModal.open({
          currentVersion: versions[1],
          originalVersion: versions[0],
          intermediateVersion: this.getIntermediateVersion(versions),
        });
      });
  }

  ngOnDestroy() {
    //remove every session related actions from the user and clean the document relaod if it is present
    this.tocService.setIsEditMode(false);
    this.coEditionWSService.setShouldReloadAfterUpdate();
    this.coEditionWSService.removeDocumentCoEditInfo(this.documentRef);
    this.coEditionWSService.removeSession();
    this.closeVersionView();
    this.closeVersionComparisonView();
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

  confirmAnnexStructureChange() {
    const nextAnnexStructure =
      this.documentConfig.documentsMetadata.find(
        (d) => d.ref === this.documentRef,
      ).template === 'SG-018'
        ? 'level'
        : 'article';

    const content = this.tranlsateService.instant(
      `editor-switch-annex-structure-to-${nextAnnexStructure}-content`,
    );
    const conteSanitized = this.domSanitizer.bypassSecurityTrustHtml(content);

    this.dialogService.openDialog({
      title: this.tranlsateService.instant(
        'editor.annex-structure-change-title',
      ),
      content: conteSanitized as TemplatePortal,
      acceptLabel: 'Confirm',
      accept: () => {
        this.handleAnnexChangeStructure();
      },
    });
  }

  handlePrevChange() {
    if (this.navigationAnchorIndex > -1) {
      // this.isScrollFromButton = true;
      // const filteredParents = this.getFilteredParents();
      const prevIndex =
        this.navigationAnchorIndex - 1 < 0 ? 0 : this.navigationAnchorIndex - 1;
      const targetElement = this.navigationAnchorsList[prevIndex];
      requestAnimationFrame(() => {
        // Scroll the target element into view
        targetElement.scrollIntoView({
          block: 'start',
        });
      });

      setTimeout(() => {
        this.syncScrollingService.syncScrollByNavigationChange(targetElement);
      });
      this.navigationAnchorIndex--;
      this.arrowClicked = true;
    }
  }

  handleNextChange() {
    if (
      this.navigationAnchorIndex !== this.navigationAnchorsList.length - 1 &&
      this.navigationAnchorsList.length > 0
    ) {
      const targetElement =
        this.navigationAnchorsList[this.navigationAnchorIndex + 1];
      requestAnimationFrame(() => {
        // Scroll the target element into view
        targetElement.scrollIntoView({
          block: 'start',
        });
      });

      setTimeout(() => {
        this.syncScrollingService.syncScrollByNavigationChange(targetElement);
      });

      this.navigationAnchorIndex++;
      this.arrowClicked = true;
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
    //TODO : implement cancel
    this.tocService.setIsEditMode(this.isReady);
    if (this.documentTocComponent.isToCDraft) {
      //TODO: handle confirm you want to discard changes
      this.unSavedDialog.openDialog();
      //reset toc state
      this.documentTocComponent.isToCDraft = false;
    } else {
      this.closeInlineToCEdit(true);
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
      this.closeInlineToCEdit(true);
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

  closeVersionView(setMode = true) {
    this.documentService.resetZoomValues();
    if (setMode) this.setPageMode(PageMode.Normal);
  }

  toggleVersionComparisonView() {
    this.documentService.toggleCompareMode();
  }

  closeVersionComparisonView(setMode = true) {
    if (setMode) this.setPageMode(PageMode.Normal);
    this.clearVersionComparisonView();
    this.documentService.toggleCompareMode(false);
  }

  clearVersionComparisonView() {
    this.compareChanges = null;
    this.navigationAnchorsList = [];
    this.navigationAnchorIndex = -1;
    this.removeAllPins();
    this.versionsComparisonForView = null;
  }

  handleClose() {
    const proposalRef = this.documentConfig.proposalMetadata.ref;
    if (this.document.querySelectorAll('.cke').length > 0) {
      this.openEditorDialog.openDialog();
    } else {
      this.cdkEditor.closeElementEditor();
      this.router.navigate([`/collection/${proposalRef}`]);
    }
  }

  handleAnnexChangeStructure() {
    this.documentService
      .switchDocumentStructure()
      .pipe(take(1))
      .subscribe(() => {
        this.reloadComponent();
      });
  }

  onCancelClose() {
    this.openEditorDialog.closeDialog();
  }

  onConfirmClose() {
    this.openEditorDialog.closeDialog();
    this.cdkEditor.closeElementEditor();
    //wait for the API where we get all the metadata for each document
    this.router.navigate([`/collection/${this.proposalRef}`]);
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
    if (setMode) this.setPageMode(PageMode.Normal);
    if (
      this.contribution &&
      this.contribution.contributionStatus ===
        ContributionStatus.ContributionDone
    ) {
      this.syncScrollingService.setSyncScroll(true);
    }
    this.documentService.handleContributionSelectCount(false, true);
    this.documentService.setContributionViewAndMergeCollapsed(true);
  }

  handleNextChangeContribution() {
    if (
      this.contributionIndex !==
      this.contributionChangesBS.value.length - 1
    ) {
      const nextChange = this.contributionIndex + 1;
      this.contributionChangesBS.value[nextChange]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
      this.contributionIndex++;
    }
  }

  handlePrevChangeContribution() {
    if (this.contributionIndex > 0) {
      {
        const prevChange = this.contributionIndex - 1;
        this.contributionChangesBS.value[prevChange]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
        this.contributionIndex--;
      }
    }
  }

  onSelectAction(e: any) {
    this.contributionActionSelected = e.target.value;
    this.documentService.contributionSelections$.subscribe((selections) => {
      if (selections > 0) {
        this.applyActionDisabledBS.next(false);
      }
    });
  }

  handleMerge() {
    if (this.contributionActionSelected === 'accept_selected') {
      this.processed = !this.processed;
      this.cdkEditor.handleMergeContributionsActions(false, this.contribution);
    } else {
      this.mergeAllContributionsChangesDialog.openDialog();
    }
  }
  /*
  onChangeProcessedToggle(_e: boolean) {
    this.processed = !this.processed;
    this.documentService.toggleIsContributionDeclinedOrProcessed();
    this.markContributionAsProcessedDialog.openDialog();
  }
*/
  onAcceptMergeAllContributions() {
    this.processed = !this.processed;
    this.documentService.toggleIsContributionDeclinedOrProcessed();
    this.cdkEditor.handleMergeContributionsActions(true, this.contribution);
    this.mergeAllContributionsChangesDialog.closeDialog();
  }

  onCancelMergeAllContributions() {
    this.mergeAllContributionsChangesDialog.closeDialog();
  }
  /*
  onAcceptMarkContributionAsProcessed() {
    this.documentService
      .markContributionAsProcessed(this.contribution)
      .subscribe({
        next: (res) => {
          this.appShellService.growl({
            severity: 'success',
            summary: this.translate.instant(
              'global.notifications.title.success',
            ),
            detail: this.translate.instant(
              'page.editor.contribution.mark-as-processed-message-success',
            ),
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
          this.documentService.getContributions();
          this.documentService.setIsContributionDeclinedOrProcessed(true);
        },
        error: (res) => {
          this.appShellService.growl({
            severity: 'danger',
            summary: this.translate.instant(
              'page.editor.contribution.mark-as-processed-message-error',
            ),
            detail: res,
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
        },
      });
    this.markContributionAsProcessedDialog.closeDialog();
  }

  onCancelMarkContributionAsProcessed() {
    this.processed = !this.processed;
    this.documentService.toggleIsContributionDeclinedOrProcessed();
    this.markContributionAsProcessedDialog.closeDialog();
  }
*/

  setPageTitle() {
    this.pageTitle = [
      this.documentConfig.proposalMetadata.stage,
      this.documentConfig.proposalMetadata.type,
      this.documentConfig.proposalMetadata.purpose,
    ]
      .filter(Boolean)
      .join(' ');
    this.pageTitle =
      this.domSanitizer.sanitize(SecurityContext.HTML, this.pageTitle) || '';
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
      this.documentService.setContributionViewAndMergeCollapsed(false);
      this.documentService.setIsContributionDeclinedOrProcessed(
        contribution.contributionStatus === ContributionStatus.ContributionDone,
      );
      if (
        contribution.contributionStatus === ContributionStatus.ContributionDone
      ) {
        this.handleGreyedContribution(contribution, true);
        setTimeout(() => {
          this.syncScrollingService.setSyncScroll(true);
        }, 100);
      } else {
        this.cdkEditor.triggerMergeContributionConnectorStateChange();
        setTimeout(() => {
          this.handleContributionsChanges();
          this.syncScrollingService.setSyncScroll(false);
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

  private greyContributions() {
    this.contributions = this.contributions.map((c) => {
      if (c.contributionStatus === ContributionStatus.ContributionDone) {
        c.greyed = true;
      } else {
        c.greyed = false;
      }
      return c;
    });
  }

  private handleContributionsChanges() {
    const nodeList =
      this.contributionViewContainerElement.nativeElement?.querySelectorAll(
        '.merge-contribution-wrapper',
      );
    const elemList = nodeList ? [...nodeList] : [];
    this.contributionChangesBS.next(elemList);
  }

  private handleCompareChanges() {
    this.navigationAnchorIndex = -1;
    const nodeListCN = document.querySelectorAll(
      '.leos-content-new-cn:not(num), .leos-content-removed-cn:not(num)',
    );
    const nodeList = document.querySelectorAll(
      '.leos-content-new:not(num), .leos-content-removed:not(num)',
    );
    const nodeListCNDoubleCompare = document.querySelectorAll(
      '.leos-double-compare-removed:not(num), .leos-double-compare-added:not(num)',
    );
    this.compareChanges = (
      nodeList && nodeList.length > 0
        ? nodeList
        : nodeListCN && nodeListCN.length > 0
        ? nodeListCN
        : nodeListCNDoubleCompare
    ) as NodeListOf<HTMLElement>;
    const container = this.document.getElementById(
      'versionComparisonContainer',
    );
    if (!container) return;
    this.handlePins(container);
    this.getNavigationAnchors();
  }

  private handlePins(container: HTMLElement) {
    const pinContainer = this.document.createElement('div');
    pinContainer.classList.add('pin-container');
    pinContainer.classList.add('pin-right');
    container.appendChild(pinContainer);
    const selectorStyleMap = {
      '.leos-marker-content-removed': 'pin-leos-marker-content-removed',
      '.leos-marker-content-added': 'pin-leos-marker-content-added',
      '.leos-content-removed': 'pin-leos-content-removed',
      '.leos-content-removed-cn': 'pin-leos-content-removed',
      '.leos-content-new': 'pin-leos-content-new',
      '.leos-content-new-cn': 'pin-leos-content-new',
      '.leos-double-compare-removed': 'pin-leos-marker-content-removed',
      '.leos-double-compare-added': 'pin-leos-marker-content-added',
    };
    this.addPins(container, pinContainer, selectorStyleMap);
  }

  private reloadComponent() {
    // TODO: reload document and services without page reload
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  private addPins(
    target: HTMLElement,
    pinContainer: HTMLElement,
    selectorStyleMap: { [key: string]: string },
  ): HTMLElement[] {
    this.removeAllPins();
    const pins: HTMLElement[] = [];
    Object.keys(selectorStyleMap).forEach((selector) => {
      const elements = target.querySelectorAll(selector);
      elements.forEach((el, elIndex) => {
        const pinElement = this.createPin(
          pins.length + 1,
          el as HTMLElement,
          selectorStyleMap[selector],
          target,
        );
        if (this.uniquePin(pins, pinElement)) {
          this.attachTo(pinContainer, pinElement);
          pins.push(pinElement);
        }
      });
    });
    return pins;
  }

  private uniquePin(pins: HTMLElement[], el: HTMLElement): boolean {
    const top = el.style.top;
    const className = el.className;
    return pins.every(
      (pin) => top !== pin.style.top || className !== pin.className,
    );
  }

  private createPin(
    index: number,
    refToElement: HTMLElement,
    pinStyle: string,
    target: HTMLElement,
  ): HTMLElement {
    const pinDiv = document.createElement('div');
    this.addClass(pinDiv, 'pin');
    this.addClass(pinDiv, pinStyle);
    pinDiv.setAttribute('data-index', index.toString());
    pinDiv.setAttribute('ref-to', refToElement.id); // add custom attribute
    pinDiv.style.top = this.getPercentageDistanceFromTop(refToElement, target);
    pinDiv.addEventListener('click', () =>
      this.scrollToChange(refToElement, target),
    );
    return pinDiv;
  }

  private getPercentageDistanceFromTop(
    element: HTMLElement,
    target: HTMLElement,
  ): string {
    const totalHeight = target.scrollHeight;
    const elementPosFromTargetTop = this.getElementDistanceFromTop(
      element,
      target,
    );
    return `${((100 * elementPosFromTargetTop) / totalHeight).toFixed(2)}%`;
  }

  private _roundOffTo(floatNumber, digitsAfterDecimal) {
    return floatNumber.toFixed(digitsAfterDecimal);
  }

  private addClass(el: HTMLElement, className: string) {
    if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += ` ${className}`;
    }
  }

  private attachTo(container: HTMLElement, el: HTMLElement) {
    container.appendChild(el);
  }

  private getElementDistanceFromTop(
    el: HTMLElement,
    target: HTMLElement,
  ): number {
    let distance = 0;
    while (el && el !== target) {
      if (el.hidden) el = el.parentElement;
      else {
        distance += el.offsetTop;
        el = el.offsetParent as HTMLElement;
      }
    }
    return distance;
  }

  private scrollToChange(el: HTMLElement, target: HTMLElement) {
    const topOffset = this.getElementDistanceFromTop(el, target) - 106;
    target.scrollTop = topOffset;
  }

  private removeAllPins() {
    const pins = document.querySelectorAll('.pin-container .pin');
    pins.forEach((pin) => pin.remove());
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

  private closeInlineToCEdit(reloadToc = false) {
    this.documentTocComponent.messageFromValidation = null;
    this.documentTocComponent.isDropValid = null;
    this.tocService.setIsEditMode(false);
    this.documentTocComponent.resetTreeState();
    this.documentTocComponent.clearHighlightInvalidNodes();
    this.coEditionWSService.removeTocInlineEdit(this.documentRef);
    this.documentService.setAnnotationMode('NORMAL');
    if (reloadToc) this.tocService.reload();
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
        let content = null;
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

  private setPageSubTitle(
    documentVersion,
    updatedBy,
    updatedDate,
    baseVersionTitle,
    revisedBaseVersion,
  ) {
    if (this.isCNInstance && this.baseECVersion !== revisedBaseVersion) {
      this.translate
        .get('page.editor.base.revision.toolbar.info', {
          version: documentVersion,
          updatedByFull: updatedBy,
          updatedOn: updatedDate,
          baseVersionTitle,
          revisedBaseVersion,
        })
        .pipe(takeUntil(this.destroy$), take(1))
        .subscribe((subTitle: string) => {
          this.pageSubTitle = subTitle;
        });
    } else {
      this.translate
        .get('page.editor.subtitle', {
          version: documentVersion,
          updatedByFull: updatedBy,
          updatedOn: updatedDate,
        })
        .pipe(takeUntil(this.destroy$), take(1))
        .subscribe((subTitle: string) => {
          this.pageSubTitle = subTitle;
        });
    }
  }

  private setVersionForViewHeader(versionInfo: VersionInfoVO) {
    this.translate
      .get('version.view.header', {
        version: versionInfo.documentVersion,
        updatedByFull: `${versionInfo.lastModifiedBy} (${versionInfo.entity})`,
        updatedOn: versionInfo.lastModificationInstant,
      })
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe((header: string) => {
        this.versionForViewHeaderTitle = header;
      });
  }

  private getVersionComparisonViewHeaderTitle(versions: Version[]) {
    if (process.env.NG_APP_LEOS_INSTANCE === 'cn') {
      if (versions.length === 2) {
        return this.translate.instant('version.compare.header', {
          oldVersion: this.formatVersionNumber(versions[0]),
          newVersion: this.formatVersionNumber(versions[1]),
        });
      }
      if (versions.length === 3) {
        return this.translate.instant('version.double.compare.header', {
          oldestVersion: this.formatVersionNumber(versions[0]),
          newVersion: this.formatVersionNumber(versions[1]),
          newestVersion: this.formatVersionNumber(versions[2]),
        });
      } else {
        return this.translate.instant('version.compare.header.default.cn');
      }
    } else {
      return versions.length === 2
        ? this.translate.instant('version.compare.header', {
            oldVersion: this.formatVersionNumber(versions[0]),
            newVersion: this.formatVersionNumber(versions[1]),
          })
        : this.translate.instant('version.compare.header.default');
    }
  }

  private getFormValues(): VersionSearchParams {
    const { type, author } = this.versionSearchForm.getRawValue();
    return {
      type: type ?? 'all',
      author: author ?? '',
    };
  }

  private formatVersionNumber(version: Version): string {
    const { major, intermediate, minor } = version.versionNumber;
    return `${major}.${intermediate}.${minor}`;
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
    this.breadcrumbService.setBreadcrumb([
      {
        id: 'home',
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

  private getIntermediateVersion(versions): Version {
    if (process.env.NG_APP_LEOS_INSTANCE === 'cn' && versions.length === 3) {
      return versions[2];
    }
    return null;
  }

  private setPageMode(mode: PageMode) {
    if (this.pageMode === PageMode.ViewVersion) {
      this.closeVersionView(false);
    }
    if (this.pageMode === PageMode.CompareVersions) {
      this.closeVersionComparisonView(false);
    }
    if (this.pageMode === PageMode.Contribution) {
      this.closeContributionsView(false);
    }
    this.pageMode = mode;

    window.requestAnimationFrame(() => {
      const documentPanes =
        this.hostElRef?.nativeElement.querySelectorAll('.document-pane') ?? [];
      [...documentPanes].forEach((el) => (el.style.flexBasis = ''));
    });
  }

  private getFilteredParents(): HTMLElement[] {
    const filteredParents: HTMLElement[] = [];
    this.compareChanges.forEach((change) => {
      const parent = change.parentElement;
      if (
        parent &&
        !parent.classList.contains('leos-content-new-cn') &&
        !parent.classList.contains('leos-content-removed-cn') &&
        !parent.classList.contains('leos-content-new') &&
        !parent.classList.contains('leos-content-removed') &&
        !parent.classList.contains('leos-double-compare-removed') &&
        !parent.classList.contains('leos-double-compare-added')
      ) {
        filteredParents.push(parent);
      }
    });
    return filteredParents;
  }

  private getNavigationAnchors() {
    const navigationAnchors: HTMLElement[] = [];
    this.compareChanges.forEach((elem) => {
      if (elem.tagName.toLowerCase() === 'span') {
        if (!parentHasClass(elem, compareClasses)) {
          if (
            !navigationAnchors.find(
              (element) => element.id === elem.parentElement.id,
            )
          ) {
            navigationAnchors.push(elem.parentElement);
          }
        }
        if (
          parentHasClass(elem, compareClasses) &&
          !parentHasClass(elem.parentElement, compareClasses)
        ) {
          if (
            !navigationAnchors.find(
              (element) => element.id === elem.parentElement.id,
            )
          ) {
            navigationAnchors.push(elem.parentElement);
          }
        }

        if (
          parentHasClass(elem, compareClasses) &&
          parentHasClass(elem.parentElement, compareClasses) &&
          !parentHasClass(elem.parentElement.parentElement, compareClasses)
        ) {
          if (
            !navigationAnchors.find(
              (element) => element.id === elem.parentElement.parentElement.id,
            )
          ) {
            navigationAnchors.push(elem.parentElement.parentElement);
          }
        }
        if (
          parentHasClass(elem, compareClasses) &&
          parentHasClass(elem.parentElement, compareClasses) &&
          parentHasClass(elem.parentElement.parentElement, compareClasses) &&
          !parentHasClass(
            elem.parentElement.parentElement.parentElement,
            compareClasses,
          )
        ) {
          if (
            !navigationAnchors.find(
              (element) =>
                element.id ===
                elem.parentElement.parentElement.parentElement.id,
            )
          ) {
            navigationAnchors.push(
              elem.parentElement.parentElement.parentElement,
            );
          }
        }
      } else {
        navigationAnchors.push(elem);
      }
    });
    this.navigationAnchorsList = navigationAnchors;
  }
}
