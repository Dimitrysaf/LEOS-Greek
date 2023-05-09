import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';

export type RefToLinkConnectorState = LeosJavaScriptExtensionState;

export type RefToLinkConnectorInitialState = Omit<
  RefToLinkConnectorState,
  keyof LeosJavaScriptExtensionState
>;

export type RefToLinkConnectorOptions = {
  rootElement: HTMLElement;
};

export class RefToLinkConnector extends AbstractJavaScriptComponent<RefToLinkConnectorState> {
  constructor(
    state: RefToLinkConnectorInitialState,
    private options: RefToLinkConnectorOptions,
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
