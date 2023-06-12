import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';

export type TrackChangesConnectorState = LeosJavaScriptExtensionState & {
  //no connector specific state
  isTrackChangesShowed: boolean;
};

export type TrackChangesConnectorInitialState = Omit<
  TrackChangesConnectorState,
  keyof LeosJavaScriptExtensionState
>;

export type TrackChangesConnectorOptions = {
  rootElement: HTMLElement;
};

export class TrackChangesConnector extends AbstractJavaScriptComponent<TrackChangesConnectorState> {
  constructor(
    state: TrackChangesConnectorInitialState,
    private options: TrackChangesConnectorOptions,
  ) {
    super(
      { ...staticExtensionState, isTrackChangesShowed: true, ...state },
      options.rootElement,
    );
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
