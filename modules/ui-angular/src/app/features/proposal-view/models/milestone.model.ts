export interface Milestone {
  clone?: boolean;
  clonedMilestones?: Milestone[];
  contributionChanged: boolean;
  createdBy: string;
  createdDate: string;
  legDocumentName: string;
  proposalRef: string;
  status: string;
  title: string;
  updatedDate: number;
}

export interface MilestoneViewItem {
  /* proposalRef */
  contentFileName: string;
  coverPage: boolean;
  leosCategory: string;
  order: number | null;
  version: string;
  xmlContent: string;
  tocData: string;
  isPdfRenditionsPresent: boolean;
}
