import { of } from 'rxjs';

import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';
import type {
  AnnotateConnectorState,
  AnnotateMetadata,
  MergeSuggestion,
  Permission,
} from '@/shared';

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
  receiveDocumentMetadata?: (metadata: AnnotateMetadata) => void;
  receiveSearchMetadata?: (metadatasets: AnnotateMetadata[]) => void;

  constructor(
    state: AnnotateConnectorInitialState,
    private options: AnnotateConnectorOptions,
  ) {
    super({ ...leosJavaScriptExtensionState, ...state }, null);
  }

  /* defined in `modules/ui/src/main/java/eu/europa/ec/leos/ui/extension/AnnotateExtension.java` */
  requestDocumentMetadata(...args) {
    console.warn('stub:', 'requestDocumentMetadata', args); // FIXME
  }

  /* defined in `modules/ui/src/main/java/eu/europa/ec/leos/ui/extension/AnnotateExtension.java` */
  requestUserPermissions(...args) {
    //the legacy file defaults behaviour is to first hide the suggestBtn and then after we have received the permissions from the request we check to display the btn
    //for now we will emulate this "request being set" with timeout, and once we have the the requested api we will replace it
    setTimeout(() => {
      this.receiveUserPermissions?.(...this.options.permissions);
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

  /* defined in `modules/ui/src/main/java/eu/europa/ec/leos/ui/extension/AnnotateExtension.java` */
  requestSecurityToken() {
    console.warn('stub:', 'requestSecurityToken'); // FIXME
    this.fetchSecurityToken().subscribe((token) => {
      this.receiveSecurityToken?.(token);
    });
  }

  /* defined in `modules/ui/src/main/java/eu/europa/ec/leos/ui/extension/AnnotateExtension.java` */
  responseFilteredAnnotations(...args) {
    console.warn('stub:', 'responseFilteredAnnotations', args); // FIXME
  }

  private fetchSecurityToken() {
    // TODO: fetch from server API - eg `/api/secured/annotate/token`
    const token = localStorage.getItem('DEBUG_annotateToken');
    if (!token && !window['_annotateTokenErrorLogged']) {
      window['_annotateTokenErrorLogged'] = true;
      console.error(
        'Expected to find DEBUG_annotateToken in localStorage.\n' +
          'To obtain it, open a document page on :8080 server and search for a request to `...ui/UIDL/`' +
          ' containing "receiveSecurityToken" in its response.\n' +
          'Then set it with localStorage.setItem("DEBUG_annotateToken", "<TOKEN>")',
      );
    }
    return of(token);
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
