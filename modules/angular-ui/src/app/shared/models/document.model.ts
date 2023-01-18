/** AKA `DocumentVO` in Java code */
import { DocumentRole } from '@/shared';

export interface Document {
  id: string;
  title: string;
  createdBy: string; // Username
  createdOn: number; // TimestampMs
  updatedBy: string; // Username
  updatedOn: number; // TimestampMs
  language: string; // LanguageCode - eg "EN"
  template: string; // TemplateKey
  docNumber: number;
  source: unknown | null; // FIXME: docs say `byte[]`
  uploaded: boolean;
  versionSeriesId: string | null;
  ref: string | null;
  documentType: string;
  procedureType: ProcedureType | null;
  actType: ActType | null;
  childDocuments: Document[];
  collaborators: Collaborator[];
  metadata: Metadata;
  name: string | null;
  metadataDocument: LeosMetadata | null;
  cloneProposalMetadataVO: ClonedProposalMetadata | null;
  category: DocumentType; //??
}

/** AKA `MetadataVO` in Java code */
export interface Metadata {
  docStage: string | null;
  docType: string | null;
  docPurpose: string | null;
  packageTitle: string | null;
  internalRef: string | null;
  securityLevel: SecurityLevel;
  language: string | null; // LanguageCode
  eeaRelevance: boolean;
  templateName: string | null;
  template: string | null;
  docTemplate: string | null;
  title: string | null;
  index: string | null;
  number: string | null;
}

export interface LeosMetadata {
  category: DocumentType;
  stage: string;
  type: string;
  purpose: string;
  template: string;
  language: string;
  docTemplate: string;
  ref: string;
  objectId: string;
  docVersion: string;
  eeaRelevance: boolean;
}

/** AKA `CloneProposalMetadataVO` in Java code */
export interface ClonedProposalMetadata {
  legFileName: string;
  targetUser: string; // Username??
  creationDate: number; // TimestampMs??
  revisionStatus: string;
  clonedProposal: boolean;
  clonedFromRef: string;
  clonedFromObjectId: string;
  originRef: string;
  cloneProposalRef: string;
}

/** AKA `LeosCategory` in Java code */
export type DocumentType =
  | 'PROPOSAL'
  | 'MEMORANDUM'
  | 'BILL'
  | 'ANNEX'
  | 'COUNCIL_EXPLANATORY'
  | 'MEDIA'
  | 'CONFIG'
  | 'LEG'
  | 'STRUCTURE'
  | 'EXPORT'
  | 'COVERPAGE';

export type ProcedureType =
  | 'ORDINARY_LEGISLATIVE_PROC'
  | 'AUTONOMOUS_ACT'
  | 'OTHER_ACT'
  | 'STAFF_WORKING_DOCUMENT';

export type ActType = 'REGULATION' | 'DIRECTIVE' | 'DECISION';

export interface Collaborator {
  id: string;
  name?: string;
  login: string;
  entity: string;
  role: DocumentRole;
}

export type SecurityLevel = 'STANDARD' | 'SENSITIVE';
