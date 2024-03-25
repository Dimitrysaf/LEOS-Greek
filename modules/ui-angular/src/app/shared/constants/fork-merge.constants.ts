/* eslint-disable simple-import-sort/exports */
export enum ContributionActionAttrValue {
  ACCEPT = "ACCEPT",
  ACCEPT_TC = "ACCEPT_TC",
  PROCESSED = "PROCESSED",
  UNDO = "UNDO",
}

const MERGE_CONTRIBUTION = "merge-contribution-wrapper";
const MERGE_ACTION_ATTR = "leos:mergeAction";
const ACTION_DONE_CLASS = "contribution-wrapper-after-merge";
const SELECTED_ACTION_ATTR = "leos:selectedAction";
const LEOS_TRACK_ACTION = 'leos:action';
const LEOS_SOFT_ACTION = 'leos:softaction';
const LEOS_SOFT_ACTION_MOVE_TO = 'leos:softmove_to';
const LEOS_SOFT_ACTION_MOVE_FROM = 'leos:softmove_from';
const MOVE_FROM_ATTR = 'move_from';
const MOVE_TO_ATTR = 'move_to';
const MOVE_ATTR = 'move';
const DELETE_ATTR = 'delete';
const INSERT_ATTR = 'insert';
const ADD_ATTR = 'add';
const MOVE_PREFIX = 'moved_';
const CONTENT_CHANGE = 'content_change';
const ID = 'id';
const REVISION_PREFIX = "revision-";
const PARENT_AFFECTED = "parent_affected";

export {
  REVISION_PREFIX,
  ID,
  MERGE_CONTRIBUTION,
  ACTION_DONE_CLASS,
  MERGE_ACTION_ATTR,
  SELECTED_ACTION_ATTR,
  LEOS_TRACK_ACTION,
  LEOS_SOFT_ACTION,
  LEOS_SOFT_ACTION_MOVE_TO,
  LEOS_SOFT_ACTION_MOVE_FROM,
  MOVE_FROM_ATTR,
  MOVE_TO_ATTR,
  MOVE_ATTR,
  DELETE_ATTR,
  INSERT_ATTR,
  ADD_ATTR,
  CONTENT_CHANGE,
  PARENT_AFFECTED,
  MOVE_PREFIX
};
