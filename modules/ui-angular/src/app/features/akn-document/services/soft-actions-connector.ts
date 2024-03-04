import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';

export type SoftActionsConnectorState = LeosJavaScriptExtensionState;

export type SoftActionsConnectorInitialState = Omit<
  SoftActionsConnectorState,
  keyof LeosJavaScriptExtensionState
>;

export type SoftActionsConnectorOptions = {
  rootElement: HTMLElement;
};

export class SoftActionsConnector extends AbstractJavaScriptComponent<SoftActionsConnectorState> {
  public otherTargets: string[];

  constructor(
    state: SoftActionsConnectorInitialState,
    otherTargets: string[],
    private options: SoftActionsConnectorOptions,
  ) {
    super({ ...staticExtensionState, ...state }, options.rootElement);
    this.otherTargets = otherTargets;
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
