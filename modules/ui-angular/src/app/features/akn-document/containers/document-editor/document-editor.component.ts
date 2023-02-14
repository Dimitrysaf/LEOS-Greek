import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, withLatestFrom } from 'rxjs';

import { VersionInfoVO } from '@/shared/models/version-info.model';
import { DocumentService } from '@/shared/services/document.service';
import { DomService } from '@/shared/services/dom.service';

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

  isTOCColumnCollapsed = true;
  isAnnotationsColumnCollapsed = true;
  isVersionsColumnCollapsed = true;

  isEditMode = false;
  private unloadStyleSheet?: () => void;

  constructor(
    private domService: DomService,
    public doc: DocumentService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private cdkEditor: CKEditorService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.documentRef = params.id;
      this.documentType = this.route.snapshot.data['category'];
      this.doc.setDocumentCategory(this.documentType);
      this.doc.setDocumentId(this.documentRef);
      this.doc.setDocumentCategory(this.documentType);
      this.cdkEditor.setDocumentRef(this.documentRef);
      this.cdkEditor.setDocumentType(this.documentType);
    });

    this.loadStyleSheet();
    this.doc.documentView$.pipe().subscribe((documentView) => {
      this.loadDocument(documentView.editableXml, documentView.versionInfoVO);
    });
  }

  ngOnDestroy() {
    this.unloadStyleSheet?.();
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
    //TODO : implement undo
  }
  handleSave() {
    //TODO : implememt save
  }
  handleCancel() {
    //TODO : implement cancel
    this.isEditMode = false;
  }

  handleClose() {
    this.doc.closeEditor();
    //wait for the API where we get all the metadata for each document
    this.router.navigate([`/collection/proposal`]);
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
