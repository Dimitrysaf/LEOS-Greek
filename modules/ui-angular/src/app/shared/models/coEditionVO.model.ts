import { User } from './user.model';

export type INFO_TYPE =
  | 'TOC_INFO'
  | 'DOCUMENT_INFO'
  | 'DOCUMENT_UPDATED'
  | 'ELEMENT_INFO';
export interface CoEditionVO {
  sessionId: string;
  presenterId: string;
  userLoginName: string;
  userName: string;
  entity: string;
  userEmail: string;
  documentId: string;
  elementId: string;
  infoType: INFO_TYPE;
  editionTime: EpochTimeStamp;
}

export interface CoEditionUpdate {
  infoType: INFO_TYPE;
  presenterId: string;
  user: User;
  documentId: string;
  elementId: string;
  elementTagName: string;
  elementFragment: string;
}

export interface CoEditionActionInfo {
  coEditionVos: CoEditionVO[];
  info: CoEditionVO;
  operation: string;
  isSucessful: boolean;
}
