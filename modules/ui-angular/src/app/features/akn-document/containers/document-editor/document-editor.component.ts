import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  combineLatest,
  combineLatestWith,
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
import { DownloadEconsiliumModalComponent } from '@/features/akn-document/components/download-econsilium-modal/download-econsilium-modal.component';
import { DocumentTocComponent } from '@/features/akn-document/containers/document-toc/document-toc.component';
import { Version } from '@/features/akn-document/models';
import { DocumentConfig } from '@/shared';
import { CoEditionDetectedDialogComponent } from '@/shared/components/co-edition-detected-dialog/co-edition-detected-dialog.component';
import {
  MilestoneDescriptor,
  ProposalMilestoneViewComponent,
} from '@/shared/components/proposal-milestone-view/proposal-milestone-view.component';
import { TableOfContentItemVO, TocItem } from '@/shared/models/toc.model';
import { VersionInfoVO } from '@/shared/models/version-info.model';
import { VersionSearchParams } from '@/shared/models/versionSearch';
import { AnnotateService } from '@/shared/services/annotate.service';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';
import { DomService } from '@/shared/services/dom.service';
import { EnvironmentService } from '@/shared/services/enviroment.service';
import { capitalizeFirstLetter } from '@/shared/utils/string.utils';
import { findNodeById } from '@/shared/utils/toc.utils';

import { CKEditorService } from '../../services/ckeditor.service';

@Component({
  selector: 'app-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.scss'],
  providers: [AnnotateService, DocumentService, CKEditorService],
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
  xml: string;
  isCollapseToc = false;
  versionForView: string;
  versionForViewHeaderTitle: string;
  versionsComparisonForView: string;
  versionsComparisonForViewHeaderTitle$: Observable<string>;
  documentConfig: DocumentConfig;

  isVersionForViewOpen = false;
  isTOCColumnCollapsed = true;
  isAnnotationsColumnCollapsed = false;
  isVersionsColumnCollapsed = true;
  reloadTrigger: number;

  tocItems: Array<TocItem> = [];
  dragItems: Array<Partial<TableOfContentItemVO>> = [];

  isEditMode = false;

  compareChanges: NodeListOf<HTMLElement>;
  compareIndex = 0;
  isAsyncScrollEnabled: boolean;
  arrowClicked = false;
  eventFunc;
  isScrollFromButton: boolean;
  tooltipsDelay = 1000;

  versionSearchForm = new FormGroup({
    type: new FormControl('all'),
    author: new FormControl(''),
  });

  isCNInstance = process.env.NG_APP_LEOS_INSTANCE === 'cn';

  @ViewChild(DocumentTocComponent) documentTocComponent: DocumentTocComponent;
  @ViewChild('unSavedDialog') unSavedDialog: EuiDialogComponent;
  @ViewChild('openEditorDialog') openEditorDialog: EuiDialogComponent;

  @ViewChild('milestoneViewDialog')
  protected milestoneViewDialog: ProposalMilestoneViewComponent;
  protected milestoneViewData: MilestoneDescriptor = null;

  @ViewChild('eConsiliumModal')
  eConsiliumModal: DownloadEconsiliumModalComponent;

  private unloadStyleSheet?: () => void;
  private destroy$: Subject<any> = new Subject();
  private scrollables: NodeListOf<Element>;

  constructor(
    private domService: DomService,
    public documentService: DocumentService,
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
    public enviromentService: EnvironmentService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    combineLatest([this.route.params, this.route.data])
      .pipe(take(1))
      .subscribe(([params, data]) => {
        this.documentRef = params.id;
        this.documentType = data.category;
      });
    this.versionSearchForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const values = this.getFormValues();
        this.documentService.setVersionSearchParams(values);
      });

    this.documentService.reloadTrigger$
      .pipe(takeUntil(this.destroy$))
      .subscribe((trigger) => {
        this.reloadTrigger = trigger;
      });
  }

  ngOnInit(): void {
    this.presenterId = uuidv4();
    this.coEditionWSService.setPresenterId(this.presenterId);
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
        this.cdkEditor.setDocumentRef(this.documentRef);
        this.cdkEditor.setDocumentType(this.documentType);
      });
    this.loadStyleSheet();

    this.documentService.documentView$
      .pipe(takeUntil(this.destroy$))
      .subscribe((documentView) => {
        this.loadDocument(documentView.editableXml);
        this.setPageSubTitle(documentView.versionInfoVO);
        this.proposalRef = documentView.proposalRef;
      });

    this.documentService
      .getTocItems(this.documentRef)
      .pipe(takeUntil(this.destroy$))
      .subscribe((tocItems) => {
        this.tocItems = tocItems;
        this.dragItems = this.buildTocItemToTOC(tocItems);
      });

    this.documentService.versionView$
      .pipe(takeUntil(this.destroy$))
      .subscribe((versionView) => {
        if (versionView !== null) {
          this.versionForView = this.cleanupAndSerializeXML(
            versionView.editableXml,
            `doubleCompare-${this.documentRef}`,
          );
          this.setVersionForViewHeader(versionView.versionInfoVO);
          this.isVersionForViewOpen = true;
        }
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
            this.handleCompareChanges();
          });
        }
      });

    this.versionsComparisonForViewHeaderTitle$ =
      this.documentService.versionCompareIds$.pipe(
        takeUntil(this.destroy$),
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
  }

  ngAfterViewInit(): void {
    const presenterId = this.coEditionWSService.presenterId;
    this.coEditionWSService.joinSubDocumentChannel(this.documentRef);
    this.coEditionWSService.latestMessage
      .pipe(takeUntil(this.destroy$))
      .subscribe((latestMessage) => {
        if (latestMessage.info.presenterId !== presenterId)
          this.appShellService.growl({
            severity: 'info',
            summary: 'Co Edition update',
            detail: `${latestMessage.info.userName} ${this.translate.instant(
              `page.editor.co-edition-update.co-edition-${
                latestMessage.operation === 'REMOVE' ? 'stopped' : 'started'
              }`,
            )}`,
            life: 4000,
          });
      });
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
    this.coEditionWSService.setShouldReloadAfterUpdate();
    this.coEditionWSService.removeSession();
    this.reloadTrigger = 0;
    this.closeVersionView();
    this.closeVersionComparisonView();
    this.destroy$.next(null);
    this.destroy$.complete();
    this.unloadStyleSheet?.();
  }

  disableUndoButton() {
    if (this.documentTocComponent)
      return this.documentTocComponent.treeHistory.length === 0;
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

  onToggleTOCColumnCollapsed() {
    this.isTOCColumnCollapsed = !this.isTOCColumnCollapsed;
    this.documentService.seeNavigation();
  }

  onToggleAnnotationsColumnCollapsed() {
    (
      document.querySelector(
        'button.annotator-frame-button--sidebar_toggle',
      ) as HTMLButtonElement
    )?.click();
    this.isAnnotationsColumnCollapsed = !this.isAnnotationsColumnCollapsed;
  }

  onToggleVersionsColumn() {
    this.isVersionsColumnCollapsed = !this.isVersionsColumnCollapsed;
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
        dismiss: () => (this.isEditMode = false),
      });
    } else {
      this.editInlineToC();
    }
  }

  editInlineToC() {
    this.isEditMode = true;
    //set the styling for the toc
    this.documentTocComponent.handleTocStylingOnInlineEdit(true);
    this.documentService.setAnnotationMode('READ_ONLY');
    this.coEditionWSService.sendTocInlineEdit(this.documentRef);
  }

  handleUndo() {
    const oldToc = this.documentTocComponent.treeHistory.pop();
    if (oldToc.length > 0) {
      this.documentTocComponent.setTree(oldToc);
      if (this.documentTocComponent.isNodeSelected()) {
        const newSelectedNode = findNodeById(
          oldToc,
          this.documentTocComponent.selectedNode.id,
        );
        if (newSelectedNode)
          this.documentTocComponent.hanldeNodeSelect(newSelectedNode);
      }
    }
  }

  handlePrevChange() {
    this.arrowClicked = true;
    if (this.compareIndex - 1 >= 0) {
      this.isScrollFromButton = true;
      this.compareIndex -= 1;
      this.compareChanges
        .item(this.compareIndex)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  handleNextChange() {
    this.arrowClicked = true;
    if (this.compareIndex <= this.compareChanges.length) {
      this.isScrollFromButton = true;
      const targetItem = this.compareChanges.item(this.compareIndex);
      if (targetItem)
        targetItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.compareIndex += 1;
    }
  }

  handleAsyncScroll() {
    this.isAsyncScrollEnabled = !this.isAsyncScrollEnabled;
    if (this.isAsyncScrollEnabled) {
      this.scrollables = this.document.querySelectorAll('.sync-scroll');
      this.scrollables.forEach((scrollable: Element) => {
        scrollable.addEventListener('scroll', this.handleSyncScroll.bind(this));
      });
    }
    if (!this.isAsyncScrollEnabled) {
      this.scrollables.forEach((scrollable: Element) => {
        scrollable.removeEventListener('scroll', this.handleSyncScroll);
      });
    }
  }

  handleSave() {
    const toc = cloneDeep(this.tocStructure);
    this.prepareTocForSave(toc);
    this.documentService
      .saveToc(this.documentRef, toc)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.documentTocComponent.isToCDraft = false;
          this.documentTocComponent.treeHistory = [];
          this.documentService.reloadDocument();
        },
        error: (err) => {},
      });
  }

  handleCancel() {
    //TODO : implement cancel

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
    if (save) {
      this.handleSave();
    }
    this.unSavedDialog.closeDialog();
    this.closeInlineToCEdit();
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

  getTooltipForToggleTree() {
    if (this.isCollapseToc) {
      return this.translate.instant(
        'page.editor.toc.toc-column.actions.collapseAll',
      );
    }
    return this.translate.instant(
      'page.editor.toc.toc-column.actions.expandAll',
    );
  }

  closeVersionView() {
    this.isVersionForViewOpen = false;
  }

  toggleVersionComparisonView() {
    this.closeVersionView();
    this.documentService.toggleCompareMode();
  }

  closeVersionComparisonView() {
    this.compareChanges = null;
    this.compareIndex = 0;
    this.removeAllPins();
    this.versionsComparisonForView = null;
    this.documentService.toggleCompareMode(false);
  }

  handleClose() {
    if (this.document.querySelectorAll('.cke').length > 0) {
      this.openEditorDialog.openDialog();
    } else {
      this.cdkEditor.closeElementEditor();

      const proposalRef = this.documentConfig.proposalMetadata.ref;
      this.router.navigate([`/collection/${proposalRef}`]);
    }
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

  protected exploreMilestone(version: Version) {
    this.milestoneViewData = {
      createdBy: version.createdBy,
      createdDate: version.updatedDate,
      legDocumentName: version.legFileName,
      proposalRef: this.proposalRef,
      title: version.checkinCommentVO.title,
    };
    setTimeout(() => this.milestoneViewDialog.open(), 0);
  }

  protected onMilestoneViewDialogClosed() {
    this.milestoneViewData = null;
  }

  private handleSyncScroll(event: Event) {
    if (!this.isAsyncScrollEnabled) {
      return;
    }
    const sender = event.target as HTMLElement;
    if (sender.matches(':hover') || this.arrowClicked) {
      setTimeout(() => {
        const percentage =
          sender.scrollTop / (sender.scrollHeight - sender.clientHeight);
        this.scrollables.forEach((scrollable: Element) => {
          if (scrollable !== sender) {
            scrollable.scrollTop =
              percentage * (scrollable.scrollHeight - scrollable.clientHeight);
          }
        });
        this.arrowClicked = false;
      }, 100);
    }
  }

  private handleCompareChanges() {
    const nodeList = document.querySelectorAll(
      '.leos-content-new, .leos-content-removed',
    );
    this.compareChanges = nodeList as NodeListOf<HTMLElement>;
    const container = this.document.getElementById(
      'versionComparisonContainer',
    );
    if (!container) return;
    this.handlePins(container);
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
      '.leos-content-new': 'pin-leos-content-new',
    };
    this.addPins(container, pinContainer, selectorStyleMap);
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

  private closeInlineToCEdit() {
    this.documentTocComponent.messageFromValidation = null;
    this.documentTocComponent.isDropValid = null;
    this.isEditMode = false;
    this.documentTocComponent.resetTreeState();
    this.documentTocComponent.handleTocStylingOnInlineEdit(false);
    this.documentTocComponent.clearHilightInvalidNodes();
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
            item.aknTag.toLocaleLowerCase() === 'recital' ||
            item.aknTag.toLocaleLowerCase() === 'citation'
              ? capitalizeFirstLetter(item.aknTag) + '...'
              : 'Text...';
        }
        dragItems.push({
          tocItem: item,
          heading,
          number,
          content,
          childItems: [],
          id: uniqueId(),
        });
      }
    }
    return dragItems;
  }

  private loadDocument(xml: string) {
    this.xml = this.cleanupAndSerializeXML(xml);
  }

  private loadStyleSheet() {
    const typeLC = this.documentType.toLowerCase();
    const category = typeLC === 'council_explanatory' ? 'explanatory' : typeLC;

    this.config.config.subscribe((config) => {
      // 'http://localhost:8080/leos-pilot/assets/css/annex.css?cacheToken_1667202194805'
      // FIXME: import stylesheets to ngui?
      const cssUrl = `${config.mappingUrl}/assets/css/${category}.css`;
      this.unloadStyleSheet = this.domService.setDynamicStyle(cssUrl);
    });
  }

  private cleanupAndSerializeXML(xml: string, akomantosoId?: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/html');

    if (this.documentType !== 'coverPage') {
      xmlDoc.querySelectorAll('meta, coverPage').forEach((el) => el.remove());
    }

    if (akomantosoId) {
      xmlDoc.querySelector('akomantoso').id = akomantosoId;
    }
    return new XMLSerializer()
      .serializeToString(xmlDoc)
      .replace(/<\?xml(-stylesheet)?.+\?>/g, '');
  }

  private setPageSubTitle(versionInfo: VersionInfoVO) {
    this.translate
      .get('page.editor.subtitle', {
        version: versionInfo.documentVersion,
        updatedByFull: `${versionInfo.lastModifiedBy} (${versionInfo.entity})`,
        updatedOn: versionInfo.lastModificationInstant,
      })
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe((subTitle: string) => {
        this.pageSubTitle = subTitle;
      });
  }

  private setPageTitle() {
    this.pageTitle = [
      this.documentConfig.proposalMetadata.stage,
      this.documentConfig.proposalMetadata.type,
      this.documentConfig.proposalMetadata.purpose,
    ]
      .filter(Boolean)
      .join(' ');
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
    return versions.length === 2
      ? this.translate.instant('version.compare.header', {
          oldVersion: this.formatVersionNumber(versions[0]),
          newVersion: this.formatVersionNumber(versions[1]),
        })
      : this.translate.instant('version.compare.header.default');
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
      return versions[0];
    }
    return null;
  }
}
