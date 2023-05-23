import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';
import { LeosMetadata, LevelItemVO, Permission, Role } from '@/shared';

export type CkeditorConnectorState = LeosJavaScriptExtensionState & {
  instanceType: string;
  isImplicitSaveEnabled: boolean;
  isSpellCheckerEnabled: boolean;
  spellCheckerServiceUrl: string;
  spellCheckerSourceUrl: string;
  tocItemsJsonArray: TocItem[];
  numberingConfigsJsonArray: NumberingConfig[];
  listNumberConfigJsonArray: ListNumberConfig;
  articleTypesConfigJsonArray: any;
  alternateConfigsJsonArray: AlternateConfig[] | null;
  documentsMetadataJsonArray: LeosMetadata[];
  documentRef: string;
  user: { entity: string; login: string; role: Role[] };
  permissions: Permission[];
};

export interface TocItem {
  aknTag: AknTag;
  root: boolean | null;
  higherElement: boolean | null;
  draggable: boolean;
  childrenAllowed: boolean;
  display: boolean;
  itemNumber: OptionsType;
  autoNumbering: boolean | null;
  itemHeading: OptionsType;
  itemDescription: boolean;
  numberEditable: boolean;
  contentDisplayed: boolean;
  deletable: boolean;
  numWithType: boolean;
  expandedByDefault: boolean;
  sameParentAsChild: boolean;
  numberingType: NumberingType;
  tocItemTypes: TocItemTypes | null;
  parentNameNumberingTypeDependency: AknTag | null;
  profiles: Profiles | null;
  editable: boolean;
  addSoftAttr: boolean | null;
  template: string | null;
  maxDepth: string | null;
  actionsPosition: ActionPositions | null;
}

export type OptionsType = 'NONE' | 'MANDATORY' | 'OPTIONAL';

export type NumberingType =
  | 'NONE'
  | 'ARABIC'
  | 'ARABIC_POSTFIXDOT'
  | 'ARABIC_PARENTHESIS'
  | 'ALPHA_LOWER_PARENTHESIS'
  | 'ROMAN_LOWER_PARENTHESIS'
  | 'ROMAN_UPPER'
  | 'BULLET_BLACK_CIRCLE'
  | 'BULLET_WHITE_CIRCLE'
  | 'BULLET_BLACK_SQUARE'
  | 'BULLET_WHITE_SQUARE'
  | 'BULLET_NUM'
  | 'INDENT'
  | 'HIGHER_ELEMENT_NUM'
  | 'POINT_NUM'
  | 'POINT_NUM_DEF'
  | 'LEVEL_NUM'
  | 'DIVISION_NUM'
  | 'ROMAN_UPPER_POSTFIXDOT'
  | 'ROMAN_UPPER_POSTFIXPARENTHESIS'
  | 'ALPHA_UPPER_POSTFIXDOT'
  | 'ALPHA_UPPER_POSTFIXPARENTHESIS';

export type TocItemTypeName = 'REGULAR' | 'DEFINITION';

export type TocItemType = {
  name: TocItemTypeName;
  attribute: Attribute;
};

export type Attribute = {
  attributeName: string;
  attributeValue: string;
};

export type TocItemTypes = {
  tocItemTypes: TocItemType[];
};

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
  | 'DOC_PURPOSE';

export type Profiles = {
  profiles: Profile[];
};

export type Profile = {
  elementSelector: string;
  profileName: string;
};

export type ActionPositions = 'RIGHT' | 'LEFT';

export type NumberingConfig = {
  type: NumberingType;
  numbered: boolean;
  prefix: string;
  suffix: string;
  sequence: string;
  description: string;
  regex: string | RegExp;
  msgValidationError: string;
  levels: Levels;
  level: string;
};

export type Levels = {
  level: Level[];
};

export type Level = {
  depth: number;
  numberingType: NumberingType;
};

export type AlternateConfig = {
  type: AknTag;
  profile: string;
};

export type ListNumberConfig = {
  REGULAR: Level[];
};

export interface EditElementResponse {
  elementId: string;
  elementTagName: string;
  element: string;
  levelItem: LevelItemVO;
  user: any;
  permissions: string[];
  alternatives: string;
}
