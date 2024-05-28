import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';
import {DocumentService} from "@/shared/services/document.service";

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
    private documentService : DocumentService,
  ) {
    super({ ...staticExtensionState, ...state }, options.rootElement);
  }

  requestUserGuidance() {
    this.documentService.requestUserGuidance().subscribe((userGuidance) => {
      if (userGuidance && this.receiveUserGuidance) {
        this.receiveUserGuidance(
          JSON.stringify(userGuidance),
        );
      }
    });
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
