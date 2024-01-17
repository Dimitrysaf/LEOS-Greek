import { ContributionVO } from './contribution-vo.model';

export interface MergeActionItem {
  action: string;
  elementState: string;
  elementId: string;
  elementTagName: string;
  withTrackChanges: boolean;
}

export interface MergeActionVO extends MergeActionItem {
  contributionVO: ContributionVO;
}

export enum ContributionActionAttrValue {
  ACCEPT = "ACCEPT",
  ACCEPT_TC = "ACCEPT_TC",
  PROCESSED = "PROCESSED",
}

let CONTRIBUTION_SELECTED = "selected-contribution-wrapper";
let MERGE_CONTRIBUTION = "merge-contribution-wrapper";
let MERGE_ACTION_ATTR = "leos:mergeAction"
export {CONTRIBUTION_SELECTED, MERGE_CONTRIBUTION,  MERGE_ACTION_ATTR};
