import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
} from '@angular/core';

import { AnnotateService } from '@/features/akn-document/services/annotate.service';

@Component({
  selector: 'app-document-annotations',
  templateUrl: './document-annotations.component.html',
  styleUrls: ['./document-annotations.component.scss'],
})
export class DocumentAnnotationsComponent implements OnDestroy, AfterViewInit {
  @Input() documentId: string;

  private mutationObserver?: MutationObserver;

  constructor(
    private annotate: AnnotateService,
    @Inject(DOCUMENT) private document: Document,
    private elementRef: ElementRef<HTMLElement>,
  ) {}

  ngAfterViewInit() {
    void this.interceptAndEmbedAnnotatorFrame();
    this.annotate.setDocumentId(this.documentId);
  }

  ngOnDestroy() {
    this.mutationObserver?.disconnect();
  }

  private interceptAndEmbedAnnotatorFrame() {
    const isAnnotatorFrame = (n: Node): n is Element =>
      n instanceof Element && n.classList.contains('annotator-frame');
    const callback: MutationCallback = (mutationList, observer) => {
      const frameEl = mutationList
        .filter((ml) => ml.type === 'childList')
        .flatMap((ml) => Array.from(ml.addedNodes))
        .find(isAnnotatorFrame);
      if (frameEl) {
        observer.disconnect();
        this.elementRef.nativeElement.appendChild(frameEl);
      }
    };

    this.mutationObserver = new MutationObserver(callback);
    this.mutationObserver.observe(this.document.body, { childList: true });
  }
}
