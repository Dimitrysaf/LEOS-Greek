export type ApplicationRole = 'USER' | 'SUPPORT' | 'ADMIN';

export type DocumentRole = 'OWNER' | 'CONTRIBUTOR' | 'REVIEWER';

export type Role = ApplicationRole | DocumentRole;

export type Permission =
  | 'CAN_READ'
  | 'CAN_UPDATE'
  | 'CAN_DELETE'
  | 'CAN_COMMENT'
  | 'CAN_SUGGEST'
  | 'CAN_MERGE_SUGGESTION'
  | 'CAN_MARK_TREATED'
  | 'CAN_EXPORT_LW'
  | 'CAN_EXPORT_DW'
  | 'CAN_CREATE_MILESTONE'
  | 'CAN_RESTORE_PREVIOUS_VERSION'
  | 'CAN_ADD_REMOVE_COLLABORATOR'
  | 'CAN_DOWNLOAD_PROPOSAL'
  | 'CAN_DOWNLOAD_XML_COMPARISON'
  | 'CAN_UPLOAD'
  | 'CAN_SEE_SOURCE'
  | 'CAN_SEE_ALL_DOCUMENTS'
  | 'CAN_WORK_WITH_EXPORT_PACKAGE'
  | 'CAN_CLOSE_PROPOSAL';

export type RoleEntry = {
  role: Role;
  permissions: Permission[];
  applicationRole: boolean;
  collaborator: boolean;
  defaultDocCreationRole: boolean;
};
