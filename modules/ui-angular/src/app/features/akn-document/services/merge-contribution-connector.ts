/* eslint-disable simple-import-sort/imports */
import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';
import { Permission } from '@/shared';
import { MergeActionVO } from '@/shared/models/merge-action-vo.model';
import { DocumentService } from '@/shared/services/document.service';
import {
  ACTION_DONE_CLASS,
  ContributionActionAttrValue,
  ID,
  LEOS_SOFT_ACTION,
  LEOS_SOFT_ACTION_MOVE_FROM,
  LEOS_SOFT_ACTION_MOVE_TO, MERGE_ACTION_ATTR,
  MERGE_CONTRIBUTION,
  MOVE_FROM_ATTR,
  MOVE_PREFIX,
  REVISION_PREFIX,
  SELECTED_ACTION_ATTR,
} from "@/shared/constants/fork-merge.constants";
import {Inject} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {SOFT_MOVE_PLACEHOLDER_ID_PREFIX} from "@/shared/constants";
import {MergeContributionsService} from "@/features/akn-document/services/merge-contributions.service";

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

  constructor(
    state: MergeContributionConnectorInitialState,
    private documentService: DocumentService,
    private options: MergeContributionConnectorOptions,
    private mergeContributionsService: MergeContributionsService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    super(
      { ...staticExtensionState, isAngularUI: true, ...state },
      options.rootElement,
    );
  }

  doUpdateMergeActionList(action : {action: MergeActionVO, select: boolean}) {
    if (action && this.updateMergeActionList) {
      this.updateMergeActionList(action);
      this.mergeContributionsService.handleContributionSelectCount(action.select);
    }
  }

  acceptAndMergeAllChanges(withTrackChanges: boolean) {
    let elementsToBeMerged = this.document.querySelectorAll('.' + MERGE_CONTRIBUTION);
    let selectedElements: Element[] = Array.from(elementsToBeMerged);
    selectedElements.forEach( (e, index) => {
      let elt = e as HTMLElement;
      if (!elt.hasAttribute(MERGE_ACTION_ATTR) && !elt.classList.contains(ACTION_DONE_CLASS)) {
        const softAction = elt.getAttribute(LEOS_SOFT_ACTION);
        if (softAction && softAction === MOVE_FROM_ATTR) {
          selectedElements = selectedElements.filter( (s) => s.getAttribute(ID) !== REVISION_PREFIX + SOFT_MOVE_PLACEHOLDER_ID_PREFIX + elt.getAttribute(ID).replace(REVISION_PREFIX, ""));
        }
        const children = this.mergeContributionsService.getImpactedElements(elt);
        children.forEach((c) => {
          let child = c as HTMLElement;
          selectedElements = selectedElements.filter( (s) => s.getAttribute(ID) !== child.getAttribute(ID));
        });
      } else {
        selectedElements.splice(index, 1);
      }
    });
    selectedElements.forEach((s) => {
      let elt = s as HTMLElement;
      this.mergeContributionsService.manageSelectedElements(elt, ContributionActionAttrValue.ACCEPT);
      const action: MergeActionVO = {action: "", contributionVO: undefined, elementId: "", elementState: "", elementTagName: "", withTrackChanges: false};
      action.elementId = elt.getAttribute(ID).replace(REVISION_PREFIX, '');
      action.elementState = this.mergeContributionsService.getAction(elt);
      if (withTrackChanges) {
        action.action = ContributionActionAttrValue.ACCEPT_TC;
      } else {
        action.action = ContributionActionAttrValue.ACCEPT;
      }
      action.withTrackChanges = withTrackChanges;
      action.elementTagName = elt.tagName.toLowerCase();
      action.contributionVO = this.mergeContributionsService.getCurrentContribution();

      this.mergeContributionsService.addMergeActionList(action);
      this.doUpdateMergeActionList({action: action, select: true});
    });
    this.handleMergeAction();
  }

  requestTocItemList() {
    this.populateTocItemList();
  }

  undo(event: MouseEvent, element: HTMLElement, actions: HTMLElement) {
    if (element.hasAttribute(MERGE_ACTION_ATTR) && !element.hasAttribute(SELECTED_ACTION_ATTR)) {
      element.setAttribute(SELECTED_ACTION_ATTR, ContributionActionAttrValue.UNDO);
      const list = this.mergeContributionsService.getImpactedElementsForUndo(element);
      list.forEach(e => {
        let elt =  e as HTMLElement;
        elt.setAttribute(SELECTED_ACTION_ATTR, ContributionActionAttrValue.UNDO);
      });
      if (element.hasAttribute(LEOS_SOFT_ACTION_MOVE_TO)) {
        const movedFromElement = this.document.getElementById(element.getAttribute(ID).replace(MOVE_PREFIX,''));
        if (movedFromElement) {
          movedFromElement.removeAttribute(SELECTED_ACTION_ATTR);
          const list = this.mergeContributionsService.getImpactedElementsForUndo(movedFromElement);
          list.forEach(e => {
            let elt =  e as HTMLElement;
            elt.setAttribute(SELECTED_ACTION_ATTR, ContributionActionAttrValue.UNDO);
          });
        }
      } else if (element.hasAttribute(LEOS_SOFT_ACTION_MOVE_FROM)) {
        const movedToElement = this.document.getElementById(REVISION_PREFIX + MOVE_PREFIX + element.getAttribute(ID).replace(REVISION_PREFIX,''));
        if (movedToElement) {
          movedToElement.setAttribute(SELECTED_ACTION_ATTR, ContributionActionAttrValue.UNDO);
        }
      }
      this.mergeContributionsService.undo(element, this.mergeContributionsService.getCurrentContribution());
    } else {
      if (element.hasAttribute(LEOS_SOFT_ACTION_MOVE_TO)) {
        const movedFromElement = this.document.getElementById(element.getAttribute(ID).replace(MOVE_PREFIX,''));
        if (movedFromElement) {
          movedFromElement.removeAttribute(SELECTED_ACTION_ATTR);
          const list = this.mergeContributionsService.getImpactedElements(movedFromElement);
          list.forEach(e => {
            let elt =  e as HTMLElement;
            elt.removeAttribute(SELECTED_ACTION_ATTR);
          });
        }
      } else if (element.hasAttribute(LEOS_SOFT_ACTION_MOVE_FROM)) {
        const movedToElement = this.document.getElementById(REVISION_PREFIX + MOVE_PREFIX + element.getAttribute(ID).replace(REVISION_PREFIX,''));
        if (movedToElement) {
          movedToElement.removeAttribute(SELECTED_ACTION_ATTR);
        }
      }

      element.removeAttribute(SELECTED_ACTION_ATTR);
      const removedAction: MergeActionVO = this.mergeContributionsService.removeMergeActionList(element);
      this.doUpdateMergeActionList({action: removedAction, select: false});

      const list = this.mergeContributionsService.getImpactedElements(element);
      list.forEach(e => {
        let elt =  e as HTMLElement;
        elt.removeAttribute(SELECTED_ACTION_ATTR);
        const removedAction: MergeActionVO = this.mergeContributionsService.removeMergeActionList(elt);
        this.doUpdateMergeActionList({action: removedAction, select: false});
      });
    }
  }

  showActionMenu(
    event: MouseEvent,
    element: HTMLElement,
    actions: HTMLElement,
  ) {
    this.mergeContributionsService.showMenu(event, element, actions);
  }

  handleMergeAction() {
    const mergeActionVOs: MergeActionVO[] = [];
    const mergeActionList = this.mergeContributionsService.getMergeActionList();
    mergeActionList.forEach((item) => {
      const tmp = {
        action: item.action.toUpperCase(),
        elementState: item.elementState.toUpperCase(),
        elementId: item.elementId,
        elementTagName: item.elementTagName,
        withTrackChanges: item.withTrackChanges,
        contributionVO: this.mergeContributionsService.getCurrentContribution(),
      };
      mergeActionVOs.push(tmp);
    });

    if (mergeActionVOs) {
       this.mergeContributionsService.mergeContributions(
         mergeActionVOs,
         this.acceptAllContributions,
       );
    }
  }

  handleContributionSelection(selectionData: { selected: boolean }) {
    this.mergeContributionsService.handleContributionSelectCount(
      selectionData.selected,
    );
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
