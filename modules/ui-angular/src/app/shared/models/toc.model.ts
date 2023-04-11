import { NumberingType } from './document.model';

export class TableOfContentItemVO {
  tocItem: TocItem;
  id: string;
  originAttr: string;
  number: string;
  initialNum: string;
  originNumAttr: string;
  heading: string;
  originHeadingAttr: string;
  content: string;
  node: Node;
  list: string;
  movedOnEmptyParent: boolean;
  numSoftActionAttr: string;
  numberingToggled: boolean;
  undeleted: boolean;
  isBlock: boolean;
  isCrossHeading: boolean;
  isCrossHeadingInList: boolean;
  tocItemType: string;
  childItems: TableOfContentItemVO[];
  parentItem: string;
  softActionAttr: string;
  isSoftActionRoot: boolean;
  softMoveTo: string;
  softMoveFrom: string;
  softTransFrom: string;
  softUserAttr: string;
  softDateAttr: number;
  restored: boolean;
  itemDepth: number;
  originalDepthLevel: number;
  originalIndentLevel: number;
  indentLevel: number;
  elementNumberId: number;
  indentOriginType: string = null;
  indentOriginIndentLevel = -1;
  indentOriginNumId: string = null;
  indentOriginNumValue: string = null;
  indentOriginNumOrigin: string = null;
  style: string;
  isAutoNumOverwritten = false;
  moved: boolean;
  isAffected: boolean;
}

export type AknTag =
  | 'PREFACE'
  | 'DOCSTAGE'
  | 'DOCTYPE'
  | 'DOCPURPOSE'
  | 'BODY'
  | 'PREAMBLE'
  | 'CITATIONS'
  | 'CITATION'
  | 'RECITALS'
  | 'RECITAL'
  | 'PART'
  | 'TITLE'
  | 'CHAPTER'
  | 'SECTION'
  | 'DIVISION'
  | 'ARTICLE'
  | 'PARAGRAPH'
  | 'SUBPARAGRAPH'
  | 'LIST'
  | 'POINT'
  | 'INDENT'
  | 'SUBPOINT'
  | 'ALINEA'
  | 'CLAUSE'
  | 'CONCLUSIONS'
  | 'MAIN_BODY'
  | 'TBLOCK'
  | 'BLOCK_CONTAINER'
  | 'NUM'
  | 'HEADING'
  | 'CROSS_HEADING'
  | 'BLOCK'
  | 'LEVEL'
  | 'CONTENT'
  | 'FORMULA'
  | 'COVER_PAGE'
  | 'LONG_TITLE'
  | 'DOC_PURPOSE'
  | 'INLINE';

export class TocItem {
  aknTag: AknTag;
  root: boolean;
  higherElement: boolean;
  draggable: boolean;
  childrenAllowed: boolean;
  display: boolean;
  itemNumber: string;
  autoNumbering: boolean;
  itemHeading: string;
  itemDescription: boolean;
  numberEditable: boolean;
  contentDisplayed: boolean;
  deletable: boolean;
  numWithType: boolean;
  expandedByDefault: boolean;
  sameParentAsChild: boolean;
  numberingType: NumberingType;
  tocItemTypes: any;
  parentNameNumberingTypeDependency: any;
  profiles: any;
  editable: boolean;
  addSoftAttr: boolean;
  template: string;
  maxDepth: string;
  actionsPosition: any;
}

export class Node {}
