import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { DocumentService } from '@/features/akn-document/services/document.service';
import { DomService } from '@/shared/services/dom.service';

import { CKEditorService } from '../../services/ckeditor.service';

@Component({
  selector: 'app-annex-editor',
  templateUrl: './annex-editor.component.html',
  styleUrls: ['./annex-editor.component.scss'],
})
export class AnnexEditorComponent implements OnDestroy, OnInit {
  pageTitle: string;
  pageSubTitle: string;
  xml: string;

  isTOCColumnCollapsed = true;
  isAnnotationsColumnCollapsed = true;
  isVersionsColumnCollapsed = true;

  id: string;
  isEditMode = false;
  private unloadStyleSheet?: () => void;

  constructor(
    private domService: DomService,
    public doc: DocumentService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private cdkEditor: CKEditorService,
  ) {}

  ngOnInit(): void {
    this.loadStyleSheet();

    this.route.params.subscribe((params) => {
      this.id = params.id;
      this.doc.setDocumentId(params.id);
      this.cdkEditor.setDocumentRef(params.id);
      this.doc.setDocumentRef(params.id);
    });

    this.route.data.subscribe((data) => {
      this.doc.setDocumentType(data.category);
    });
    this.doc.documentXML$.subscribe((xml) => {
      this.loadDocument(xml);
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
    //Todo update this when function is implemented
    this.doc.saveDocumentVersion();
  }

  handleCancel() {
    //TODO : implement cancel
    this.isEditMode = false;
  }

  private loadDocument(xml: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    this.setPageTitle(xmlDoc);
    this.setPageSubTitle({
      version: '1.0.8',
      updatedByFull: 'MICHOTTE Alexandra (DIGIT)',
      updatedOn: 1664193765137,
    });
    this.xml = this.cleanupAndSerializeXML(xmlDoc);
  }

  private loadStyleSheet() {
    // 'http://localhost:8080/leos-pilot/assets/css/annex.css?cacheToken_1667202194805'
    const leosBuildTimestamp = 1667202194805; // FIXME: get this from server at runtime
    const legacyAssetsPrefix = 'legacy/assets'; // FIXME: import stylesheets to ngui?
    const cssUrl = `${legacyAssetsPrefix}/css/annex.css?cacheToken_${leosBuildTimestamp}`;
    this.unloadStyleSheet = this.domService.setDynamicStyle(cssUrl);
  }

  private cleanupAndSerializeXML(xmlDoc: XMLDocument) {
    xmlDoc.querySelectorAll('meta, coverPage').forEach((el) => el.remove());
    xmlDoc.querySelector('akomaNtoso').id = this.id;
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
