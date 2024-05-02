export interface Milestone {
  clone?: boolean;
  clonedMilestones?: Milestone[];
  contributionChanged: boolean;
  createdBy: string;
  createdDate: string;
  documentTitle: string;
  legDocumentName: string;
  versionedReference: string;
  legFileId: string;
  proposalRef: string;
  status: MilestoneStatus | string;
  title: string;
  updatedDate: number;
  opened?: boolean;
}

export interface MilestoneViewResponse {
  documents: MilestoneViewItem[];
  pdfRenditionsPresent: boolean;
  annexAddedMap: {[key: string]:any};
  annexDeletedMap: {[key: string]:any};
  annexComparison: {[key: string]:boolean};
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
}

export enum MilestoneStatus {
  Ready = 'FILE_READY',
  ContributionSent = 'CONTRIBUTION_SENT',
  InPreparation = 'IN_PREPARATION',
  Error = 'FILE_ERROR',
  ReadyToMerge = 'READY_TO_MERGE',
}
