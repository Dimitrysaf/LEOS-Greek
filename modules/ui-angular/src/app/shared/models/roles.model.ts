export type ApplicationRole = 'USER' | 'SUPPORT' | 'ADMIN';

export type DocumentRole = 'OWNER' | 'CONTRIBUTOR' | 'REVIEWER' | 'AUTHOR';

export type Role = ApplicationRole | DocumentRole;

/** @see modules/security/src/main/java/eu/europa/ec/leos/security/LeosPermission.java */
export type Permission =
  | 'CAN_CREATE'
  | 'CAN_READ'
  | 'CAN_UPDATE'
  | 'CAN_EDIT_ALL_ANNOTATIONS'
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
  | 'CAN_UPLOAD'
  | 'CAN_DOWNLOAD_XML_COMPARISON'
  | 'CAN_SEE_SOURCE'
  | 'CAN_SEE_ALL_DOCUMENTS'
  | 'CAN_WORK_WITH_EXPORT_PACKAGE'
  | 'CAN_CLOSE_PROPOSAL'
  | 'CAN_RENUMBER'
  | 'CAN_TOGGLE_LIVE_DIFFING'
  | 'CAN_ACTIVATE_TRACK_CHANGES'
  | 'CAN_ACCEPT_CHANGES'
  | 'CAN_REJECT_CHANGES'
  | 'CAN_VALIDATE'
  | 'CAN_UPLOAD_XML_DOC';
