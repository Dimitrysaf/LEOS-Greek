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
  undeleted: boolean;
  isBlock: boolean;
  isCrossHeading: boolean;
  isCrossHeadingInList: boolean;
  tocItemType: string;
  childItems: TableOfContentItemVO[];
  parent: TableOfContentItemVO;
  softActionAttr: string;
  isSoftActionRoot: string;
  softMoveTo: string;
  softMoveFrom: string;
  softTransFrom: string;
  softUserAttr: string;
  softDateAttr: string;
  restored: boolean;
  itemDepth: number;
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
}

export class TocItem {
  aknTag: string;
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
  numberingType: any;
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
