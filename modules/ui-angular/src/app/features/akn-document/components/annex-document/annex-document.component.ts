// eslint-disable-next-line simple-import-sort/imports
import { DOCUMENT, formatDate } from '@angular/common';
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
} from '@angular/core';

import { CKEditorService } from '@/features/akn-document/services/ckeditor.service';
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { CoEditionVO } from '@/shared/models/coEditionVO.model';

@Component({
  selector: 'app-annex-document',
  templateUrl: './annex-document.component.html',
  styleUrls: ['./annex-document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnexDocumentComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  @Input() xml: string;

  destroy$: Subject<any> = new Subject();

  constructor(
    private ckeditorService: CKEditorService,
    @Inject(DOCUMENT) private document: Document,
    private rootElementRef: ElementRef<HTMLElement>,
    private http: HttpClient,
    private coEditionWSService: CoEditionServiceWS,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('xml' in changes && changes.xml.currentValue !== undefined) {
      const rootEl = this.rootElementRef.nativeElement;
      this.xml = changes.xml.currentValue;
      rootEl.innerHTML = this.xml;
    }
  }

  ngAfterViewInit(): void {
    this.ckeditorService.init();

    this.coEditionWSService
      .getDocCoEditionInfo()
      .pipe(takeUntil(this.destroy$))
      .subscribe((coEdits) => {
        this.showElementsBeingEdited(coEdits);
      });
  }

  generateTooltip(coEdits: CoEditionVO[]) {
    if (!coEdits) return;
    let target = '';
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

  formatDate(date: Date) {}

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
          console.log(textDiv.innerHTML);
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
}
