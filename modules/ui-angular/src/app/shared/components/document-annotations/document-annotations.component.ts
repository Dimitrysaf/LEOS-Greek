import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  combineLatest,
  distinctUntilChanged,
  skip,
  Subject,
  takeUntil,
} from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';
import { CKEditorService } from '@/features/akn-document/services/ckeditor.service';
import { LeosLegacyService } from '@/features/leos-legacy/services/leos-legacy.service';
import { AnnotateOperationMode, Permission } from '@/shared';
import { AnnotateService } from '@/shared/services/annotate.service';
import { DocumentService } from '@/shared/services/document.service';

import { AnnotateManager } from './annotate-manager';
import {ProposalMilestonesService} from "@/shared/services/proposal-milestones.service";
import {MergeContributionsService} from "@/features/akn-document/services/merge-contributions.service";

@Component({
  selector: 'app-document-annotations',
  templateUrl: './document-annotations.component.html',
  styleUrls: ['./document-annotations.component.scss'],
})
export class DocumentAnnotationsComponent
  implements OnDestroy, AfterViewInit, OnChanges
{
  @Input() documentId: string;
  @Input() connectedEntity?: string;
  @Input() containerId;
  @Input() operationMode: AnnotateOperationMode = 'NORMAL';
  @Input() permissions: Permission[] = [];
  @Input() proposalRef?: string;
  @Input() legFileName?: string;
  @Input() showGuideLinesButton = true;
  @Input() showStatusFilter = true;
  @Input() disableSuggestionButton: boolean;
  @Input() disableHighlightButton: boolean;
  @Input() sidebarAppId?: string;
  @Input() temporaryDataId?: string;
  @Input() temporaryDataDocument?: string;
  @Input() canvasClass?: string;
  @Input() collapsed = false;
  @Output() sidebarShown = new EventEmitter<void>();

  private static instanceCount = 1;
  private instanceId = DocumentAnnotationsComponent.instanceCount++;

  private annotate: AnnotateManager;
  private mutationObserver?: MutationObserver;
  private canvasMutationObserver?: MutationObserver;
  private canvasEl?: HTMLCanvasElement;
  private iframeEl?: HTMLIFrameElement;
  private toggleBtnEl?: HTMLButtonElement;

  private destroy$ = new Subject<void>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private elementRef: ElementRef<HTMLElement>,
    private leos: LeosLegacyService,
    private appConfig: AppConfigService,
    private annotateService: AnnotateService,
    private documentService: DocumentService,
    private milestoneService: ProposalMilestonesService,
    private mergeContributionService: MergeContributionsService,
    @Optional() private ckEditorService?: CKEditorService,
  ) {}

  ngAfterViewInit() {
    void this.interceptAndSetAnnotatorFrame();
    void this.interceptAndProcessAnnotatorCanvas();
    this.annotate = new AnnotateManager(
      this.leos,
      this.appConfig,
      this.permissions,
      {
        sidebarContainer: `#${this.getOrSetHostId()}`,
        annotationContainer: `#${this.containerId}`,
        connectedEntity: this.connectedEntity,
        operationMode: this.operationMode,
        proposalRef: this.proposalRef,
        legFileName: this.legFileName,
        showGuideLinesButton: this.showGuideLinesButton,
        showStatusFilter: this.showStatusFilter,
        disableSuggestionButton: this.disableSuggestionButton,
        disableHighlightButton: this.disableHighlightButton,
        sidebarAppId: this.sidebarAppId,
        temporaryDataId: this.temporaryDataId,
        temporaryDataDocument: this.temporaryDataDocument,
      },
      this.annotateService,
      this.documentService,
      this.milestoneService,
      this.mergeContributionService,
      this.ckEditorService,
    );
    this.documentService.setAnnotationGetter(() =>
      this.annotate.getAnnotations(),
    );
    combineLatest([
      this.documentService.documentView$,
      this.documentService.reloadTrigger$,
    ])
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(
          (a, b) => a.length === b.length && a.every((v, i) => v === b[i]),
        ),
        skip(1),
      )
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
    this.toggleBtnEl = null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.collapsed && changes.collapsed.previousValue !== undefined) {
      this.toggleBtnEl?.click();
    }
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

  private getOrSetHostId() {
    const el = this.elementRef.nativeElement;
    if (el && !el.id) {
      el.id = `annotation-sidebar-container-${this.instanceId}`;
    }
    return el?.id;
  }

  private interceptAndSetAnnotatorFrame() {
    const isAnnotatorFrameWrapper = (n: Node): n is Element =>
      n instanceof Element && n.classList.contains('annotator-frame');
    const callback: MutationCallback = (mutationList, observer) => {
      const frameWrapperEl = mutationList
        .filter((ml) => ml.type === 'childList')
        .flatMap((ml) => Array.from(ml.addedNodes))
        .find(isAnnotatorFrameWrapper);
      if (frameWrapperEl) {
        observer.disconnect();
        frameWrapperEl.classList.toggle('annotator-collapsed', this.collapsed);
        this.iframeEl = frameWrapperEl.querySelector('iframe');
        this.toggleBtnEl = this.elementRef.nativeElement.querySelector(
          'button.annotator-frame-button--sidebar_toggle',
        );
      }
    };

    this.mutationObserver = new MutationObserver(callback);
    this.mutationObserver.observe(this.elementRef.nativeElement, {
      childList: true,
    });
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
          canvasEl.classList.add(this.canvasClass);
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
