import { CheckinComment } from '@/features/akn-document/models';
import { Collaborator } from '@/shared';

export interface ContributionVO {
  documentId: string;
  versionNumber: { major: number; intermediate: number; minor: number };
  updatedDate: number;
  versionedReference: string;
  checkinCommentVO: CheckinComment;
  contributionCreator: string;
  contributionStatus: string;
  collaborators: Collaborator[];
  xmlContent: string;
  legFileName: string;
  documentName: string;
  username: string;
  selected?: boolean;
}
