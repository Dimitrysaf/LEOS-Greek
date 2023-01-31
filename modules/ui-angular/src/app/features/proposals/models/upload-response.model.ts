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
