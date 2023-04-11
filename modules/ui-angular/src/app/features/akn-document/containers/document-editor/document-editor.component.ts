import { DOCUMENT, formatDate } from '@angular/common';
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
import { cloneDeep } from 'lodash';
import { combineLatest, filter, Subject, take, takeUntil } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { AppConfigService } from '@/core/services/app-config.service';
import { CoEditionDetectedDialogComponent } from '@/shared/components/co-edition-detected-dialog/co-edition-detected-dialog.component';
import { DocumentTocComponent } from '@/shared/components/document-toc/document-toc.component';
import { CoEditionVO } from '@/shared/models/coEditionVO.model';
import { TableOfContentItemVO, TocItem } from '@/shared/models/toc.model';
import { VersionInfoVO } from '@/shared/models/version-info.model';
import { VersionSearchParams } from '@/shared/models/versionSearch';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';
import { DomService } from '@/shared/services/dom.service';
import { capitalizeFirstLetter } from '@/shared/utils/string.utils';

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
  xml: string[];
  isCollapseToc = false;
  versionForView: string;
  versionForViewHeaderTitle: string;
  versionsComparisonForView: string;
  versionsComparisonForViewHeaderTitle: string;

  isVersionForViewOpen = false;
  isTOCColumnCollapsed = true;
  isAnnotationsColumnCollapsed = false;
  isVersionsColumnCollapsed = true;

  tocItems: Array<TocItem> = [];
  dragItems: Array<Partial<TableOfContentItemVO>> = [];

  isEditMode = false;

  versionSearchForm = new FormGroup({
    type: new FormControl('all'),
    author: new FormControl(''),
  });
  @ViewChild(DocumentTocComponent) documentTocComponent: DocumentTocComponent;
  @ViewChild('unSavedDialog') unSavedDialog: EuiDialogComponent;

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
        this.setVersionComparisonViewHeader(null, null);
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

    this.documentService.versionCompareIds$
      .pipe(takeUntil(this.destroy$))
      .subscribe((idArray) => {
        if (idArray && idArray.newVersion !== null) {
          this.setVersionComparisonViewHeader(
            idArray.oldVersion,
            idArray.newVersion,
          );
        }
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
                latestMessage.operation === 'REMOVE' ? 'stoped' : 'started'
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
    this.destroy$.next(null);
    this.destroy$.complete();
    this.unloadStyleSheet?.();
  }

  disableUndoButton() {
    return this.documentTocComponent.treeHistory.length === 0;
  }
  disableSaveButton() {
    return !this.documentTocComponent.isToCDraft;
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
          this.isEditMode = true;
          this.coEditionWSService.sendTocInlineEdit(this.documentRef);
        },
        dismiss: () => (this.isEditMode = false),
      });
    } else {
      this.coEditionWSService.sendTocInlineEdit(this.documentRef);
      this.isEditMode = true;
    }
  }

  handleUndo() {
    const oldToc = this.documentTocComponent.treeHistory.pop();
    if (oldToc.length > 0) {
      this.documentService.setToc(oldToc);
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
          this.documentService.setDocumentId(this.documentRef);
          // this.documentTocComponent.setTree(res);
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
      this.isEditMode = false;
      this.coEditionWSService.removeTocInlineEdit(this.documentRef);
    }
  }

  handleClose() {
    this.documentService.closeEditor();
    //wait for the API where we get all the metadata for each document
    this.router.navigate([`/collection/${this.proposalRef}`]);
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
      this.unSavedDialog.closeDialog();
    } else {
      this.unSavedDialog.closeDialog();
      if (this.documentTocComponent.treeHistory.length > 0) {
        this.documentService.setToc(this.documentTocComponent.treeHistory[0]);
      }
      this.documentTocComponent.treeHistory = [];
    }
    this.documentTocComponent.messageFromValidation = null;
    this.documentTocComponent.isDropValid = null;
    this.isEditMode = false;
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
  private get tocStructure() {
    return this.documentTocComponent.treeControl.dataNodes;
  }

  private prepareTocForSave(node: TableOfContentItemVO[]) {
    for (const n of node) {
      n['childItemsView'] = [];
      if (n.parentItem) {
        n.parentItem = null;
      }
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
    this.setPageTitle(xmlDoc);
    this.setPageSubTitle({
      version: versionInfo.documentVersion,
      updatedByFull: `${versionInfo.lastModifiedBy} (${versionInfo.entity})`,
      updatedOn: versionInfo.lastModifiedBy,
    });
    this.xml = [];
    this.xml.push(this.cleanupAndSerializeXML(xmlDoc));
  }

  private loadStyleSheet() {
    const category =
      this.documentType === 'coverPage'
        ? 'coverpage'
        : this.documentType === 'council_explanatory'
        ? 'explanatory'
        : this.documentType;

    this.config.config.subscribe((config) => {
      // 'http://localhost:8080/leos-pilot/assets/css/annex.css?cacheToken_1667202194805'
      // FIXME: import stylesheets to ngui?
      const cssUrl = `${config.mappingUrl}/assets/css/${category}.css?cacheToken_${config.leosBuildTimestamp}`;
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
    updatedOn = formatDate(1664193765137, 'dd/mm/yyyy HH:MM', 'en-US');
    this.translate
      .get('page.editor.subtitle', { version, updatedByFull, updatedOn })
      .pipe(takeUntil(this.destroy$))
      .subscribe((subTitle: string) => {
        this.pageSubTitle = subTitle;
      });
  }

  private setPageTitle(xmlDoc: XMLDocument) {
    const getMeta = (name: string) =>
      xmlDoc.querySelector(`doc > meta > proprietary > ${name}`)?.textContent;
    this.pageTitle = [
      getMeta('docStage'),
      getMeta('docType'),
      getMeta('docPurpose'),
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

  private setVersionComparisonViewHeader(oldVersion, newVersion) {
    this.translate
      .get(
        oldVersion && newVersion
          ? 'version.compare.header'
          : 'version.compare.header.default',
        { oldVersion, newVersion },
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((header: string) => {
        this.versionsComparisonForViewHeaderTitle = header;
      });
  }

  private getFormValues(): VersionSearchParams {
    const { type, author } = this.versionSearchForm.getRawValue();
    return {
      type: type ?? 'all',
      author: author ?? '',
    };
  }
}
