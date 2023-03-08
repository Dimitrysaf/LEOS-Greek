import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EuiDialogComponent } from '@eui/components/eui-dialog';
import { uniqueId } from '@eui/core';
import { TranslateService } from '@ngx-translate/core';
import { truncate } from 'lodash';
import { combineLatest, Subject, takeUntil, withLatestFrom } from 'rxjs';

import { DocumentTocComponent } from '@/shared/components/document-toc/document-toc.component';
import { TableOfContentItemVO, TocItem } from '@/shared/models/toc.model';
import { VersionInfoVO } from '@/shared/models/version-info.model';
import { DocumentService } from '@/shared/services/document.service';
import { DomService } from '@/shared/services/dom.service';
import { capitalizeFirstLetter } from '@/shared/utils/string.utils';

import { CKEditorService } from '../../services/ckeditor.service';

@Component({
  selector: 'app-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.scss'],
})
export class DocumentEditorComponent implements OnDestroy, OnInit {
  documentRef: string;
  documentType: string;
  pageTitle: string;
  pageSubTitle: string;
  xml: string;
  isCollapseToc = false;

  isTOCColumnCollapsed = true;
  isAnnotationsColumnCollapsed = true;
  isVersionsColumnCollapsed = true;

  tocItems: Array<TocItem> = [];
  dragItems: Array<Partial<TableOfContentItemVO>> = [];

  isEditMode = false;
  @ViewChild(DocumentTocComponent) documentTocComponent: DocumentTocComponent;
  @ViewChild('unSavedDialog') unSavedDialog: EuiDialogComponent;

  private unloadStyleSheet?: () => void;
  private destroy$: Subject<any> = new Subject();
  private proposalRef: string;

  constructor(
    private domService: DomService,
    public documentService: DocumentService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private cdkEditor: CKEditorService,
    private tranlsateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.documentRef = params.id;
      this.documentType = this.route.snapshot.data['category'];
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
  }

  ngOnDestroy() {
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
  }

  onToggleAnnotationsColumnCollapsed() {
    this.isAnnotationsColumnCollapsed = !this.isAnnotationsColumnCollapsed;
  }

  onToggleVersionsColumn() {
    this.isVersionsColumnCollapsed = !this.isVersionsColumnCollapsed;
  }

  handleEdit() {
    this.isEditMode = true;
  }
  handleUndo() {
    const oldToc = this.documentTocComponent.treeHistory.pop();
    if (oldToc.length > 0) {
      this.documentService.setToc(oldToc);
    }
  }
  handleSave() {
    const toc = this.tocStructure;
    this.prepareTocForSave(toc);
    this.documentService.saveToc(this.documentRef, toc);
  }
  handleCancel() {
    //TODO : implement cancel

    if (this.documentTocComponent.isToCDraft) {
      //TODO: handle confirm you want to discard changes
      this.unSavedDialog.openDialog();
      //reset toc state
      this.documentTocComponent.isToCDraft = false;
    } else this.isEditMode = false;
  }

  handleClose() {
    this.documentService.closeEditor();
    //wait for the API where we get all the metadata for each document
    this.router.navigate([`/collection/${this.proposalRef}`]);
  }

  getTocItemDisplayTitle(item: TocItem) {
    if (item.numberingType === 'BULLET_NUM') {
      return this.tranlsateService.instant('toc.item.typel.bullet');
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
    this.xml = this.cleanupAndSerializeXML(xmlDoc);
  }

  private loadStyleSheet() {
    // 'http://localhost:8080/leos-pilot/assets/css/annex.css?cacheToken_1667202194805'
    const category =
      this.documentType === 'coverPage' ? 'coverpage' : this.documentType;
    const leosBuildTimestamp = 1667202194805; // FIXME: get this from server at runtime
    const legacyAssetsPrefix = 'legacy/assets'; // FIXME: import stylesheets to ngui?
    const cssUrl = `${legacyAssetsPrefix}/css/${category}.css?cacheToken_${leosBuildTimestamp}`;
    this.unloadStyleSheet = this.domService.setDynamicStyle(cssUrl);
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
}
