import { distinctUntilChanged, take } from 'rxjs';

import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';
import type {
  AnnotateConnectorState,
  AnnotateMetadata,
  MergeSuggestionRequest,
  Permission,
} from '@/shared';
import { AnnotateService } from '@/shared/services/annotate.service';

export type AnnotateConnectorInitialState = Omit<
  AnnotateConnectorState,
  keyof LeosJavaScriptExtensionState
>;
export type AnnotateConnectorOptions = {
  permissions: Permission[];
  responseFilteredAnnotations?: (annotations: string) => void;
};

export class AnnotateConnector extends AbstractJavaScriptComponent<AnnotateConnectorState> {
  /* set in `modules/js/src/main/js/ui/extension/annotateExtension.js` */
  target?: Element;
  receiveUserPermissions?: (...userPermissions: Permission[]) => void;
  receiveSecurityToken?: (token: string) => void;
  receiveMergeSuggestion?: (result) => void;
  receiveMergeSuggestions?: (...results) => void;
  receiveDocumentMetadata?: (metadata: string) => void;
  receiveSearchMetadata?: (metadatasets: string) => void;
  requestFilteredAnnotations?: () => void;

  constructor(
    state: AnnotateConnectorInitialState,
    private options: AnnotateConnectorOptions,
    private annotateService: AnnotateService,
  ) {
    super({ ...leosJavaScriptExtensionState, ...state }, null);
  }

  requestDocumentMetadata(...args) {
    this.annotateService
      .getDocumentsMetadata()
      .pipe(take(1))
      .subscribe((metadata) => {
        this.receiveDocumentMetadata(JSON.stringify(metadata));
      });
  }

  requestUserPermissions(...args) {
    this.annotateService.getUserPermissions().subscribe((perms) => {
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
      .pipe(take(1))
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
      .pipe(take(1))
      .subscribe((res) => {
        this.receiveMergeSuggestions(...res);
      });
  }

  requestSearchMetadata() {
    this.annotateService
      .fetchSearchMetada()
      .pipe(take(1), distinctUntilChanged())
      .subscribe((res) => {
        this.receiveSearchMetadata(JSON.stringify([{ status: res[0].status }]));
      });
  }

  requestSecurityToken() {
    this.annotateService
      .getSecurityAnnotateToken()
      .pipe(take(1))
      .subscribe((token) => {
        this.receiveSecurityToken?.(token as string);
      });
  }

  responseFilteredAnnotations(annotations: string) {
    this.options.responseFilteredAnnotations?.(annotations);
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
