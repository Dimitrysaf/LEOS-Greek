import { delay, Observable, shareReplay } from 'rxjs';

import {MergeContributionsService} from "@/features/akn-document/services/merge-contributions.service";
import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';
import type {
  AnnotateConnectorState,
  MergeSuggestionRequest,
  Permission,
} from '@/shared';
import { AnnotateService } from '@/shared/services/annotate.service';
import { DocumentService } from '@/shared/services/document.service';
import {ProposalMilestonesService} from "@/shared/services/proposal-milestones.service";

export type AnnotateConnectorInitialState = Omit<
  AnnotateConnectorState,
  keyof LeosJavaScriptExtensionState
>;
export type AnnotateConnectorOptions = {
  permissions: Permission[];
  responseFilteredAnnotations?: (annotations: string) => void;
};

const CACHE_TIME = 1000;

export class AnnotateConnector extends AbstractJavaScriptComponent<AnnotateConnectorState> {
  /* set in `modules/js/src/main/js/ui/extension/annotateExtension.js` */
  target?: Element;
  receiveStoredDocumentAnnotations?: (annotationsList: any) => void;
  receiveUserPermissions?: (...userPermissions: Permission[]) => void;
  receiveSecurityToken?: (token: string) => void;
  receiveMergeSuggestion?: (result) => void;
  receiveMergeSuggestions?: (...results) => void;
  receiveDocumentMetadata?: (metadata: string) => void;
  receiveSearchMetadata?: (metadatasets: string) => void;
  stateChangeHandler?: (state: 'OPEN' | 'CLOSE') => void;
  requestFilteredAnnotations?: () => void;
  dbg = Math.random();

  private requestDocumentMetadataCache$: ReturnType<
    AnnotateService['getDocumentsMetadata']
  >;
  private requestUserPermissionsCache$: ReturnType<
    AnnotateService['getUserPermissions']
  >;
  private requestSearchMetadataCache$: ReturnType<
    AnnotateService['fetchSearchMetadata']
  >;
  private requestSecurityTokenCache$: ReturnType<
    AnnotateService['getSecurityAnnotateToken']
  >;

  constructor(
    state: AnnotateConnectorInitialState,
    private options: AnnotateConnectorOptions,
    private annotateService: AnnotateService,
    private documentService: DocumentService,
    private milestoneService: ProposalMilestonesService,
    private mergeContributionService: MergeContributionsService,
  ) {
    super({ ...leosJavaScriptExtensionState, ...state }, null);
  }

  requestStoredDocumentAnnotations(uri: string) {
    this.milestoneService.getStoredDocumentAnnotations(uri);
    this.milestoneService.receiveStoredDocumentAnnotations$.subscribe((result) => {
      if (result) {
        this.receiveStoredDocumentAnnotations(result);
      }
    });
  }

  requestCountSentFeedbacks(annots: []) {
    this.mergeContributionService.setFeedbackToBeSent(annots.length > 0);
  }

  requestDocumentMetadata(...args) {
    if (this.requestDocumentMetadataCache$) return;
    this.requestDocumentMetadataCache$ = this.annotateService
      .getDocumentsMetadata()
      .pipe(shareReplay());
    this.clearRequestCache('requestDocumentMetadataCache$');

    this.requestDocumentMetadataCache$.pipe(delay(0)).subscribe((metadata) => {
      this.receiveDocumentMetadata(JSON.stringify(metadata));
    });
  }

  requestUserPermissions(...args) {
    if (this.requestUserPermissionsCache$) return;
    const hasFullDocumentService = !!this.documentService.permissions$;
    this.requestUserPermissionsCache$ = hasFullDocumentService
      ? this.documentService.permissions$
      : this.annotateService.getUserPermissions().pipe(shareReplay());
    this.clearRequestCache('requestUserPermissionsCache$');

    this.requestUserPermissionsCache$.pipe(delay(0)).subscribe((perms) => {
      this.receiveUserPermissions(...perms);
    });
  }

  requestMergeSuggestion(...args) {
    const mergeRequests: MergeSuggestionRequest[] = args.map(
      ({
        completeOuterHTML,
        elementId,
        endOffset,
        newText,
        origText,
        parentElementId,
        startOffset,
      }) => ({
        completeOuterHTML: completeOuterHTML as string,
        elementId: elementId as string,
        newText: newText as string,
        origText: origText as string,
        parentElementId: parentElementId as string,
        startOffset: startOffset as number,
        endOffset: endOffset as number,
      }),
    );

    this.annotateService
      .requestMergeSuggestion(mergeRequests[0])
      .subscribe((res) => {
        this.receiveMergeSuggestion(res);
      });
  }

  requestMergeSuggestions(...args) {
    const mergeRequests: MergeSuggestionRequest[] = args[0].map(
      ({
        completeOuterHTML,
        elementId,
        endOffset,
        newText,
        origText,
        parentElementId,
        startOffset,
      }) => ({
        completeOuterHTML: completeOuterHTML as string,
        elementId: elementId as string,
        newText: newText as string,
        origText: origText as string,
        parentElementId: parentElementId as string,
        startOffset: startOffset as number,
        endOffset: endOffset as number,
      }),
    );
    this.annotateService
      .requestMergeSuggestions(mergeRequests)
      .subscribe((res) => {
        this.receiveMergeSuggestions(...res);
      });
  }

  requestSearchMetadata() {
    if (this.requestSearchMetadataCache$) return;
    this.requestSearchMetadataCache$ = this.annotateService
      .fetchSearchMetadata()
      .pipe(shareReplay());
    this.clearRequestCache('requestSearchMetadataCache$');

    this.requestSearchMetadataCache$.pipe(delay(0)).subscribe((res) => {
      this.receiveSearchMetadata?.(JSON.stringify([{ status: res[0].status }]));
    });
  }

  requestSecurityToken() {
    if (this.requestSecurityTokenCache$) return;
    this.requestSecurityTokenCache$ = this.annotateService
      .getSecurityAnnotateToken()
      .pipe(shareReplay());
    this.clearRequestCache('requestSecurityTokenCache$');

    this.requestSecurityTokenCache$.pipe(delay(0)).subscribe((token) => {
      this.receiveSecurityToken?.(token);
    });
  }

  responseFilteredAnnotations(annotations: string) {
    this.options.responseFilteredAnnotations?.(annotations);
  }

  /** Forget the cached value some time after it has been completed. */
  private clearRequestCache(
    key:
      | 'requestDocumentMetadataCache$'
      | 'requestUserPermissionsCache$'
      | 'requestSearchMetadataCache$'
      | 'requestSecurityTokenCache$',
  ) {
    const observable = this[key] as Observable<any>;
    if (!observable) return;

    const clearCache = () => {
      setTimeout(() => {
        if (this[key] === observable) {
          this[key] = undefined;
        }
      }, CACHE_TIME);
    };
    observable.subscribe({
      next: clearCache,
      error: clearCache,
    });
  }
}

const leosJavaScriptExtensionState: LeosJavaScriptExtensionState = {
  callbackNames: [
    'requestDocumentMetadata',
    'requestUserPermissions',
    'requestMergeSuggestion',
    'requestMergeSuggestions',
    'requestSearchMetadata',
    'requestSecurityToken',
    'requestStoredDocumentAnnotations',
    'responseFilteredAnnotations',
  ],
  rpcInterfaces: {
    'eu.europa.ec.leos.ui.shared.js.LeosJavaScriptServerRpc': [
      'clientJSDepsInited',
    ],
  },
  jsDepsInited: true,
  dirtyTimestamp: -1,
};
