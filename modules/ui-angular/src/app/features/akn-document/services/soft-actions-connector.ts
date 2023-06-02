import { take, takeUntil } from 'rxjs';

import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';
import { DocumentService } from '@/shared/services/document.service';

export type SoftActionsConnectorState = LeosJavaScriptExtensionState;

export type SoftActionsConnectorInitialState = Omit<
  SoftActionsConnectorState,
  keyof LeosJavaScriptExtensionState
>;

export type SoftActionsConnectorOptions = {
  rootElement: HTMLElement;
};

export class SoftActionsConnector extends AbstractJavaScriptComponent<SoftActionsConnectorState> {
  constructor(
    state: SoftActionsConnectorInitialState,
    private options: SoftActionsConnectorOptions,
    private documentService: DocumentService,
  ) {
    super({ ...staticExtensionState, ...state }, options.rootElement);
    this.documentService.documentView$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.$triggerStateChange();
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
