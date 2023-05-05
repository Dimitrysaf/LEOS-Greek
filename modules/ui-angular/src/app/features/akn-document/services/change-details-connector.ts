import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';

export type ChangeDetailsConnectorState = LeosJavaScriptExtensionState;

export type ChangeDetailsConnectorInitialState = Omit<
  ChangeDetailsConnectorState,
  keyof LeosJavaScriptExtensionState
>;

export type ChangeDetailsConnectorOptions = {
  rootElement: HTMLElement;
};

export class ChangeDetailsConnector extends AbstractJavaScriptComponent<ChangeDetailsConnectorState> {
  constructor(
    state: ChangeDetailsConnectorInitialState,
    private options: ChangeDetailsConnectorOptions,
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
