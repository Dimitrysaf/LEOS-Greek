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
  opened?: boolean;
}

export interface MilestoneViewResponse {
  documents: MilestoneViewItem[];
  pdfRenditionsPresent: boolean;
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
