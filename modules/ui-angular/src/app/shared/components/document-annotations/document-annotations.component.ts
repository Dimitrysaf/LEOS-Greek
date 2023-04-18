import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
} from '@angular/core';

import { AppConfigService } from '@/core/services/app-config.service';
import { LeosLegacyService } from '@/features/leos-legacy/services/leos-legacy.service';
import { AnnotateOperationMode, Permission } from '@/shared';
import { AnnotateService } from '@/shared/services/annotate.service';
import { DocumentService } from '@/shared/services/document.service';

import { AnnotateManager } from './annotate-manager';

@Component({
  selector: 'app-document-annotations',
  templateUrl: './document-annotations.component.html',
  styleUrls: ['./document-annotations.component.scss'],
})
export class DocumentAnnotationsComponent implements OnDestroy, AfterViewInit {
  @Input() documentId: string;
  @Input() connectedEntity: string | null = null;
  @Input() containerId = 'docContainer';
  @Input() operationMode: AnnotateOperationMode = 'NORMAL';
  @Input() permissions: Permission[] = [];
  @Input() proposalRef: string | null = null;
  @Input() showGuideLinesButton = true;
  @Input() showStatusFilter = true;
  @Input() canvasClass?: string;

  private annotate: AnnotateManager;
  private mutationObserver?: MutationObserver;
  private canvasMutationObserver?: MutationObserver;
  private canvasEl?: HTMLCanvasElement;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private elementRef: ElementRef<HTMLElement>,
    private leos: LeosLegacyService,
    private appConfig: AppConfigService,
    private annotateService: AnnotateService,
    private documentService: DocumentService,
  ) {}

  ngAfterViewInit() {
    void this.interceptAndEmbedAnnotatorFrame();
    void this.interceptAndProcessAnnotatorCanvas();
    this.annotate = new AnnotateManager(
      this.leos,
      this.appConfig,
      this.documentId,
      this.permissions,
      {
        annotationContainer: `#${this.containerId}`,
        connectedEntity: this.connectedEntity,
        operationMode: this.operationMode,
        proposalRef: this.proposalRef,
        showGuideLinesButton: this.showGuideLinesButton,
        showStatusFilter: this.showStatusFilter,
      },
      this.annotateService,
    );
    this.documentService.setAnnotationGetter(() =>
      this.annotate.getAnnotations(),
    );
    this.documentService.documentView$.subscribe((view) => {
      this.annotate.refresh();
    });
  }

  ngOnDestroy() {
    this.annotate.destroy();
    this.mutationObserver?.disconnect();
    this.canvasMutationObserver?.disconnect();
    this.canvasEl?.remove();
    this.canvasEl = null;
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

  private interceptAndProcessAnnotatorCanvas() {
    const isAnnotatorCanvas = (n: Node): n is HTMLCanvasElement =>
      n instanceof Element && n.id === 'leosCanvas';
    const callback: MutationCallback = (mutationList, observer) => {
      const canvasEl = mutationList
        .filter((ml) => ml.type === 'childList')
        .flatMap((ml) => Array.from(ml.addedNodes))
        .find(isAnnotatorCanvas);
      if (canvasEl) {
        observer.disconnect();
        this.canvasEl = canvasEl;
        document.body.appendChild(canvasEl);
        if (this.canvasClass) {
          canvasEl.classList.add('leos-guideline-canvas--above-modals');
        }
      }
    };

    this.canvasMutationObserver = new MutationObserver(callback);
    this.canvasMutationObserver.observe(this.document.body, {
      childList: true,
      subtree: true,
    });
  }
}
