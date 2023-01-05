import { ProcedureType, Role } from '@leos/shared';

export interface ProposalFilterGroup {
  title: string;
  filterOptions: FilterOption[];
}

export interface FilterOption {
  id: string;
  fieldName: string;
  label: string;
  value: string;
  checked: boolean;
}

export interface ProposalFilter {
  searchTerm?: string;
  procedures?: ProcedureType[];
  acts?: string[];
  templates?: string[];
  roles?: Role[];
}

export const DEFAULT_SEARCH = '';
export const DEFAULT_LIMIT = 40;
export const DEFAULT_PAGE = 0;
export const DEFAULT_SORT_ORDER = false;
