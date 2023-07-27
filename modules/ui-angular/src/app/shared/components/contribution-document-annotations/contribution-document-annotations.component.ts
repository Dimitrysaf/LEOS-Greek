import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import { merge, Subject, takeUntil } from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';
import { CKEditorService } from '@/features/akn-document/services/ckeditor.service';
import { LeosLegacyService } from '@/features/leos-legacy/services/leos-legacy.service';
import { AnnotateOperationMode, Permission } from '@/shared';
import { ContributionAnnotateManager } from '@/shared/components/contribution-document-annotations/contribution-annotate-manager';
import { AnnotateService } from '@/shared/services/annotate.service';
import { DocumentService } from '@/shared/services/document.service';

@Component({
  selector: 'app-contribution-document-annotations',
  templateUrl: './contribution-document-annotations.component.html',
  styleUrls: ['./contribution-document-annotations.component.scss'],
})
export class ContributionDocumentAnnotationsComponent
  implements OnDestroy, AfterViewInit
{
  @Input() documentId: string;
  @Input() connectedEntity: string | null = null;
  @Input() containerId = 'contributionViewContainer';
  @Input() operationMode: AnnotateOperationMode = 'NORMAL';
  @Input() permissions: Permission[] = [];
  @Input() proposalRef: string | null = null;
  @Input() showGuideLinesButton = true;
  @Input() showStatusFilter = true;
  @Input() canvasClass?: string;
  @Output() sidebarShown = new EventEmitter<void>();

  private annotate: ContributionAnnotateManager;
  private mutationObserver?: MutationObserver;
  private canvasMutationObserver?: MutationObserver;
  private canvasEl?: HTMLCanvasElement;
  private iframeEl?: HTMLIFrameElement;

  private destroy$ = new Subject<void>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private elementRef: ElementRef<HTMLElement>,
    private leos: LeosLegacyService,
    private appConfig: AppConfigService,
    private annotateService: AnnotateService,
    private documentService: DocumentService,
    @Optional() private ckEditorService?: CKEditorService,
  ) {}

  ngAfterViewInit() {
    void this.interceptAndEmbedAnnotatorFrame();
    void this.interceptAndProcessAnnotatorCanvas();
    this.annotate = new ContributionAnnotateManager(
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
      this.documentService,
      this.ckEditorService,
    );
    this.documentService.setAnnotationGetter(() =>
      this.annotate.getAnnotations(),
    );
    merge(
      this.documentService.documentView$,
      this.documentService.reloadTrigger$,
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.annotate.refresh());
    this.documentService.setAnnotationsReadOnlySetter(
      (mode: AnnotateOperationMode) => {
        this.annotate.setAnnotationMode(mode);
      },
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.annotate.destroy();
    this.mutationObserver?.disconnect();
    this.canvasMutationObserver?.disconnect();
    this.canvasEl?.remove();
    this.canvasEl = null;
    this.iframeEl = null;
  }

  @HostListener('window:message', ['$event'])
  annotationsLoadedListener(event: MessageEvent) {
    if (
      event.source === this.iframeEl?.contentWindow &&
      event.data.method === 'showSidebar'
    ) {
      this.sidebarShown.emit();
    }
  }

  private interceptAndEmbedAnnotatorFrame() {
    const isAnnotatorFrameWrapper = (n: Node): n is Element =>
      n instanceof Element && n.classList.contains('annotator-frame');
    const callback: MutationCallback = (mutationList, observer) => {
      const frameWrapperEl = mutationList
        .filter((ml) => ml.type === 'childList')
        .flatMap((ml) => Array.from(ml.addedNodes))
        .find(isAnnotatorFrameWrapper);
      if (frameWrapperEl) {
        observer.disconnect();
        this.elementRef.nativeElement.appendChild(frameWrapperEl);
        this.iframeEl = frameWrapperEl.querySelector('iframe');
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
