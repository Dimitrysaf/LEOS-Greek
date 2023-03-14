import { TableOfContentItemVO } from './toc.model';

export interface NodeValidationResponse {
  result: NodeValidation;
}
export interface NodeValidation {
  success: boolean;
  messageKey: string;
  sourceItem: TableOfContentItemVO;
  targetItem: TableOfContentItemVO;
}
