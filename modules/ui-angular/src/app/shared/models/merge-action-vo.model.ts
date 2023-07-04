import { ContributionVO } from './contribution-vo.model';

enum MergeAction {
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
  UNDO = 'UNDO',
}

enum ElementState {
  ADD = 'ADD',
  DELETE = 'DELETE',
  MOVE = 'MOVE',
  CONTENT_CHANGE = 'CONTENT_CHANGE',
}

export interface MergeActionItem {
  action: MergeAction;
  elementState: ElementState;
  elementId: string;
  elementTagName: string;
}

export interface MergeActionVO extends MergeActionItem {
  contributionVO: ContributionVO;
}
