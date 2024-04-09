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
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

import { CKEditorService } from '@/features/akn-document/services/ckeditor.service';
import { TrackChangesActionsService } from '@/features/akn-document/services/track-changes-actions.service';
import { CoEditionVO } from '@/shared/models/coEditionVO.model';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';
import { EnvironmentService } from '@/shared/services/enviroment.service';

import { TableOfContentService } from '../../services/table-of-content.service';
import {ProposalMilestonesService} from "@/shared/services/proposal-milestones.service";

const MAIN_CONTAINER_WIDTH = 500.6;

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
  @Input() mainContainerId: string;
  @Input() containerClass: NgClass['ngClass'] = '';
  @Input() documentType: string;
  @Input() xml: string;
  @Input() readonly = true;
  @Input() contributionView = false;
  @Input() isDoubleCompare = false;
  @ViewChild('container', { static: true })
  containerElRef: ElementRef<HTMLDivElement>;
  @ViewChild('zoomScrollbar', { static: true })
  zoomScrollbarRef: ElementRef<HTMLDivElement>;
  documentStyle = {};

  paddingLeft: string;
  zoomLevel: number;
  private bookmarkMutationObserver?: MutationObserver;
  private destroy$: Subject<any> = new Subject();
  private isCNInstance = false;

  constructor(
    private ckeditorService: CKEditorService,
    @Inject(DOCUMENT) private document: Document,
    private documentService: DocumentService,
    private coEditionWSService: CoEditionServiceWS,
    private translate: TranslateService,
    private trackChangesActionsService: TrackChangesActionsService,
    private tableOfContentService: TableOfContentService,
    private environmentService: EnvironmentService,
    private milestoneService: ProposalMilestonesService,
  ) {
    this.isCNInstance = this.environmentService.isCouncil();
    this.milestoneService.triggerRequestStoredDocumentAnnotations$.subscribe((request) => {
        if (request && this.contributionView) {
          this.milestoneService.sendRequestStoredDocumentAnnotations(request.proposalRef, request.legFileName, request.documentRef, false);
        } else {
          this.milestoneService.sendEmptyStoredDocumentAnnotations();
        }
      });
  }

  ngOnDestroy(): void {
    this.documentService.setIsEditorOpen(false);
    this.bookmarkMutationObserver?.disconnect();
    if (!this.readonly) {
      this.documentService.clearDocumentState();
    }
    this.destroy$.next('');
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.readonly &&
      'xml' in changes &&
      changes.xml.currentValue !== undefined
    ) {
      this.xml = changes.xml.currentValue;
      this.loadDocument(this.xml);
    }
  }

  ngOnInit(): void {
    // handle case Memorandum for CN which is required to be readOnly
    if (
      this.readonly &&
      this.environmentService.isCouncil() &&
      this.documentType === 'memorandum'
    ) {
      this.documentService.documentView$
        .pipe(takeUntil(this.destroy$))
        .subscribe((documentView) => {
          if (documentView && !this.contributionView) {
            this.loadDocument(documentView.editableXml);
          }
          this.ckeditorService.initUserGuidanceStandalone();
        });
    }

    if (!this.readonly) {
      this.documentService.documentView$
        .pipe(takeUntil(this.destroy$))
        .subscribe((documentView) => {
          if (documentView && !this.contributionView) {
            this.loadDocument(documentView.editableXml);
          }
        });

      this.documentService.refreshView$
        .pipe(takeUntil(this.destroy$))
        .subscribe((documentView) => {
          if (documentView && !this.contributionView) {
            this.loadDocument(documentView.editableXml);
          }
        });

      this.documentService.reloadTrigger$
        .pipe(takeUntil(this.destroy$))
        .subscribe((trigger) => trigger !== 0 && this.loadDocument(this.xml));

      this.documentService.updateElementContent$
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          data && this.updateElementContent({
            documentRef: data.documentRef,
            elementId: data.elementId,
            elementType: data.elementType,
            elementFragment: data.elementFragment,
            presenterId: this.coEditionWSService.presenterId,
            isClosing: data.isClosing,
            isSaved: data.isSaved
          });
        });

      this.documentService.getElementContent$
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.documentService.getElementContentResponse$ =
            new BehaviorSubject<{
              elementId: string;
              elementType: string;
              elementFragment: string;
            }>(this.getElementContent(data)).asObservable();
        });

      this.documentService.resetZoom$
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.resetZoom();
        });

      this.coEditionWSService.shouldReloadAfterUpdate
        .pipe(takeUntil(this.destroy$))
        .subscribe((coEditionUpdate) => {
          if (coEditionUpdate) {
            if (
              coEditionUpdate.updatedElements &&
              coEditionUpdate.updatedElements.length > 0
            ) {
              coEditionUpdate.updatedElements.forEach((element) => {
                this.updateElementContent({
                  documentRef: coEditionUpdate.documentId,
                  elementId: element.elementId,
                  elementType: element.elementTagName,
                  elementFragment: element.elementFragment,
                  presenterId: coEditionUpdate.presenterId,
                  isClosing: false,
                  isSaved: false,
                });
              });
              this.documentService.reloadView();
              this.tableOfContentService.reload();
            } else {
              this.documentService.reloadDocument();
            }
          }
        });
    }
  }

  ngAfterViewInit(): void {
    this.documentService.setDidDocumentLoadAndRender(true);
    if (!this.readonly) {
      this.interceptAndProcessBookmarkLink();
      this.documentService.documentView$
          .pipe(takeUntil(this.destroy$))
          .subscribe((documentView) => {
            this.ckeditorService.init();
          });

      this.coEditionWSService
        .getDocCoEditionInfo()
        .pipe(takeUntil(this.destroy$))
        .subscribe((coEdits) => {
          this.coEditionWSService.showElementsBeingEdited(coEdits);
        });
      this.initTrackChangesActions();
    }
  }

  initTrackChangesActions() {
    this.trackChangesActionsService.show.next({
      trackChanges: this.document.querySelectorAll(
        this.trackChangesActionsService.getSelector(),
      ),
    });
  }

  handleZoomChange(event: { zoomLevel: number }) {
    this.zoomLevel = event.zoomLevel;
    const scaleFactor = event.zoomLevel / 100;

    this.documentStyle = {
      transform: `scale(${scaleFactor})`,
      transformOrigin: 'center top',
    };

    const zoomedDocumentHeight = MAIN_CONTAINER_WIDTH * scaleFactor;
    this.containerElRef.nativeElement.style.height = `${zoomedDocumentHeight}px`;
    this.updatePadding();
  }

  updatePadding() {
    if (
      this.zoomLevel > 100 &&
      this.document.getElementById('versionContainer')
    ) {
      const scalePaddingFactor = 8;
      const additionalZoom = this.zoomLevel - 100;
      this.paddingLeft = `${additionalZoom * scalePaddingFactor}px`;
    } else {
      this.paddingLeft = '0px';
    }
  }

  resetZoom() {
    const event = { zoomLevel: 100 };
    this.handleZoomChange(event);
  }

  private loadDocument(xml: string) {
    this.xml = this.cleanupAndSerializeXML(xml);
    this.containerElRef.nativeElement.innerHTML = this.xml;
    if (!this.isCNInstance) {
      this.documentService.setDidDocumentLoadAndRender(true);
    }
    if (!this.readonly) {
      this.coEditionWSService.showElementsBeingEdited(
        this.coEditionWSService.getDocCoEditionInfoData()
      );
      this.initTrackChangesActions();
      this.ckeditorService.refreshStateAllAvailableConnectors();
    }
  }

  private cleanupAndSerializeXML(xml: string, akomantosoId?: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/html');
    const akomantosoEl = xmlDoc.querySelector('akomantoso');

    if (!akomantosoEl) return xml;
    if (this.documentType !== 'coverPage' && akomantosoEl) {
      akomantosoEl
        .querySelectorAll('meta, coverPage')
        .forEach((el) => el.remove());

      akomantosoEl.querySelectorAll('docPurpose').forEach((el) => {
        if (el.textContent) {
          el.innerHTML = decodeURI(el.textContent);
        }
      });
    }

    if (akomantosoId) {
      akomantosoEl.id = akomantosoId;
    }
    return akomantosoEl.outerHTML;
  }

  private reloadElements(data: {
    elementId: string;
    elementType: string;
    elementFragment: string;
    isClosing: boolean;
  }) {
    this.updateElementInXml(data);
    this.updateElementInDom(data);
  }

  private updateElementContent(data: {
    documentRef: string;
    elementId: string;
    elementType: string;
    elementFragment: string;
    presenterId: string,
    isClosing: boolean;
    isSaved: boolean;
  }) {
    if (!data || (data.documentRef !== this.documentService.documentRef)) {
      return;
    }
    const ckeditorsOpen = this.document.querySelectorAll('.cke_editable');
    if (ckeditorsOpen && ckeditorsOpen.length > 0) {
      const ckeditorOpen = ckeditorsOpen.item(0);
      const elementInEditor = ckeditorOpen.querySelector(`#${data.elementId}`);
      if (!elementInEditor) {
        this.reloadElements(data);
      } else if (data.isClosing && !data.isSaved) {
        if (this.shouldReloadDocument(data)) {
          this.documentService.reloadDocument();
        } else {
          this.reloadElements(data)
        }
      } else if (this.coEditionWSService.presenterId !== data.presenterId) {
        this.documentService.isReloadRequired = true;
      }
    } else {
      if (this.shouldReloadDocument(data)) {
        this.documentService.reloadDocument();
      } else {
        this.reloadElements(data)
      }
    }
    this.initTrackChangesActions();
  }

  private shouldReloadDocument(data: {
    elementId: string;
    elementType: string;
    elementFragment: string;
  }) {
    return this.isCNInstance || this.authorialNotesUpdated(data) || this.isElementDepthUpdated(data) || this.isSplitParagraphs(data);
  }

  private authorialNotesUpdated(data: {
    elementId: string;
    elementType: string;
    elementFragment: string;
  }) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.xml, 'text/html'),
      docFragment = parser.parseFromString(this.cleanForView(data.elementFragment), 'text/html');
    const xmlElement = doc.getElementById(data.elementId),
      authorialNotesXmlWithId = xmlElement.querySelectorAll("authorialNote[id]");
    const authorialNotesFragmentWithId = docFragment.querySelectorAll("authorialNote[id]");
    return authorialNotesXmlWithId.length !== authorialNotesFragmentWithId.length;
  }

  private isSplitParagraphs(data: {
    elementId: string;
    elementType: string;
    elementFragment: string;
  }) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.xml, 'text/html');
    const paragraphsWithoutId = doc.querySelectorAll("paragraph:not([id])");
    return data.elementType === 'paragraph' && paragraphsWithoutId.length > 0;
  }

  private isElementDepthUpdated(data: {
    elementId: string;
    elementType: string;
    elementFragment: string;
  }) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.xml, 'text/html'),
      docFragment = parser.parseFromString(this.cleanForView(data.elementFragment), 'text/html');
    const xmlElement = doc.getElementById(data.elementId),
      xmlElementDepth = xmlElement.getAttribute("leos:depth");
    const fragmentElement = docFragment.getElementById(data.elementId),
      fragmentElementDepth = fragmentElement.getAttribute("leos:depth");
    return xmlElementDepth && fragmentElementDepth && (xmlElementDepth !== fragmentElementDepth);
  }

  private updateElementInXml(data: {
    elementId: string;
    elementType: string;
    elementFragment: string;
  }) {
    if (data && data.elementId && data.elementType) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.xml, 'text/html');
      const xmlElement = doc.getElementById(data.elementId);
      if (xmlElement) {
        xmlElement.outerHTML = this.cleanForView(data.elementFragment);
        this.xml = doc.documentElement.outerHTML;
      }
    }
  }

  private updateElementInDom(data: {
    elementId: string;
    elementType: string;
    elementFragment: string;
  }) {
    if (data && data.elementId && data.elementType) {
      const htmlElement = this.document.getElementById(data.elementId);
      if (htmlElement) {
        htmlElement.outerHTML = this.cleanForView(data.elementFragment);
        this.handleInternalReferences(data.elementId);
      }
    }
  }

  private handleInternalReferences(elementId: string) {
    const htmlElement = this.document.getElementById(elementId);
    Array.from(htmlElement.getElementsByTagName('ref')).forEach(function(internalReference) {
      const href = internalReference.getAttribute('href'), refId = href.substring(href.indexOf('/') + 1);
      internalReference.setAttribute('onclick','LEOS.scrollTo(\'' + refId + '\');');
    });
  }

  private getElementContent(data: { elementId: string; elementType: string }): {
    elementId: string;
    elementType: string;
    elementFragment: string;
  } {
    if (data && data.elementId) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.xml, 'text/html');
      const elt = doc.getElementById(data.elementId);
      return {
        elementId: data.elementId,
        elementType: elt.nodeName.toLowerCase(),
        elementFragment:
          elt === null ? null : this.cleanForTransformation(elt.outerHTML)
      };
    } else {
      return {
        elementId: null,
        elementType: null,
        elementFragment: null
      };
    }
  }

  private cleanForTransformation(content: string): string {
    if (!content) {
      content = '';
    }
    return content
      .replaceAll('<aknp ', '<p ')
      .replaceAll('</aknp>', '</p>')
      .replaceAll(' id=', ' xml:id=')
      .replaceAll('<akntitle ', '<title ')
      .replaceAll('</akntitle>', '</title>');
  }

  private cleanForView(content: string): string {
    if (!content) {
      content = '';
    }
    return content
      .replaceAll('<p ', '<aknp ')
      .replaceAll('</p>', '</aknp>')
      .replaceAll(' xml:id=', ' id=')
      .replaceAll('<title ', '<akntitle ')
      .replaceAll('</title>', '</akntitle>');
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
