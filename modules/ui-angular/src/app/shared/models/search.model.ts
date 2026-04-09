export interface SearchMatchVO {
  replaceable: boolean;
  matchedElements: ElementMatchVO[];
  searchHaltedPastThis: boolean;
  maxSearchLimit: number;
}
export interface ElementMatchVO {
  elementId: string;
  matchStartIndex: number;
  matchEndIndex: number;
  editable: boolean;
  xpath: string;
}
