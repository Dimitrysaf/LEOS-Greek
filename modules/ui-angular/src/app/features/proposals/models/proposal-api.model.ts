import { Document, ProcedureType, Role } from '@leos/shared';

import { CatalogItem } from './catalog.model';

export type ListProposalsWithFilterBody = {
  startIndex?: number;
  limit?: number;
  sortOrder?: boolean;
  filters: ListProposalsWithFilterBodyFilter[];
};

export type ListProposalsWithFilterBodyFilter =
  | { type: 'procedureType'; value: ProcedureType[] }
  | { type: 'template'; value: string[] }
  | { type: 'role'; value: Role[] }
  | { type: 'docType'; value: string[] }
  | { type: 'title'; value: string[] };

export interface ListProposalsWithFilterResponse {
  proposals: Document[];
  proposalCount: number;
}

export type GetTemplatesResponse = CatalogItem[];

export type CreateProposalBody = {
  templateId: string;
  templateName: string;
  langCode: string;
  docPurpose: string;
  eeaRelevance: boolean;
};

export interface CreateDrafProposaltBody {
  templateId: string;
  docPurpose: string;
  eeaRelevance: boolean;
}

export interface CreateDraftBody {
  proposalRef: string;
  template: string;
}
export interface CreateDraftResponse {
  proposalId: string;
}
export type CreateProposalResponse = {
  proposalId: string;
  billId: string | null;
  proposalUrl: string | null;
  billUrl: string | null;
  memorandumUrl: string | null;
  memorandumId: string | null;
  coverpageUrl: string | null;
  coverpageId: string | null;
  annexIdUrl: unknown; // Add correct type??
  docCloneAndOriginIdMap: unknown; // Add correct type??
  collectionCreated: boolean;
  error: null;
};
