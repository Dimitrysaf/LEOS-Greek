import { TableOfContentItemVO } from './toc.model';

export interface NodeValidationResponse {
  result: NodeValidation;
}

export interface NodeValidation {
  success: boolean;
  warning: boolean;
  messageKey: string;
  warningMessageKeys: string[]
  sourceItem: TableOfContentItemVO;
  targetItem: TableOfContentItemVO;
  action: NodeMoveAction;
}

export interface NodeMoveAction {
  position: string;
  isAdd: boolean;
}
