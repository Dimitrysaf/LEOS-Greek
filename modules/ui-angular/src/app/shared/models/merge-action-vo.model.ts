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
