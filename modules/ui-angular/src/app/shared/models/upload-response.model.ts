import { Document } from '@/shared';

export interface UploadProposalResposne {
  proposalId: string;
  billId: string;
  proposalUrl: string;
  billUrl: string;
  memorandumUrl: string;
  memorandumId: string;
  coverpageUrl: string;
  coverpageId: string;
  annexIdUrl: Map<string, string>;
  docCloneAndOriginIdMap: Map<any, any>;
  collectionCreated: true;
  error: null;
}

export interface LegFileValidationResponse {
  documentToBeCreated: Document;
  errors: ErrorVO[];
}

export interface ErrorVO {
  errorCode: string;
  objects: string[];
}

export interface ExceptionResponseVO {
  errorCode: string;
  messageKey: string;
}

export interface PendingTranslationException extends ExceptionResponseVO {
  pendingLanguages: string;
}

export interface DuplicateTemplateException extends ExceptionResponseVO {
  duplicatedDgs: string;
}

export enum ErrorCode {
  CM001 = "CM001",
  CA001 = "CA001",
  PT001 = "PT001",
  OLV001 = "OLV001",
  CT001 = "CT001"
}
