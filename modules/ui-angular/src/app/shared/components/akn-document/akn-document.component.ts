import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';
import { DocumentService } from '@/shared/services/document.service';
import { DomService } from '@/shared/services/dom.service';

@Component({
  selector: 'app-akn-document',
  templateUrl: './akn-document.component.html',
  styleUrls: ['./akn-document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AknDocumentComponent implements OnDestroy, OnInit, AfterViewInit {
  @Input() documentType: string;
  @Input() xml: string;
  @Input() containerId: string;

  id: string;
  @ViewChild('xmlView', { static: false }) xmlView: ElementRef<HTMLElement>;

  private unloadStyleSheet?: () => void;
  private destroy$: Subject<any> = new Subject();

  constructor(
    private documentService: DocumentService,
    private domService: DomService,
    public doc: DocumentService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private config: AppConfigService,
    private rootElementRef: ElementRef<HTMLElement>,
  ) {}

  ngOnInit(): void {
    this.loadStyleSheet();
  }

  ngOnDestroy() {
    this.unloadStyleSheet?.();
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.loadDocument(this.xml);
  }

  private loadDocument(xml: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const rootEl = this.rootElementRef.nativeElement;
    rootEl.innerHTML = this.cleanupAndSerializeXML(xmlDoc);
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
    return new XMLSerializer().serializeToString(
      xmlDoc.querySelector('akomaNtoso'),
    );
  }
}
