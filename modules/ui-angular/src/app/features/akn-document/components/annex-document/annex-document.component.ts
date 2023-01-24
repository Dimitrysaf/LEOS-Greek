// eslint-disable-next-line simple-import-sort/imports
import { DOCUMENT } from '@angular/common';
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
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('xml' in changes) {
      const rootEl = this.rootElementRef.nativeElement;
      this.xml = changes.xml.currentValue.replaceAll('xml:id', 'id');
      rootEl.innerHTML = this.xml;
    }
  }

  ngAfterViewInit(): void {
    this.ckeditorService.init();
  }
}
