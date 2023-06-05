import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';

export type MathJaxConnectorState = LeosJavaScriptExtensionState & {
  tocItemsJsonArray: string; // json
};

export type MathJaxConnectorInitialState = Omit<
  MathJaxConnectorState,
  keyof LeosJavaScriptExtensionState
>;

export type ActionManagerConnectorOptions = {
  rootElement: HTMLElement;
};

export class MathJaxConnector extends AbstractJavaScriptComponent<MathJaxConnectorState> {
  constructor(
    state: MathJaxConnectorInitialState,
    private options: ActionManagerConnectorOptions,
  ) {
    super({ ...staticExtensionState, ...state }, options.rootElement);
  }
}

const staticExtensionState: LeosJavaScriptExtensionState = {
  callbackNames: [
    // FIXME: add missing callbacks
  ],
  rpcInterfaces: {
    'eu.europa.ec.leos.ui.shared.js.LeosJavaScriptServerRpc': [
      'clientJSDepsInited',
    ],
  },
  jsDepsInited: true,
  dirtyTimestamp: -1,
};
