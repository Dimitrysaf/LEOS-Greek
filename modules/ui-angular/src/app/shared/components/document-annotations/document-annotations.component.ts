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

  private annotate: AnnotateManager;
  private mutationObserver?: MutationObserver;

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
  }

  ngOnDestroy() {
    this.annotate.destroy();
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
