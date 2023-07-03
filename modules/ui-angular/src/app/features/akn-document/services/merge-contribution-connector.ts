import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';
import { MergeActionVO } from '@/shared/models/merge-action-vo.model';
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

  handleMergeAction(mergeActionList: any[]) {
    const mergeActionVOs: MergeActionVO[] | null = null;
    this.documentService.contributions$.subscribe((contributions) => {
      if (contributions.length > 0) {
        for (const contribution of contributions) {
          mergeActionList.forEach((item) => {
            if (
              item.elementId ===
              contribution.checkinCommentVO.checkinElement.elementId
            ) {
              const tmp = {
                action: item.action,
                elementState: item.elementState,
                elementId: item.elementId,
                elementTagName: item.elementTagName,
                contributionVO: contribution,
              };
              mergeActionVOs.push(tmp);
            }
          });
        }
      }
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
