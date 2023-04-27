import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EuiDialogComponent,
  EuiDialogService,
} from '@eui/components/eui-dialog';
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
  takeUntil,
} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { AppConfigService } from '@/core/services/app-config.service';
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
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';
import { DomService } from '@/shared/services/dom.service';
import { capitalizeFirstLetter } from '@/shared/utils/string.utils';
import { findNodeById } from '@/shared/utils/toc.utils';

import { CKEditorService } from '../../services/ckeditor.service';

@Component({
  selector: 'app-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.scss'],
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

  versionSearchForm = new FormGroup({
    type: new FormControl('all'),
    author: new FormControl(''),
  });
  @ViewChild(DocumentTocComponent) documentTocComponent: DocumentTocComponent;
  @ViewChild('unSavedDialog') unSavedDialog: EuiDialogComponent;
  @ViewChild('openEditorDialog') openEditorDialog: EuiDialogComponent;

  @ViewChild('milestoneViewDialog')
  protected milestoneViewDialog: ProposalMilestoneViewComponent;
  protected milestoneViewData: MilestoneDescriptor = null;

  private unloadStyleSheet?: () => void;
  private destroy$: Subject<any> = new Subject();

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
    @Inject(DOCUMENT) private document: Document,
  ) {
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
        this.documentRef = params.id;
        this.documentType = data.category;
        this.documentService.setDocumentCategory(this.documentType);
        this.documentService.setDocumentId(this.documentRef);
        this.documentService.setDocumentCategory(this.documentType);
        this.cdkEditor.setDocumentRef(this.documentRef);
        this.cdkEditor.setDocumentType(this.documentType);
      });

    this.loadStyleSheet();

    this.documentService.documentView$
      .pipe(takeUntil(this.destroy$))
      .subscribe((documentView) => {
        this.loadDocument(documentView.editableXml, documentView.versionInfoVO);
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
          const pars = new DOMParser();
          const versionXMl = pars.parseFromString(
            versionView.editableXml,
            'text/xml',
          );
          this.versionForView = this.cleanupAndSerializeXML(versionXMl);
          this.setVersionForViewHeader({
            version: versionView.versionInfoVO.documentVersion,
            updatedByFull: `${versionView.versionInfoVO.lastModifiedBy} (${versionView.versionInfoVO.entity})`,
            updatedOn: versionView.versionInfoVO.lastModificationInstant,
          });
          this.isVersionForViewOpen = true;
        }
      });

    this.documentService.versionCompareView$
      .pipe(takeUntil(this.destroy$))
      .subscribe((versionCompareView) => {
        if (versionCompareView !== null) {
          this.versionsComparisonForView = versionCompareView;
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
    this.disableDocument();
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
          this.documentService.setDocumentId(this.documentRef);
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

  closeVersionComparisonView() {
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
    this.enableDocument();
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

  private loadDocument(editableXml: string, versionInfo: VersionInfoVO) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(editableXml, 'text/xml');

    this.setPageSubTitle({
      version: versionInfo.documentVersion,
      updatedByFull: `${versionInfo.lastModifiedBy} (${versionInfo.entity})`,
      updatedOn: versionInfo.lastModificationInstant,
    });
    this.xml = this.cleanupAndSerializeXML(xmlDoc);
    setTimeout(() => {
      if (this.isEditMode) this.disableDocument();
    });
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

  private cleanupAndSerializeXML(xmlDoc: XMLDocument) {
    xmlDoc.querySelector('akomaNtoso').id = this.documentRef;
    return new XMLSerializer()
      .serializeToString(xmlDoc)
      .replace(/<\?xml(-stylesheet)?.+\?>/g, '');
  }

  private setPageSubTitle({ version, updatedByFull, updatedOn }) {
    this.translate
      .get('page.editor.subtitle', { version, updatedByFull, updatedOn })
      .pipe(takeUntil(this.destroy$))
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

  private setVersionForViewHeader({ version, updatedByFull, updatedOn }) {
    this.translate
      .get('version.view.header', { version, updatedByFull, updatedOn })
      .pipe(takeUntil(this.destroy$))
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
}
