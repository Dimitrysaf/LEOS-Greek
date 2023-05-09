import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';

export type ActionManagerConnectorState = LeosJavaScriptExtensionState & {
  /* set in `ActionManagerExtension.java` */
  instanceType: string; // ec|cn|os
  tocItemsJsonArray: string; // json
};

export type ActionManagerConnectorInitialState = Omit<
  ActionManagerConnectorState,
  keyof LeosJavaScriptExtensionState
>;

export type ActionManagerConnectorOptions = {
  rootElement: HTMLElement;
};

export class ActionManagerConnector extends AbstractJavaScriptComponent<ActionManagerConnectorState> {
  /* set in `actionManagerExtension.js` */
  semaphoreInitEditorOngoing?: boolean;
  editedElementsIdList?: string[]; // DOM ids
  instanceType?: string; // = state.instanceType
  user?: unknown;
  editorChannel?: unknown; // ChannelDefinition
  cancelActionElement?: (elementId: string) => void;

  constructor(
    state: ActionManagerConnectorInitialState,
    private options: ActionManagerConnectorOptions,
  ) {
    super({ ...staticExtensionState, ...state }, options.rootElement);
  }
}

const staticExtensionState: LeosJavaScriptExtensionState = {
  callbackNames: [
    // FIXME: add missing callbacks
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
