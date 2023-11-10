import { DOCUMENT, formatDate, NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { CKEditorService } from '@/features/akn-document/services/ckeditor.service';
import { CoEditionVO } from '@/shared/models/coEditionVO.model';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';
import {TrackChangesActionsService} from "@/features/akn-document/services/track-changes-actions.service";

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  @Input() containerId: string;
  @Input() containerClass: NgClass['ngClass'] = '';
  @Input() xml: string;
  @Input() reloadTrigger: number;
  @Input() readonly = true;
  @ViewChild('container', { static: true })
  containerElRef: ElementRef<HTMLDivElement>;

  currentXml: string;

  private bookmarkMutationObserver?: MutationObserver;
  private destroy$: Subject<any> = new Subject();

  constructor(
    private ckeditorService: CKEditorService,
    @Inject(DOCUMENT) private document: Document,
    private documentService: DocumentService,
    private coEditionWSService: CoEditionServiceWS,
    private translate: TranslateService,
    private trackChangesActionsService:TrackChangesActionsService,
  ) {}

  ngOnDestroy(): void {
    this.bookmarkMutationObserver?.disconnect();
    this.destroy$.next('');
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.currentXml = this.xml;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('xml' in changes && changes.xml.currentValue !== undefined) {
      this.xml = changes.xml.currentValue;
      this.containerElRef.nativeElement.innerHTML = this.xml;
      this.documentService.setDidDocumentLoadAndRender(true);
      this.initTrackChangesActions();
    }
    if (
      'reloadTrigger' in changes &&
      changes.reloadTrigger.currentValue !== 0
    ) {
      this.containerElRef.nativeElement.innerHTML = this.xml;
      this.initTrackChangesActions();
    }
  }

  ngAfterViewInit(): void {
    this.documentService.setDidDocumentLoadAndRender(true);
    if (!this.readonly) {
      this.interceptAndProcessBookmarkLink();
      this.ckeditorService.init();

      this.coEditionWSService
        .getDocCoEditionInfo()
        .pipe(takeUntil(this.destroy$))
        .subscribe((coEdits) => {
          this.showElementsBeingEdited(coEdits);
        });
      this.initTrackChangesActions();
    }
  }

  initTrackChangesActions() {
    this.trackChangesActionsService.show.next({trackChanges: this.document.querySelectorAll(this.trackChangesActionsService.getSelector())});
  }

  generateTooltip(coEdits: CoEditionVO[]) {
    if (!coEdits) return;
    let target = '';
    // FIXME: use translated message for target
    coEdits.forEach(
      (c) =>
        (target =
          target +
          `${c.userName} editing since ${formatDate(
            c.editionTime,
            'dd/mm/yyyy HH:MM',
            'en-US',
          )} <br>`),
    );
    return target;
  }

  private showElementsBeingEdited(coEdits: Record<string, CoEditionVO[]>) {
    const userCoEditionElements = this.document.querySelectorAll(
      '.leos-user-coedition',
    );
    userCoEditionElements.forEach((userCoEditionElement) => {
      userCoEditionElement.remove();
    });
    for (const key in coEdits) {
      if (key)
        for (const coEdit of coEdits[key]) {
          if (coEdit.infoType === 'TOC_INFO') return;
          const elemInToc = this.document.querySelector(
            `[data-id="${coEdit.elementId}"]`,
          );
          const elemInDoc = this.document.getElementById(coEdit.elementId);
          const coEditNode = this.document.createElement('div');
          coEditNode.classList.add(
            'leos-user-coedition',
            'leos-user-coedition-self-user',
          );
          const iconSpan = this.document.createElement('span');
          iconSpan.classList.add('eui-icon', 'eui-icon-person');
          iconSpan.style.verticalAlign = 'bottom';
          iconSpan.style.display = 'inline-block';
          const textDiv = this.document.createElement('div');
          textDiv.innerHTML = this.generateTooltip(coEdits[key]);
          coEditNode.append(iconSpan);
          coEditNode.append(textDiv);
          coEditNode.style.top = elemInDoc.offsetTop + 'px';
          coEditNode.style.left = elemInDoc.offsetLeft - 25 + 'px';
          elemInDoc.insertAdjacentElement('beforebegin', coEditNode);
          // elemInToc.insertAdjacentElement('beforebegin', coEditNode);
          coEditNode.addEventListener('mouseenter', () => {
            textDiv.style.left = iconSpan.offsetLeft + 10 + 'px';
            textDiv.style.display = 'block';
          });
          coEditNode.addEventListener('mouseleave', () => {
            textDiv.style.display = 'none';
          });
        }
    }
  }

  /**
   * Intercept the bookmark link element and replace the hardcoded text using
   * the translation service and the icon with an eui-icon.
   */
  private interceptAndProcessBookmarkLink() {
    const isBookmarkLinkElement = (n: Node): n is Element =>
      n instanceof Element && n.classList.contains('bookmark-link');
    const callback: MutationCallback = (mutationList, observer) => {
      const bookmarkLinkEl = mutationList
        .filter((ml) => ml.type === 'childList')
        .flatMap((ml) => Array.from(ml.addedNodes))
        .find(isBookmarkLinkElement);
      if (bookmarkLinkEl) {
        // set translated text
        const bookmarkTextEl = bookmarkLinkEl.querySelector('.bookmark-text');
        this.translate
          .stream('page.editor.bookmark-text')
          .pipe(takeUntil(this.destroy$))
          .subscribe((text: string) => {
            bookmarkTextEl.textContent = text;
          });
        // set eui-icon
        const bookmarkIconEl = bookmarkLinkEl.querySelector('.bookmark-icon');
        bookmarkIconEl.textContent = '';
        bookmarkIconEl.classList.add('eui-icon', 'eui-icon-edit');
      }
    };

    this.bookmarkMutationObserver = new MutationObserver(callback);
    this.bookmarkMutationObserver.observe(this.containerElRef.nativeElement, {
      childList: true,
      subtree: true,
    });
  }
}
