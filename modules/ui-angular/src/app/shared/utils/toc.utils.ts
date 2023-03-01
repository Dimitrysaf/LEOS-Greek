import { TableOfContentItemVO, TocItem } from '../models/toc.model';

export const getNumberingTypeByTagNameAndTocItemType = (
  tocItems: TocItem[],
  tocItemType: string,
  subElementTagName: string,
) => {
  const subElementTocItems = getTocItemsByName(tocItems, subElementTagName);
  if (
    subElementTocItems.length > 1 &&
    subElementTocItems[0].parentNameNumberingTypeDependency !== null
  ) {
    const parentTocItem = getTocItemByName(
      tocItems,
      subElementTocItems[0].parentNameNumberingTypeDependency,
    );
    if (
      parentTocItem &&
      parentTocItem.tocItemTypes !== null &&
      parentTocItem.tocItemTypes.tocItemTypes.length > 0
    ) {
      for (const tocItemTyp of parentTocItem.tocItemTypes.tocItemTypes) {
        if (tocItemTyp === tocItemType) {
          return getNumberingTypeFromSubElementNumberingConfigs(
            tocItems,
            subElementTagName,
            tocItemTyp.getSubElementNumberingConfigs(),
          );
        }
      }
    } else if (subElementTocItems.length >= 1) {
      return subElementTocItems[0].numberingType;
    }
    return null;
  }
};

export const convertArticle = (
  tocItems: Array<TocItem>,
  article: TableOfContentItemVO,
  oldValue: string,
  newValue: string,
): void => {
  updateTocItemsNumberingConfig(
    tocItems,
    article,
    getNumberingTypeByTagNameAndTocItemType(tocItems, oldValue, 'POINT'),
    getNumberingTypeByTagNameAndTocItemType(tocItems, newValue, 'POINT'),
  );
};

export const getNumberingTypeFromSubElementNumberingConfigs = (
  tocItems: TocItem[],
  subElementTagName: string,
  subElementNumberingConfigs: any[],
): string => {
  if (subElementNumberingConfigs.length > 0) {
    for (const subElementNumberingConfig of subElementNumberingConfigs) {
      if (subElementNumberingConfig.subElement === subElementTagName) {
        return subElementNumberingConfig.numberingType;
      }
    }
    const tocItem: TocItem = getTocItemByName(tocItems, subElementTagName);
    if (tocItem != null) {
      return tocItem.numberingType;
    }
  }
  return null;
};

const updateTocItemsNumberingConfig = (
  tocItems: TocItem[],
  item: TableOfContentItemVO,
  fromNumberingType: string,
  toNumberingType: string,
): void => {
  for (const child of item.childItems) {
    if (child.tocItem.numberingType === fromNumberingType) {
      const tocItem = getTocItemByNumberingType(
        tocItems,
        toNumberingType,
        child.tocItem.aknTag,
      );
      child.tocItem = tocItem;
    }
    child.isAffected = true;
    updateTocItemsNumberingConfig(
      tocItems,
      child,
      fromNumberingType,
      toNumberingType,
    );
  }
};

export const getTocItemsByName = (
  tocItems: TocItem[],
  tagName: string,
): TocItem[] => tocItems.filter((m) => m.aknTag.toLowerCase() === tagName);

export const getTocItemByName = (tocItems: TocItem[], tagName: string) => {
  const items = tocItems.filter(
    (tocItem) => tocItem.aknTag.toLowerCase() === tagName,
  );
  return items.length > 0 ? items[0] : null;
};

export const getTocItemByNumberingType = (
  tocItems: Array<TocItem>,
  numType: string,
  tagName: string,
): TocItem => {
  const filtered = tocItems.filter(
    (tocItem) =>
      tocItem.aknTag === tagName && tocItem.numberingType === numType,
  );
  return filtered.length > 0 ? filtered[0] : null;
};
