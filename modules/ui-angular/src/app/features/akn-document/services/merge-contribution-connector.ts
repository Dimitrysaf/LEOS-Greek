import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';
import { DocumentService } from '@/shared/services/document.service';

export type MergeContributionConnectorState = LeosJavaScriptExtensionState & {
  tocItemsJsonArray: string; // json
  isAngularUI?: boolean;
};

export type MergeContributionConnectorInitialState = Omit<
  MergeContributionConnectorState,
  keyof LeosJavaScriptExtensionState
>;

export type MergeContributionConnectorOptions = {
  rootElement: HTMLElement;
};

export class MergeContributionConnector extends AbstractJavaScriptComponent<MergeContributionConnectorState> {
  //functions defined in mergeContributionExtension.js
  refreshContributions?: (...args: any[]) => void;
  populateMergeActionList?: (...args: any[]) => void;
  populateTocItemList?: (...args: any[]) => void;

  constructor(
    state: MergeContributionConnectorInitialState,
    private documentService: DocumentService,
    private options: MergeContributionConnectorOptions,
  ) {
    super(
      { ...staticExtensionState, isAngularUI: true, ...state },
      options.rootElement,
    );
  }
  requestTocItemList() {
    this.populateTocItemList();
  }

  handleContributionSelection(selectionData: { selected: boolean }) {
    this.documentService.handleContributionSelectCount(selectionData.selected);
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
