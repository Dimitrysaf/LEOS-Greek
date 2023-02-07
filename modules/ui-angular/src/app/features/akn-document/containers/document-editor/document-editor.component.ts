import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
    private translate: TranslateService,
    private cdkEditor: CKEditorService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.documentRef = params.id;
      this.documentType = this.route.snapshot.data['category'];
      console.log(this.documentType);
      this.doc.setDocumentCategory(this.documentType);
      this.doc.setDocumentId(params.id);
      this.doc.setDocumentCategory(this.route.snapshot.data['category']);
      this.cdkEditor.setDocumentRef(params.id);
    });

    this.loadStyleSheet();

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
    //TODO : implememt save
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
    const category =
      this.documentType === 'coverPage' ? 'coverpage' : this.documentType;
    const leosBuildTimestamp = 1667202194805; // FIXME: get this from server at runtime
    const legacyAssetsPrefix = 'legacy/assets'; // FIXME: import stylesheets to ngui?
    const coverPageCSS = `assets/scss/_coverPage.scss?cacheToken_${leosBuildTimestamp}`;
    const coverPageVIEWCSS = `assets/scss/_coverpageView.scss?cacheToken_${leosBuildTimestamp}`;
    const cssUrl = `${legacyAssetsPrefix}/css/${category}.css?cacheToken_${leosBuildTimestamp}`;
    if (category === 'coverage') {
      this.unloadStyleSheet = this.domService.setDynamicStyle(coverPageCSS);
      this.unloadStyleSheet = this.domService.setDynamicStyle(coverPageVIEWCSS);
    }
    this.unloadStyleSheet = this.domService.setDynamicStyle(cssUrl);
  }

  private cleanupAndSerializeXML(xmlDoc: XMLDocument) {
    if (this.documentType !== 'coverPage') {
      xmlDoc.querySelectorAll('meta, coverPage').forEach((el) => el.remove());
    }
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
