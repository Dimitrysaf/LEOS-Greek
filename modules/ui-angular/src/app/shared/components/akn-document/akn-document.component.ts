import { formatDate } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { CKEditorService } from '@/features/akn-document/services/ckeditor.service';
import { DocumentService } from '@/shared/services/document.service';
import { DomService } from '@/shared/services/dom.service';

@Component({
  selector: 'app-akn-document',
  templateUrl: './akn-document.component.html',
  styleUrls: ['./akn-document.component.scss'],
})
export class AknDocumentComponent implements OnInit, AfterViewInit {
  @Input() docId: string;
  @Input() docCategory: string;
  xml: string;

  pageTitle: string;
  pageSubTitle: string;

  isTOCColumnCollapsed = true;
  isAnnotationsColumnCollapsed = true;
  isVersionsColumnCollapsed = true;

  id: string;
  isEditMode = false;
  @ViewChild('xmlView', { static: false }) xmlView: ElementRef<HTMLElement>;

  private unloadStyleSheet?: () => void;

  constructor(
    private documentService: DocumentService,
    private domService: DomService,
    public doc: DocumentService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private cdkEditor: CKEditorService,
  ) {
    console.log(this.xml);
  }
  ngOnInit(): void {
    this.docCategory = this.docCategory.toLowerCase();
    this.loadStyleSheet();
  }

  ngAfterViewInit(): void {
    this.documentService
      .getDocumentByRef(this.docId, this.docCategory)
      .subscribe((xml) => this.loadDocument(xml));
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
    const elem = this.xmlView.nativeElement;

    let cleanXml = this.cleanupAndSerializeXML(xmlDoc);
    cleanXml = cleanXml.replaceAll('xml:id', 'id');
    elem.innerHTML = cleanXml;
  }

  private loadStyleSheet() {
    // 'http://localhost:8080/leos-pilot/assets/css/annex.css?cacheToken_1667202194805'
    const leosBuildTimestamp = 1667202194805; // FIXME: get this from server at runtime
    const legacyAssetsPrefix = 'legacy/assets'; // FIXME: import stylesheets to ngui?
    const cssUrl = `${legacyAssetsPrefix}/css/${this.docCategory.toLowerCase()}.css?cacheToken_${leosBuildTimestamp}`;
    const coverPageCSS = `assets/scss/_coverPage.scss?cacheToken_${leosBuildTimestamp}`;
    const coverPageVIEWCSS = `assets/scss/_coverpageView.scss?cacheToken_${leosBuildTimestamp}`;
    this.unloadStyleSheet = this.domService.setDynamicStyle(cssUrl);
    if (this.docCategory === 'coverpage') {
      this.unloadStyleSheet = this.domService.setDynamicStyle(coverPageCSS);
      this.unloadStyleSheet = this.domService.setDynamicStyle(coverPageVIEWCSS);
    }
  }

  private cleanupAndSerializeXML(xmlDoc: XMLDocument) {
    if (this.docCategory !== 'coverpage') {
      xmlDoc.querySelectorAll('meta, coverPage').forEach((el) => el.remove());
    }
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
