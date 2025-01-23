export type Version = {
  versionType: VersionType; // eg "MAJOR"
  documentId: string; // eg "192"
  cmisVersionNumber: string; // eg "2.0" - cmis:versionLabel
  versionNumber: {
    major: number;
    intermediate: number;
    minor: number;
  };

  updatedDate: string; // eg "18/04/2023 14:49"
  username: string; // eg "jane"
  versionedReference: string; // eg "ANNEX-cla25fbhm0000le22avk9zlps-en_1.0.0"
  subVersions: Version[];
  countSubVersions: number;
  checkinCommentVO: CheckinComment;
  mostRecentVersion: boolean;

  createdBy: string;
  legFileName: string; // to be used for the milestone explorer view
  versionArchived: boolean;
};

export type VersionType = 'MAJOR' | 'INTERMEDIATE' | 'MINOR';

export type CheckinComment = {
  title: string; // leos:milestoneComments
  description: string | null;
  checkinElement: CheckinElement | null;
};

export type CheckinElement = {
  actionType: ActionType;
  elementId: string;
  elementTagName: string;
  elementLabel: string;
  childElements: CheckinElement[];
};

export type ActionType =
  | 'INSERTED'
  | 'UPDATED'
  | 'DELETED'
  | 'SOFTDELETED'
  | 'UNDELETED'
  | 'STRUCTURAL'
  | 'MOVED'
  | 'MORE_CHANGES';
