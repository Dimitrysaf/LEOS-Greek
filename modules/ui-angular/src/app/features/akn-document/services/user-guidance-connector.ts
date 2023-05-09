import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';

export type UserGuidanceConnectorState = LeosJavaScriptExtensionState;

export type UserGuidanceConnectorInitialState = Omit<
  UserGuidanceConnectorState,
  keyof LeosJavaScriptExtensionState
>;

export type UserGuidanceConnectorOptions = {
  rootElement: HTMLElement;
};

export class UserGuidanceConnector extends AbstractJavaScriptComponent<UserGuidanceConnectorState> {
  enableUserGuidance?: (...args: any[]) => void;
  receiveUserGuidance?: (...args: any[]) => void;

  constructor(
    state: UserGuidanceConnectorInitialState,
    private options: UserGuidanceConnectorOptions,
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
