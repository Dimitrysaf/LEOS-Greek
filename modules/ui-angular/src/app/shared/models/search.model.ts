export interface SearchMatchVO {
  replaceable: boolean;
  matchedElements: ElementMatchVO[];
}
export interface ElementMatchVO {
  elementId: string;
  matchStartIndex: number;
  matchEndIndex: number;
  editable: boolean;
}
