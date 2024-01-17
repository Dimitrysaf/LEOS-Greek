import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';
import { Permission } from '@/shared';
import { ContributionVO } from '@/shared/models/contribution-vo.model';
import {
  CONTRIBUTION_SELECTED, ContributionActionAttrValue, MERGE_ACTION_ATTR,
  MergeActionItem,
  MergeActionVO,
} from '@/shared/models/merge-action-vo.model';
import { DocumentService } from '@/shared/services/document.service';
import {MergeActionsService} from "@/features/akn-document/services/merge-actions.service";

export type MergeContributionConnectorState = LeosJavaScriptExtensionState & {
  tocItemsJsonArray: string; // json
  isAngularUI?: boolean;
  permissions: Permission[];
  canAccept: boolean;
  canReject: boolean;
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
  updateMergeActionList?: (...args: any[]) => void;

  private acceptAllContributions: boolean;
  private contribution: ContributionVO;

  constructor(
    state: MergeContributionConnectorInitialState,
    private documentService: DocumentService,
    private options: MergeContributionConnectorOptions,
    private mergeActionsService: MergeActionsService,
  ) {
    super(
      { ...staticExtensionState, isAngularUI: true, ...state },
      options.rootElement,
    );
    this.mergeActionsService.updateMergeActionList$.subscribe((action) => {
      this.updateMergeActionList(action);
    });
  }
  requestTocItemList() {
    this.populateTocItemList();
  }

  undo(event: MouseEvent, element: HTMLElement, actions: HTMLElement) {
    element.classList.remove(CONTRIBUTION_SELECTED);
    element.removeAttribute(MERGE_ACTION_ATTR);
    this.mergeActionsService.removeMergeActionList(element);
  }

  showActionMenu(event: MouseEvent, element: HTMLElement, actions: HTMLElement) {
    this.mergeActionsService.showMenu(event, element, actions);
  }

  handleMergeAction(mergeActionList: MergeActionItem[]) {
    const mergeActionVOs: MergeActionVO[] = [];
    mergeActionList.forEach((item) => {
      const tmp = {
        action: item.action.toUpperCase(),
        elementState: item.elementState.toUpperCase(),
        elementId: item.elementId.replaceAll('revision-', ''),
        elementTagName: item.elementTagName,
        withTrackChanges: item.withTrackChanges,
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
