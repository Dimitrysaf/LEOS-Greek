import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';
import { ContributionVO } from '@/shared/models/contribution-vo.model';
import {
  MergeActionItem,
  MergeActionVO,
} from '@/shared/models/merge-action-vo.model';
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
  populateMergeActionList?: (selectAll: boolean) => void;
  populateTocItemList?: (...args: any[]) => void;

  private acceptAllContributions: boolean;
  private contribution: ContributionVO;

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

  handleMergeAction(mergeActionList: MergeActionItem[]) {
    const mergeActionVOs: MergeActionVO[] = [];
    mergeActionList.forEach((item) => {
      const tmp = {
        action: item.action.toUpperCase(),
        elementState: item.elementState.toUpperCase(),
        elementId: item.elementId.replaceAll('revision-', ''),
        elementTagName: item.elementTagName,
        contributionVO: this.contribution,
      };
      mergeActionVOs.push(tmp);
    });

    if (mergeActionVOs) {
      this.documentService.mergeContributions(
        mergeActionVOs,
        this.acceptAllContributions,
      );
    }
  }

  handleContributionSelection(selectionData: { selected: boolean }) {
    this.documentService.handleContributionSelectCount(selectionData.selected);
  }

  setAcceptAllContributions(acceptAllContributions: boolean) {
    this.acceptAllContributions = acceptAllContributions;
  }

  setContributionToMerge(contribution: ContributionVO) {
    this.contribution = contribution;
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
