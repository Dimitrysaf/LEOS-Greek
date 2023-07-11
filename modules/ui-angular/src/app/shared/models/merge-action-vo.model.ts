import { ContributionVO } from './contribution-vo.model';

export interface MergeActionItem {
  action: string;
  elementState: string;
  elementId: string;
  elementTagName: string;
}

export interface MergeActionVO extends MergeActionItem {
  contributionVO: ContributionVO;
}
