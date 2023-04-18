import { NumberingConfig, NumberingType } from '../models';
import { AknTag, TableOfContentItemVO, TocItem } from '../models/toc.model';

const BULLET_NUM = 'BULLET_NUM';

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
    getNumberingTypeByTagNameAndTocItemType(
      tocItems,
      newValue,
      'POINT',
    ) as NumberingType,
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
  toNumberingType: NumberingType,
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
): TocItem[] =>
  tocItems.filter((m) => m.aknTag.toLowerCase() === tagName.toLowerCase());

export const getTocItemByName = (tocItems: TocItem[], tagName: string) => {
  const items = tocItems.filter(
    (tocItem) => tocItem.aknTag.toLowerCase() === tagName.toLowerCase(),
  );
  return items.length > 0 ? items[0] : null;
};

export const getTocItemByNumberingType = (
  tocItems: Array<TocItem>,
  numType: NumberingType,
  tagName: string,
): TocItem => {
  const filtered = tocItems.filter(
    (tocItem) =>
      tocItem.aknTag.toLowerCase() === tagName.toLowerCase() &&
      tocItem.numberingType.toLocaleLowerCase() === numType.toLocaleLowerCase(),
  );
  return filtered.length > 0 ? filtered[0] : null;
};

export const getTocItemByNumberingConfig = (
  tocItems: Array<TocItem>,
  numType: NumberingType,
): TocItem => {
  const filtered = tocItems.filter(
    (tocItem) =>
      tocItem.numberingType.toLowerCase() === numType.toLocaleLowerCase(),
  );
  return filtered.length > 0 ? filtered[0] : null;
};

export const getNumberingConfig = (
  numberConfigs: NumberingConfig[],
  numType: NumberingType,
): NumberingConfig | null => {
  const filtered = numberConfigs.filter(
    (numberConfig) => numType.toLowerCase() === numberConfig.type.toLowerCase(),
  );
  return filtered.length > 0 ? filtered[0] : null;
};

export const getItemIndentLevel = (
  tree: TableOfContentItemVO[],
  parent: TableOfContentItemVO,
  startingDepth: number,
  tags: string[],
) => {
  if (parent && tags.includes(parent.tocItem.aknTag)) startingDepth++;
  if (parent.parentItem) {
    const nextParent = findNodeById(tree, parent.parentItem);
    getItemIndentLevel(tree, nextParent, startingDepth, tags);
  }
};

export const findNodeById = (
  root: TableOfContentItemVO[],
  id: string,
): TableOfContentItemVO | null => {
  for (const node of root) {
    if (node.id === id) {
      return node;
    }
    if (node.childItems) {
      const found = findNodeById(node.childItems, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

export const checkPositionAfterValidationExplanatory = (
  nodeTarget: TableOfContentItemVO,
  nodeDragged: TableOfContentItemVO,
  position: string,
) => {
  switch (nodeDragged.tocItem.aknTag) {
    case 'PART': {
      if (
        (
          [
            'BLOCK',
            'LEVEL',
            'PART',
            'CHAPTER',
            'DIVISION',
            'CROSS_HEADING',
            'PARAGRAPH',
          ] as AknTag[]
        ).includes(nodeTarget.tocItem.aknTag)
      ) {
        return 'AFTER';
      }
      return position;
    }
    case 'TITLE': {
      if (
        (
          [
            'BLOCK',
            'CHAPTER',
            'DIVISION',
            'CROSS_HEADING',
            'PARAGRAPH',
            'LEVEL',
          ] as AknTag[]
        ).includes(nodeTarget.tocItem.aknTag)
      )
        return 'AFTER';
      if ((['PART'] as AknTag[]).includes(nodeTarget.tocItem.aknTag)) {
        return position;
      }
      return position;
    }
    case 'CHAPTER': {
      if (
        (
          [
            'BLOCK',
            'LEVEL',
            'CHAPTER',
            'DIVISION',
            'CROSS_HEADING',
            'POINT',
            'PARAGRAPH',
          ] as AknTag[]
        ).includes(nodeTarget.tocItem.aknTag)
      ) {
        return 'AFTER';
      }
      return position;
    }
    case 'SECTION': {
      if (
        (
          [
            'BLOCK',
            'LEVEL',
            'DIVISION',
            'CROSS_HEADING',
            'LEVEL',
            'PARAGRAPH',
            'SECTION',
          ] as AknTag[]
        ).includes(nodeTarget.tocItem.aknTag)
      )
        return 'AFTER';
      return position;
    }
    case 'DIVISION': {
      if (
        (
          [
            'BLOCK',
            'LEVEL',
            'PART',
            'CHAPTER',
            'DIVISION',
            'CROSS_HEADING',
            'POINT',
            'SECTION',
            'PARAGRAPH',
          ] as AknTag[]
        ).includes(nodeTarget.tocItem.aknTag)
      ) {
        return 'AFTER';
      }
      return position;
    }
    case 'CROSS_HEADING': {
      if (
        (['DIVISION', 'PARAGRAPH'] as AknTag[]).includes(
          nodeTarget.tocItem.aknTag,
        )
      )
        return 'AFTER';
      return position;
    }
    case 'LEVEL': {
      if (
        (
          [
            'DIVISON',
            'CROSS_HEADING',
            'LEVEL',
            'PARAGRAPH',
            'BLOCK',
          ] as AknTag[]
        ).includes(nodeTarget.tocItem.aknTag)
      ) {
        return 'AFTER';
      }
      return position;
    }
    case 'PARAGRAPH': {
      if (
        (
          [
            'BLOCK',
            'PART',
            'DIVISION',
            'LEVEL',
            'CROSS_HEADING',
            'LEVEL',
            'PARAGRAPH',
          ] as AknTag[]
        ).includes(nodeTarget.tocItem.aknTag)
      ) {
        return 'AFTER';
      }
      return position;
    }
    case 'SUBPARAGRAPH': {
      if (
        (['DIVISION', 'SUBPARAGRAPH'] as AknTag[]).includes(
          nodeTarget.tocItem.aknTag,
        ) ||
        nodeTarget.tocItem.numberingType === BULLET_NUM
      ) {
        return 'AFTER';
      }
      return position;
    }
    case 'POINT': {
      if ((['SUBPARAGRAPH'] as AknTag[]).includes(nodeTarget.tocItem.aknTag)) {
        return 'AFTER';
      }
      return position;
    }
    case 'INDENT': {
      if (
        (['SUBPARAGRAPH'] as AknTag[]).includes(nodeTarget.tocItem.aknTag) &&
        nodeDragged.tocItem.numberingType === BULLET_NUM
      ) {
        return 'AFTER';
      }
      return position;
    }
  }
};

export const checkPositionAfterValidation = (
  nodeTarget: TableOfContentItemVO,
  nodeDragged: TableOfContentItemVO,
  position: string,
) => {
  //TODO add cn rules
  switch (nodeTarget.tocItem.aknTag) {
    case 'CITATION': {
      if (['CITATIONS'].includes(nodeDragged.tocItem.aknTag)) return position;
      if (['CITATION'].includes(nodeDragged.tocItem.aknTag)) return 'AFTER';
      return position;
    }
    case 'RECITAL': {
      if (['RECITALS'].includes(nodeDragged.tocItem.aknTag)) return position;
      if (['RECITAL'].includes(nodeDragged.tocItem.aknTag)) return 'AFTER';
      break;
    }
    case 'PART': {
      if (['PART'].includes(nodeDragged.tocItem.aknTag)) return 'AFTER';
      return position;
    }
    case 'TITLE': {
      if (['TITLE', 'PART'].includes(nodeDragged.tocItem.aknTag))
        return 'AFTER';
      return position;
    }
    case 'CHAPTER': {
      if (['CHAPTER', 'PART', 'TITLE'].includes(nodeDragged.tocItem.aknTag))
        return 'AFTER';
      return position;
    }
    case 'SECTION': {
      if (
        ['SECTION', 'PART', 'TITLE', 'CHAPTER'].includes(
          nodeDragged.tocItem.aknTag,
        )
      )
        return 'AFTER';
      return position;
    }
    case 'ARTICLE': {
      if (
        ['PART', 'BODY', 'TITLE', 'CHAPTER', 'SECTION', 'ARTICLE'].includes(
          nodeDragged.tocItem.aknTag,
        )
      )
        return 'AFTER';
      return position;
    }
    case 'PARAGRAPH': {
      if (['PARAGRAPH'].includes(nodeDragged.tocItem.aknTag)) return 'AFTER';
      return position;
    }
    case 'SUBPARAGRAPH': {
      if (['SUBPARAGRAPH', 'POINT'].includes(nodeDragged.tocItem.aknTag))
        return 'AFTER';
      return position;
    }
    case 'LEVEL': {
      if (
        ['SECTION', 'CHAPTER', 'TITLE', 'PART', 'LEVEL', 'PARAGRAPH'].includes(
          nodeDragged.tocItem.aknTag,
        )
      )
        return 'AFTER';
      return position;
    }
    default:
      return position;
  }
};

export const setNumber = (
  toc: TableOfContentItemVO[],
  droppedElement: TableOfContentItemVO,
  targetElement: TableOfContentItemVO,
) => {
  if (isNumbered(toc, droppedElement, targetElement)) {
    if (!droppedElement.isAutoNumOverwritten) {
      droppedElement.number = '#';
    }
    if (droppedElement.numSoftActionAttr === 'DELETE') {
      droppedElement.softActionAttr = null;
    }
  } else {
    droppedElement.number = null;
  }
};

export const isNumbered = (
  toc: TableOfContentItemVO[],
  droppedElement: TableOfContentItemVO,
  targetElement: TableOfContentItemVO,
): boolean => {
  let numbered = true;
  if (droppedElement.tocItem.itemNumber === 'NONE') {
    numbered = false;
  } else if (droppedElement.tocItem.itemNumber === 'OPTIONAL') {
    if (targetElement.tocItem.aknTag === droppedElement.tocItem.aknTag) {
      if (
        targetElement.number === '' ||
        targetElement.softActionAttr === 'DELETE'
      ) {
        numbered = false;
      }
    } else if (
      targetElement.childItems &&
      targetElement.childItems.length > 0
    ) {
      for (const itemVO of targetElement.childItems) {
        if (itemVO.tocItem.aknTag === droppedElement.tocItem.aknTag) {
          if (itemVO.number === '' || itemVO.numSoftActionAttr === 'DELETE') {
            numbered = false;
            break;
          }
        }
      }
    }
  }
  const droppedElementParent = findNodeById(toc, droppedElement.parentItem);
  if (
    numbered &&
    droppedElement.tocItem.aknTag === 'PARAGRAPH' &&
    droppedElementParent &&
    droppedElementParent.numberingToggled &&
    droppedElement.numberingToggled === false
  ) {
    return false;
  }
  if (
    !numbered &&
    droppedElement.tocItem.aknTag === 'PARAGRAPH' &&
    droppedElementParent &&
    droppedElementParent.numberingToggled &&
    droppedElement.numberingToggled === false
  ) {
    return true;
  }
  return numbered;
};

export const setBlockOrCrossHeading = (
  toc: TableOfContentItemVO[],
  sourceItem: TableOfContentItemVO,
) => {
  const isCross =
    sourceItem.tocItem.aknTag === 'CROSS_HEADING' ||
    sourceItem.tocItem.aknTag === 'BLOCK';
  const parentItem = findNodeById(toc, sourceItem.parentItem);
  if (isCross && parentItem.tocItem.aknTag === 'MAIN_BODY') {
    sourceItem.isBlock = true;
  } else if (isCross) {
    sourceItem.isCrossHeading = true;
  }
  if (isCross && isInList) {
    sourceItem.isCrossHeadingInList = true;
  }
};

export const isInList = (
  toc: TableOfContentItemVO[],
  sourceItem: TableOfContentItemVO,
): boolean => {
  const parent = findNodeById(toc, sourceItem.parentItem);
  if (parent != null) {
    if (parent.tocItem.aknTag === 'LIST') {
      return true;
    }
    for (const item of parent.childItems) {
      if (item.tocItem.aknTag === 'POINT' || item.tocItem.aknTag === 'INDENT')
        return true;
    }
  }

  return false;
};

export const handleLevelMove = (
  sourceItem: TableOfContentItemVO,
  targetItem: TableOfContentItemVO,
) => {
  if (
    sourceItem.tocItem.aknTag === 'LEVEL' &&
    targetItem.tocItem.aknTag === 'LEVEL'
  )
    sourceItem.itemDepth = targetItem.itemDepth;
};

const flattened = (node: TableOfContentItemVO): TableOfContentItemVO[] => {
  const childItemsFlat = node.childItems.flatMap((child) =>
    child.childItems.flatMap((l) => flattened(l)),
  );
  return [node, ...childItemsFlat];
};

export const updateDepthOfTocItems = (list: TableOfContentItemVO[]) => {
  const tocItems = list
    .flatMap((l) => flattened(l))
    .filter(
      (tocItemVO: TableOfContentItemVO) => tocItemVO.tocItem.aknTag === 'LEVEL',
    );

  for (let index = 0; index < tocItems.length; index++) {
    const item = tocItems.at(index);
    if (index !== 0) {
      const previousDepth = tocItems.at(index - 1).itemDepth;
      let depth = item.itemDepth;
      if (depth - previousDepth > 1) {
        depth = previousDepth + 1;
      }
      const numOrigin = item.originNumAttr;
      if (numOrigin == null || numOrigin === 'CN') {
        item.itemDepth = depth;
      }
    }
  }
};

export const addOrMoveItem = (
  isAdd: boolean,
  sourceItem: TableOfContentItemVO,
  targetItem: TableOfContentItemVO,
  toc: TableOfContentItemVO[],
  actualTargetItem: TableOfContentItemVO,
  position: string,
) => {
  if (isAdd) {
    if (actualTargetItem) {
      sourceItem.itemDepth = 1;
      sourceItem.parentItem = null;
    } else if (sourceItem.parentItem) {
      sourceItem.originalDepthLevel = sourceItem.itemDepth;
    }
  }
  setItemDepth(sourceItem, targetItem, position);
  setItemLevel(toc, sourceItem, targetItem, position);
};

const setItemDepth = (
  sourceItem: TableOfContentItemVO,
  targetItem: TableOfContentItemVO,
  position: string,
) => {
  if (sourceItem.tocItem.higherElement || targetItem.tocItem.higherElement) {
    setItemDepthInHigherElements(sourceItem, targetItem);
  } else {
    switch (position) {
      case 'AFTER':
        if (targetItem.tocItem.root) {
          sourceItem.itemDepth = 1;
        } else
          sourceItem.itemDepth =
            targetItem.itemDepth === 0 ? 1 : targetItem.itemDepth;
        break;
      case 'BEFORE':
        sourceItem.itemDepth =
          targetItem.itemDepth === 0 ? 1 : targetItem.itemDepth;
        break;
      case 'AS_CHILDREN':
        sourceItem.itemDepth = targetItem.itemDepth + 1;
        break;
    }
  }
};

const setItemDepthInHigherElements = (
  sourceItem: TableOfContentItemVO,
  targetItem: TableOfContentItemVO,
) => {
  sourceItem.itemDepth = targetItem.itemDepth === 0 ? 1 : targetItem.itemDepth;
  sourceItem.childItems.forEach((c) =>
    setItemDepthInHigherElements(c, targetItem),
  );
};

const setItemLevel = (
  toc: TableOfContentItemVO[],
  sourceItem: TableOfContentItemVO,
  targetItem: TableOfContentItemVO,
  position: string,
) => {
  const targetItemLevel = 0;
  getItemIndentLevel(toc, targetItem, targetItemLevel, [
    'LEVEL',
    'PARAGRAPH',
    'INDENT',
    'POINT',
  ]);

  switch (position) {
    case 'AS_CHILDREN':
      if (targetItem.tocItem.root) {
        sourceItem.indentLevel = 0;
      } else if (
        ['LEVEL', 'PARAGRAPH', 'INDENT', 'POINT'].includes(
          targetItem.tocItem.aknTag,
        )
      ) {
        sourceItem.indentLevel = targetItemLevel + 1;
      } else {
        sourceItem.indentLevel = targetItemLevel;
      }
      break;
    case 'BEFORE':
      sourceItem.indentLevel = targetItemLevel;
      break;
    case 'AFTER':
      if (targetItem.tocItem.root) {
        sourceItem.indentLevel = 0;
      } else {
        sourceItem.indentLevel = targetItemLevel;
      }
  }
};
