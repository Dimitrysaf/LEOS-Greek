import { of, take, takeUntil } from 'rxjs';

import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';
import type {
  AnnotateConnectorState,
  AnnotateMetadata,
  MergeSuggestion,
  Permission,
} from '@/shared';
import { AnnotateService } from '@/shared/services/annotate.service';

export type AnnotateConnectorInitialState = Omit<
  AnnotateConnectorState,
  keyof LeosJavaScriptExtensionState
>;
export type AnnotateConnectorOptions = {
  permissions: Permission[];
};

export class AnnotateConnector extends AbstractJavaScriptComponent<AnnotateConnectorState> {
  /* set in `modules/js/src/main/js/ui/extension/annotateExtension.js` */
  target?: Element;
  receiveUserPermissions?: (...userPermissions: Permission[]) => void;
  receiveSecurityToken?: (token: string) => void;
  receiveMergeSuggestion?: (result: MergeSuggestion) => void;
  receiveMergeSuggestions?: (...results: MergeSuggestion[]) => void;
  receiveDocumentMetadata?: (metadata: string) => void;
  receiveSearchMetadata?: (metadatasets: AnnotateMetadata[]) => void;

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

  /* defined in `modules/ui/src/main/java/eu/europa/ec/leos/ui/extension/AnnotateExtension.java` */
  requestMergeSuggestion(...args) {
    console.warn('stub:', 'requestMergeSuggestion', args); // FIXME
    // this.receiveMergeSuggestion?.(/*...*/);
  }

  /* defined in `modules/ui/src/main/java/eu/europa/ec/leos/ui/extension/AnnotateExtension.java` */
  requestMergeSuggestions(...args) {
    console.warn('stub:', 'requestMergeSuggestions', args); // FIXME
    // this.receiveMergeSuggestions?.(/*...*/);
  }

  /* defined in `modules/ui/src/main/java/eu/europa/ec/leos/ui/extension/AnnotateExtension.java` */
  requestSearchMetadata(...args) {
    console.warn('stub:', 'requestSearchMetadata', args); // FIXME
    // this.receiveSearchMetadata?.(/*...*/);
  }

  requestSecurityToken() {
    this.annotateService
      .getSecurityAnnotateToken()
      .pipe(take(1))
      .subscribe((token) => {
        this.receiveSecurityToken?.(token as string);
      });
  }

  /* defined in `modules/ui/src/main/java/eu/europa/ec/leos/ui/extension/AnnotateExtension.java` */
  responseFilteredAnnotations(...args) {
    console.warn('stub:', 'responseFilteredAnnotations', args); // FIXME
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
