import { NgClass } from '@angular/common';
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
import { Subject } from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';
import { DOCUMENT_STYLES } from '@/shared';
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
  @Input() containerClass: NgClass['ngClass'] = '';

  @ViewChild('container', { static: true })
  containerElRef: ElementRef<HTMLDivElement>;

  private unloadStyleSheet?: () => void;
  private destroy$: Subject<any> = new Subject();

  constructor(
    private domService: DomService,
    public doc: DocumentService,
    private config: AppConfigService,
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
    const rootEl = this.containerElRef.nativeElement;
    const akomantosoEl = this.cleanupXML(xml);
    rootEl.innerHTML = '';
    rootEl.appendChild(akomantosoEl);
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

    akomantosoEl?.querySelectorAll('docPurpose').forEach((el) => {
      let docInnerHTML = el.innerHTML;
      if(el.textContent.includes('<ins') || el.textContent.includes('<del')){
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

    return akomantosoEl;
  }
}
