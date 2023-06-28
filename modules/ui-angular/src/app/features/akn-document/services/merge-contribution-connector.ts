import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';

export type MergeContributionConnectorState = LeosJavaScriptExtensionState;

export type MergeContributionConnectorInitialState = Omit<
  MergeContributionConnectorState,
  keyof LeosJavaScriptExtensionState
>;

export type MergeContributionConnectorOptions = {
  rootElement: HTMLElement;
};

export class MergeContributionConnector extends AbstractJavaScriptComponent<MergeContributionConnectorState> {
  refreshContributions?: (...args: any[]) => void;
  populateMergeActionList?: (...args: any[]) => void;
  populateTocItemList?: (...args: any[]) => void;

  constructor(
    state: MergeContributionConnectorInitialState,
    private options: MergeContributionConnectorOptions,
  ) {
    super({ ...staticExtensionState, ...state }, options.rootElement);
  }
}

const staticExtensionState: LeosJavaScriptExtensionState = {
  callbackNames: [],
  rpcInterfaces: {
    'eu.europa.ec.leos.ui.shared.js.LeosJavaScriptServerRpc': [
      'clientJSDepsInited',
    ],
  },
  jsDepsInited: true,
  dirtyTimestamp: -1,
};
