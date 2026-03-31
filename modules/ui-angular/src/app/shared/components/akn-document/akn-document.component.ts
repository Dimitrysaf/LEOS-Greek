import {DOCUMENT, NgClass} from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef, Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';
import { DOCUMENT_STYLES } from '@/shared';
import { DocumentService } from '@/shared/services/document.service';
import { DomService } from '@/shared/services/dom.service';
import { MilestoneViewConnectorsService } from "@/shared/services/milestone-view-connectors.service";
import {apiBaseUrl} from "../../../../config";
import {downloadBlob} from "@/shared/utils";
import {LoadingService} from "@/shared/services/loading.service";
import {HttpClient} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-akn-document',
  templateUrl: './akn-document.component.html',
  styleUrls: ['./akn-document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AknDocumentComponent implements OnDestroy, OnInit, AfterViewInit, AfterViewChecked {
  @Input() documentType: string;
  @Input() xml: string;
  @Input() containerId: string;
  @Input() docId: string;
  @Input() containerClass: NgClass['ngClass'] = '';

  @ViewChild('container', { static: true })
  containerElRef: ElementRef<HTMLDivElement>;

  private unloadStyleSheet?: () => void;
  private unloadInlineStyle?: () => void;
  private destroy$: Subject<any> = new Subject();
  private cssTrackChanges: string;
  private softActionsInit: boolean = false;

  constructor(
    private domService: DomService,
    public doc: DocumentService,
    private config: AppConfigService,
    private milestoneViewConnectorsService: MilestoneViewConnectorsService,
    private loadingService: LoadingService,
    private http: HttpClient,
    private translateService: TranslateService,
    @Inject(DOCUMENT) private domDocument: Document,
  ) {}

  ngOnInit(): void {
    this.loadStyleSheet();
  }

  ngOnDestroy() {
    this.unloadStyleSheet?.();
    this.unloadInlineStyle?.();
    this.destroy$.next(null);
    this.destroy$.complete();
    this.milestoneViewConnectorsService.destroyExtensions();
  }

  ngAfterViewInit(): void {
    this.milestoneViewConnectorsService.destroyExtensions();
    this.loadDocument(this.xml);
    this.softActionsInit = false;
  }

  ngAfterViewChecked() {
    const rootElement = this.domDocument.querySelector("#" + this.containerId + " #" + this.docId);
    if (!this.softActionsInit && rootElement) {
      this.milestoneViewConnectorsService.init(rootElement as HTMLElement);
      this.softActionsInit = true;
    }
  }

  private loadDocument(xml: string) {
    const rootEl = this.containerElRef.nativeElement;
    if (!xml.includes('TECHNICAL DOCUMENTATION</heading>')) {
      const akomantosoEl = this.cleanupXML(xml);
      rootEl.innerHTML = '';
      rootEl.appendChild(akomantosoEl);
    } else {
      const buttonText = this.translateService.instant('page.collection.drafts.foreign.annex.download');
      const aknIdMatch = xml.match(/akomaNtoso id="([^"]+)"/);
      const aknId = aknIdMatch ? aknIdMatch[1] : '';
      const srcMatch = xml.match(/componentRef[^>]*src="([^"]+)"/);
      const src = srcMatch ? srcMatch[1] : '';
      xml = xml.replace(/<annex[^>]*>[\s\S]*?<\/annex>/gi, `<h3 id="label-for-annex-message" class="eui-u-font-bold eui-u-color-info">Preview of annexes in .docx, .xlsx or .pdf formats is unavailable</h3><eui-label id="label-for-annex-name" class="eui-u-font-bold">${src}</eui-label><button id="annex-download-button" class="eui-button eui-button--primary eui-button--size-s">${buttonText}</button>`);
      const akomantosoEl = this.cleanupXML(xml);
      rootEl.innerHTML = '';
      rootEl.appendChild(akomantosoEl);
      const button = rootEl.querySelector('#annex-download-button');
      if (button) {
        button.addEventListener('click', () => this.downloadForeignAnnex(aknId, src));
      }
    }
  }

  downloadForeignAnnex(ref: string, originalFilename: string) {
    this.loadingService.setLoading(true);
    this.http
      .get(`${apiBaseUrl}/secured/annex/${ref}`, {
        responseType: 'blob',
      })
      .subscribe({
        next: (blob) => downloadBlob(blob, `${originalFilename}`),
        complete: () => this.loadingService.setLoading(false),
      });
  }

  private loadStyleSheet() {
    const typeLC = this.documentType.toLowerCase();
    const category = typeLC === 'council_explanatory' ? 'explanatory' : typeLC;

    this.config.config.subscribe((config) => {
      // 'http://localhost:8080/leos-pilot/assets/css/annex.css?cacheToken_1667202194805'
      // FIXME: import stylesheets to ngui?
      const styleName = DOCUMENT_STYLES[category] ?? category;
      const cssUrl = `${config.mappingUrl}/assets/css/${styleName}.css`;
      this.unloadStyleSheet = this.domService.setDynamicStyle(cssUrl);
    });
  }

  private cleanupXML(xml: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/html');

    const akomantosoEl = xmlDoc.querySelector('akomantoso');
    const trackChangesStyle = xmlDoc.querySelector(`#docTcStyle`);

    if (trackChangesStyle) {
      this.cssTrackChanges = trackChangesStyle.innerHTML;
      this.unloadInlineStyle = this.domService.setDynamicInlineStyle(this.cssTrackChanges, "docTcStyle");
    }

    akomantosoEl?.querySelectorAll('proprietary').forEach((el) => {
      el.remove();
    });

    if (!akomantosoEl.querySelector('coverpage')) {
      akomantosoEl?.querySelectorAll('docPurpose').forEach((el) => {
        let docInnerHTML = el.innerHTML;
        if (el.textContent.includes('<ins') || el.textContent.includes('<del')) {
          docInnerHTML = el.textContent;
        }
        if (docInnerHTML) {
          docInnerHTML = docInnerHTML.replace(
            /<del[^>]*?>[\s\S]*?<\/del>/gi,
            '',
          );
          docInnerHTML = docInnerHTML.replace(/<\/?ins[^>]*?>/gi, '');
          el.innerHTML = docInnerHTML;
        }
      });
    }

    return akomantosoEl;
  }
}
