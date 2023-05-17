/** AKA `DocumentVO` in Java code */
import { DocumentRole } from '@/shared';

import { TocItem } from './toc.model';

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
//used in proposal.metadata
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
//used in document-config.documentsmetadata
export interface DocumentsMetadata {
  category: string;
  clonedRef: null;
  docTemplate: string;
  docVersion: string;
  eeaRelevance: boolean;
  index: number;
  language: string;
  number: string;
  objectId: null;
  purpose: string;
  ref: string;
  stage: string;
  template: string;
  title: string;
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

export interface DocumentConfig {
  articleTypesConfig: ArticleType;
  documentsMetadata: DocumentsMetadata[];
  internalRef: string;
  listNumberConfigJsonArray: any;
  numberingConfig: NumberingConfig[];
  tocItems: TocItem[];
  proposalMetadata: LeosMetadata;
  alternateConfigs: AlternateConfig;
  levelItemVO: LevelItemVO;
  tocRules: Map<TocItem, TocItem[]>;
}

export interface LevelItemVO {
  id: string;
  levelNum: string;
  number: string;
  origin: string;
}

export interface AlternateConfig {
  profile: string;
  type: string;
}

export interface ArticleType {
  DEFINITION: ArticleTypeConfig;
  REGULAR: ArticleTypeConfig;
}

export interface ArticleTypeConfig {
  attributeName: string;
  attributeValue: string;
}

export interface NumberingConfig {
  description: string;
  level: Level;
  levels: Levels;
  msgValidationError: string;
  numbered: true;
  prefix: '';
  regex: string;
  sequence: string;
  suffix: string;
  type: NumberingType;
}
export interface Levels {
  levels: Level[];
}
export interface Level {
  depth: string;
  numberingType: NumberingType;
}

export type NumberingType =
  | 'NONE'
  | 'ARABIC'
  | 'ARABIC_POSTFIXDOT'
  | 'ARABIC_PARENTHESIS'
  | 'ALPHA_LOWER_PARENTHESIS'
  | 'ROMAN_LOWER_PARENTHESIS'
  | 'ROMAN_UPPER'
  | 'BULLET_BLACK_CIRCLE'
  | 'BULLET_WHITE_CIRCLE'
  | 'BULLET_BLACK_SQUARE'
  | 'BULLET_WHITE_SQUARE'
  | 'BULLET_NUM'
  | 'INDENT'
  | 'HIGHER_ELEMENT_NUM'
  | 'POINT_NUM'
  | 'POINT_NUM_DEF'
  | 'LEVEL_NUM'
  | 'DIVISION_NUM'
  | 'ROMAN_UPPER_POSTFIXDOT'
  | 'ROMAN_UPPER_POSTFIXPARENTHESIS'
  | 'ALPHA_UPPER_POSTFIXDOT'
  | 'ALPHA_UPPER_POSTFIXPARENTHESIS';

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
  entity: Entity;
  role: DocumentRole;
}

export interface Entity {
  id: string;
  name: string;
  organizationName: string;
}

export interface CollaboratorRequest {
  userId: string;
  roleName: string;
  connectedDG: string;
}

export interface CollaboratorsBulkRequest {
  collaborators: CollaboratorRequest[];
}

export type SecurityLevel = 'STANDARD' | 'SENSITIVE';
