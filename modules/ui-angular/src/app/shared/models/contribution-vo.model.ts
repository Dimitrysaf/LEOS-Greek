import { CheckinComment } from '@/features/akn-document/models';
import { Collaborator } from '@/shared';

export interface ContributionVO {
  documentId: string;
  versionNumber: {intermediate: string, major: number, minor: number};
  updatedDate: number;
  versionedReference: string;
  checkinCommentVO: CheckinComment;
  contributionCreator: string;
  contributionStatus: string;
  collaborators: Collaborator[];
  xmlContent: any;
  legFileName: string;
  documentName: string;
}
