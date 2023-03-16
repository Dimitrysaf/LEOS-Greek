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

export class AnnotateConnector extends AbstractJavaScriptComponent<AnnotateConnectorState> {
  /* set in `modules/js/src/main/js/ui/extension/annotateExtension.js` */
  target?: Element;
  receiveUserPermissions?: (...userPermissions: Permission[]) => void;
  receiveSecurityToken?: (token: string) => void;
  receiveMergeSuggestion?: (result: MergeSuggestion) => void;
  receiveMergeSuggestions?: (...results: MergeSuggestion[]) => void;
  receiveDocumentMetadata?: (metadata: AnnotateMetadata) => void;
  receiveSearchMetadata?: (metadatasets: AnnotateMetadata[]) => void;

  constructor(state: AnnotateConnectorInitialState) {
    super({ ...leosJavaScriptExtensionState, ...state }, null);
  }

  /* defined in `modules/ui/src/main/java/eu/europa/ec/leos/ui/extension/AnnotateExtension.java` */
  requestDocumentMetadata(...args) {
    console.warn('stub:', 'requestDocumentMetadata', args); // FIXME
  }

  /* defined in `modules/ui/src/main/java/eu/europa/ec/leos/ui/extension/AnnotateExtension.java` */
  requestUserPermissions(...args) {
    console.warn('stub:', 'requestUserPermissions', args); // FIXME
    // FIXME: combine permissions from User.roles and Document.proposal.collaborators relationship
    const permissions: Permission[] = [
      'CAN_READ',
      'CAN_UPDATE',
      'CAN_DELETE',
      'CAN_COMMENT',
      'CAN_SUGGEST',
      'CAN_MERGE_SUGGESTION',
      'CAN_MARK_TREATED',
      'CAN_EXPORT_LW',
      'CAN_EXPORT_DW',
      'CAN_CREATE_MILESTONE',
      'CAN_RESTORE_PREVIOUS_VERSION',
      'CAN_ADD_REMOVE_COLLABORATOR',
      'CAN_DOWNLOAD_PROPOSAL',
      'CAN_DOWNLOAD_XML_COMPARISON',
      'CAN_UPLOAD',
      'CAN_SEE_SOURCE',
      'CAN_SEE_ALL_DOCUMENTS',
      'CAN_WORK_WITH_EXPORT_PACKAGE',
      'CAN_CLOSE_PROPOSAL',
    ];
    this.receiveUserPermissions?.(...permissions);
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
