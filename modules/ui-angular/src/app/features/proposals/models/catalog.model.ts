export interface CatalogItem {
  type: CatalogItemType;
  id: string;
  enabled: boolean;
  hidden: true | null;
  key: string;
  /** langCode->name */
  names: Record<string, string>;
  /** langCode->description */
  descriptions: Record<string, string>;
  /** langCode->languageName */
  languages: Record<string, string>;
  items: CatalogItem[];
}

export type CatalogItemType = 'CATEGORY' | 'TEMPLATE';
