import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
} from '@angular/core';

import { CKEditorService } from '@/features/akn-document/services/ckeditor.service';

@Component({
  selector: 'app-annex-document',
  templateUrl: './annex-document.component.html',
  styleUrls: ['./annex-document.component.scss'],
})
export class AnnexDocumentComponent implements OnInit, AfterViewInit {
  @Input() xml: string;

  constructor(
    private ckeditorService: CKEditorService,
    @Inject(DOCUMENT) private document: Document,
    private rootElementRef: ElementRef<HTMLElement>,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const rootEl = this.rootElementRef.nativeElement;
    this.xml = this.xml.replaceAll('xml:id', 'id');
    rootEl.innerHTML = this.xml;
    this.ckeditorService.init();
  }
}
