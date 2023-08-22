export const MAX_INDENT_LEVEL = 4;
export const ONE_LINE_NODE_LABEL_LENGTH = 125;
export const MAX_TRUNCATION_LIMIT = 200;
export const TIME_TO_CLEAR_INVALID = 10000;
export const MOVE_TO = 'MOVE_TO';
export const MOVE_FROM = 'MOVE_FROM';
export const ADD = 'ADD';
export const DELETE = 'DELETE';
export const UNDELETE = 'UNDELETE';
export const LEOS_TC_DELETE_ACTION = 'delete';
export const LS = 'ls';
export const EC = 'ec';
export const CN = 'cn';

// AKN TAGS
export const MAIN_BODY = 'MAIN_BODY';
export const CROSSHEADING = 'CROSS_HEADING';
export const PARAGRAPH = 'PARAGRAPH';
export const SUBPARAGRAPH = 'SUBPARAGRAPH';
export const POINT = 'POINT';
export const INDENT = 'INDENT';
export const LEVEL = 'LEVEL';
export const ARTICLE = 'ARTICLE';
export const SUBPOINT = 'ALINEA';
export const SECTION = 'SECTION';
export const CHAPTER = 'CHAPTER';
export const TITLE = 'TITLE';
export const PART = 'PART';
export const RESTORED = 'RESTORED';
export const INLINE = 'INLINE';
export const AUTHORIAL_NOTE = 'AUTHORIALNOTE';
export const TBLOCK = 'TBLOCK';
export const BLOCK = 'BLOCK';
export const BULLET_NUM = 'BULLET_NUM';
export const LIST = 'LIST';
export const DIVISION = 'DIVISION';

export const NUMBERED = 'Numbered';
export const UNNUMBERED = 'Unnumbered';

export const ELEMENTS_TO_BE_PROCESSED_FOR_NUMBERING = [
  ARTICLE,
  PARAGRAPH,
  SUBPARAGRAPH,
  POINT,
  SUBPOINT,
  INDENT,
  LEVEL,
];

export const NUM_HEADING_SEPARATOR = ' - ';
export const HASH_NUM_VALUE = '#';
export const CONTENT_SEPARATOR = ' ';

export const ELEMENTS_TO_REMOVE_FROM_CONTENT = [INLINE, AUTHORIAL_NOTE];

export const ELEMENTS_WITHOUT_CONTENT = [
  ARTICLE,
  SECTION,
  CHAPTER,
  TITLE,
  PART,
];

export const POINT_ROOT_PARENT_ELEMENTS = [ARTICLE, LEVEL];
export const SOFT_MOVE_PLACEHOLDER_ID_PREFIX = 'moved_';
export const SOFT_DELETE_PLACEHOLDER_ID_PREFIX = 'deleted_';
export const SOFT_TRANSFORM_PLACEHOLDER_ID_PREFIX = 'transformed_';
export const SOFT_SPLITTED_PLACEHOLDER_ID_PREFIX = 'splitted_';
export const TEMP_PREFIX = 'temp_';

export const MOVE_LABEL_SPAN_START_TAG = '<span class="leos-soft-move-label">';
export const MOVED_TITLE_SPAN_START_TAG = '<span class="leos-soft-move-title">';
export const SPAN_END_TAG = '</span>';
export const SPACE = ' ';
export const MOVED_LABEL_SIZE =
  MOVED_TITLE_SPAN_START_TAG.length +
  SPACE.length +
  MOVE_LABEL_SPAN_START_TAG.length +
  2 * SPAN_END_TAG.length;
