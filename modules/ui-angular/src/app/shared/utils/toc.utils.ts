import { cloneDeep, drop, remove, round } from 'lodash-es';

import { TableOfContentService } from '@/features/akn-document/services/table-of-content.service';

import {
  ADD,
  ARTICLE,
  BLOCK,
  BULLET_NUM,
  CHAPTER,
  CN,
  CROSSHEADING,
  DELETE,
  DIVISION,
  EC,
  ELEMENTS_TO_REMOVE_FROM_CONTENT,
  HASH_NUM_VALUE,
  INDENT,
  LEOS_TC_DELETE_ACTION, LEOS_TC_INSERT_ACTION,
  LEVEL,
  LIST,
  MAX_INDENT_LEVEL,
  MOVE_FROM,
  MOVE_TO,
  PARAGRAPH,
  PART,
  POINT,
  SECTION,
  SOFT_DELETE_PLACEHOLDER_ID_PREFIX,
  SOFT_MOVE_PLACEHOLDER_ID_PREFIX,
  SUBPARAGRAPH,
  SUBPOINT,
  TEMP_PREFIX,
  TITLE,
  UNDELETE,
} from '../constants/toc.constant';
import { NumberingConfig, NumberingType } from '../models';
import { NodeValidation } from '../models/drop-response.model';
import { AknTag, TableOfContentItemVO, TocItem } from '../models/toc.model';

export const removeNode = (
  root: TableOfContentItemVO[],
  target: TableOfContentItemVO,
) => {
  const parentNode = findNodeById(root, target.parentItem);
  parentNode.childItems = parentNode.childItems.filter(
    (n) => target.id !== n.id,
  );
};
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
    getNumberingTypeByTagNameAndTocItemType(tocItems, oldValue, POINT),
    getNumberingTypeByTagNameAndTocItemType(
      tocItems,
      newValue,
      POINT,
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
  //this is required because Java maps the parentItem = node.id , so this causes infinite loop
  if (parent.parentItem && !parent.tocItem.root) {
    const nextParent = findNodeById(tree, parent.parentItem);
    getItemIndentLevel(tree, nextParent, startingDepth, tags);
  }
};

export const findNodeById = (
  root: TableOfContentItemVO[],
  id: string,
): TableOfContentItemVO | null => {
  const stack: TableOfContentItemVO[] = [...root];

  while (stack.length) {
    const node = stack.pop();
    if (node?.id === id) {
      return node;
    }
    if (node?.childItems) {
      stack.push(...node.childItems);
    }
  }

  return undefined;
};
export const checkPositionAfterValidationExplanatory = (
  nodeTarget: TableOfContentItemVO,
  nodeDragged: TableOfContentItemVO,
  position: string,
) => {
  switch (nodeDragged.tocItem.aknTag) {
    case PART: {
      if (
        (
          [
            BLOCK,
            LEVEL,
            PART,
            CHAPTER,
            DIVISION,
            CROSSHEADING,
            PARAGRAPH,
          ] as AknTag[]
        ).includes(nodeTarget.tocItem.aknTag)
      ) {
        return 'AFTER';
      }
      return position;
    }
    case TITLE: {
      if (
        (
          [BLOCK, CHAPTER, DIVISION, CROSSHEADING, PARAGRAPH, LEVEL] as AknTag[]
        ).includes(nodeTarget.tocItem.aknTag)
      )
        return 'AFTER';
      if (([PART] as AknTag[]).includes(nodeTarget.tocItem.aknTag)) {
        return position;
      }
      return position;
    }
    case CHAPTER: {
      if (
        (
          [
            BLOCK,
            LEVEL,
            CHAPTER,
            DIVISION,
            CROSSHEADING,
            POINT,
            PARAGRAPH,
          ] as AknTag[]
        ).includes(nodeTarget.tocItem.aknTag)
      ) {
        return 'AFTER';
      }
      return position;
    }
    case SECTION: {
      if (
        (
          [BLOCK, LEVEL, DIVISION, CROSSHEADING, PARAGRAPH, SECTION] as AknTag[]
        ).includes(nodeTarget.tocItem.aknTag)
      )
        return 'AFTER';
      return position;
    }
    case DIVISION: {
      if (
        (
          [
            BLOCK,
            LEVEL,
            PART,
            CHAPTER,
            DIVISION,
            CROSSHEADING,
            POINT,
            SECTION,
            PARAGRAPH,
          ] as AknTag[]
        ).includes(nodeTarget.tocItem.aknTag)
      ) {
        return 'AFTER';
      }
      return position;
    }
    case CROSSHEADING: {
      if (
        ([DIVISION, PARAGRAPH] as AknTag[]).includes(nodeTarget.tocItem.aknTag)
      )
        return 'AFTER';
      return position;
    }
    case LEVEL: {
      if (
        (
          [DIVISION, CROSSHEADING, LEVEL, PARAGRAPH, BLOCK] as AknTag[]
        ).includes(nodeTarget.tocItem.aknTag)
      ) {
        return 'AFTER';
      }
      return position;
    }
    case PARAGRAPH: {
      if (
        (
          [
            BLOCK,
            PART,
            DIVISION,
            LEVEL,
            CROSSHEADING,
            LEVEL,
            PARAGRAPH,
          ] as AknTag[]
        ).includes(nodeTarget.tocItem.aknTag)
      ) {
        return 'AFTER';
      }
      return position;
    }
    case SUBPARAGRAPH: {
      if (
        ([DIVISION, SUBPARAGRAPH] as AknTag[]).includes(
          nodeTarget.tocItem.aknTag,
        ) ||
        nodeTarget.tocItem.numberingType === BULLET_NUM
      ) {
        return 'AFTER';
      }
      return position;
    }
    case POINT: {
      if (([SUBPARAGRAPH] as AknTag[]).includes(nodeTarget.tocItem.aknTag)) {
        return 'AFTER';
      }
      return position;
    }
    case INDENT: {
      if (
        ([SUBPARAGRAPH] as AknTag[]).includes(nodeTarget.tocItem.aknTag) &&
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
  switch (nodeTarget.tocItem.aknTag) {
    case 'CITATION': {
      if (['CITATION'].includes(nodeDragged.tocItem.aknTag)) return 'AFTER';
      return position;
    }
    case 'RECITAL': {
      if (['RECITALS'].includes(nodeDragged.tocItem.aknTag)) return position;
      if (['RECITAL'].includes(nodeDragged.tocItem.aknTag)) return 'AFTER';
      break;
    }
    case PART: {
      if ([PART].includes(nodeDragged.tocItem.aknTag)) return 'AFTER';
      return position;
    }
    case TITLE: {
      if ([TITLE, PART].includes(nodeDragged.tocItem.aknTag)) return 'AFTER';
      return position;
    }
    case CHAPTER: {
      if ([CHAPTER, PART, TITLE].includes(nodeDragged.tocItem.aknTag))
        return 'AFTER';
      return position;
    }
    case SECTION: {
      if ([SECTION, PART, TITLE, CHAPTER].includes(nodeDragged.tocItem.aknTag))
        return 'AFTER';
      return position;
    }
    case ARTICLE: {
      if (
        [PART, 'BODY', TITLE, CHAPTER, SECTION, ARTICLE].includes(
          nodeDragged.tocItem.aknTag,
        )
      )
        return 'AFTER';
      return position;
    }
    case PARAGRAPH: {
      if ([PARAGRAPH].includes(nodeDragged.tocItem.aknTag)) return 'AFTER';
      return position;
    }
    case SUBPARAGRAPH: {
      if ([SUBPARAGRAPH, POINT].includes(nodeDragged.tocItem.aknTag))
        return 'AFTER';
      return position;
    }
    case LEVEL: {
      if (
        [SECTION, CHAPTER, TITLE, PART, LEVEL, PARAGRAPH].includes(
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
  newTree: TableOfContentItemVO[],
  droppedElement: TableOfContentItemVO,
  targetElement: TableOfContentItemVO,
) => {
  if (isNumbered(newTree, droppedElement, targetElement)) {
    if (!droppedElement.autoNumOverwritten) {
      droppedElement.number = HASH_NUM_VALUE;
    }
    if (isNumSoftDeleted(droppedElement.numSoftActionAttr)) {
      droppedElement.numSoftActionAttr = null;
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
        targetElement.number === null ||
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
    droppedElement.tocItem.aknTag === PARAGRAPH &&
    droppedElementParent &&
    droppedElementParent.numberingToggled &&
    droppedElement.numberingToggled === false
  ) {
    return false;
  }
  if (
    !numbered &&
    droppedElement.tocItem.aknTag === PARAGRAPH &&
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
    sourceItem.tocItem.aknTag === CROSSHEADING ||
    sourceItem.tocItem.aknTag === BLOCK;
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
      if (item.tocItem.aknTag === POINT || item.tocItem.aknTag === 'INDENT')
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
    sourceItem.tocItem.aknTag === LEVEL &&
    targetItem.tocItem.aknTag === LEVEL
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
      (tocItemVO: TableOfContentItemVO) => tocItemVO.tocItem.aknTag === LEVEL,
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
      if (numOrigin == null || numOrigin === CN) {
        item.itemDepth = depth;
      }
    }
  }
};

export const setItemDepth = (
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

export const setItemDepthInHigherElements = (
  sourceItem: TableOfContentItemVO,
  targetItem: TableOfContentItemVO,
) => {
  sourceItem.itemDepth = targetItem.itemDepth === 0 ? 1 : targetItem.itemDepth;
  sourceItem.childItems.forEach((c) =>
    setItemDepthInHigherElements(c, targetItem),
  );
};

export const setItemLevel = (
  toc: TableOfContentItemVO[],
  sourceItem: TableOfContentItemVO,
  targetItem: TableOfContentItemVO,
  position: string,
) => {
  const targetItemLevel = 0;
  getItemIndentLevel(toc, targetItem, targetItemLevel, [
    LEVEL,
    PARAGRAPH,
    'INDENT',
    POINT,
  ]);

  switch (position) {
    case 'AS_CHILDREN':
      if (targetItem.tocItem.root) {
        sourceItem.indentLevel = 0;
      } else if (
        [LEVEL, PARAGRAPH, 'INDENT', POINT].includes(targetItem.tocItem.aknTag)
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

export const getNumberingByName = (
  numberingConfigs: NumberingConfig[],
  numType: NumberingType,
) => numberingConfigs.find((config) => config.type === numType);

export const validateAgainstSoftDeletedOrMoveToItems = (
  droppedItems: TableOfContentItemVO[],
  targetItem: TableOfContentItemVO,
  parentItem: TableOfContentItemVO,
  position: string,
) => {
  const originalFound = false;
  for (const sourceItem of droppedItems) {
    if (isSoftDeletedOrMoveToItem(sourceItem)) {
    }
  }
};

export const isSoftDeletedOrMoveToItem = (item: TableOfContentItemVO) =>
  hasTocItemSoftAction(item, DELETE) || hasTocItemSoftAction(item, MOVE_TO);

export const hasTocItemSoftAction = (
  item: TableOfContentItemVO,
  actionType: string,
) => item && item.softActionAttr && item.softActionAttr === actionType;

export const hasTocItemTrackChangeAction = (
  item: TableOfContentItemVO,
  actionType: string,
) => item && item.trackChangeAction && item.trackChangeAction === actionType;

export const containsItemOfOrigin = (
  tableOfContentItemVO: TableOfContentItemVO,
  origin: string,
  elementOrigin: string,
) => {
  if (
    (tableOfContentItemVO.originAttr?.length &&
      tableOfContentItemVO.originAttr === origin) ||
    (!tableOfContentItemVO.originAttr &&
      origin.toLowerCase() === elementOrigin.toLowerCase())
  ) {
    return true;
  }
  let containsItem1 = false;
  for (const item of tableOfContentItemVO.childItems) {
    containsItem1 = containsItemOfOrigin(item, origin, elementOrigin);
    if (containsItem) break;
  }
};

export const softDeleteItem = (
  tocTree: TableOfContentItemVO[],
  item: TableOfContentItemVO,
  elementOrigin: string,
) => {
  const wasRoot = isRootElement(item);
  const wasMoved = item.softActionAttr && item.softActionAttr === MOVE_FROM;
  softDeleteMovedRootItems(tocTree, item);

  let movedTableOfContentItemVO: TableOfContentItemVO = null;
  if (wasMoved) {
    if (!wasRoot) {
      // all its moved children are now restored to their original position and deleted,
      // but the item element still needs to be restored to its original position and deleted
      revertMoveAndTransformToSoftDeleted(tocTree, item);
    }
  } else {
    // all its moved children are now restored to their original position and deleted,
    // and the item only needs to be deleted
    movedTableOfContentItemVO = transformToSoftDeleted(tocTree, item);
  }
  if (item.originAttr && elementOrigin === item.originAttr) {
    if (movedTableOfContentItemVO != null) {
      removeNode(tocTree, movedTableOfContentItemVO);
    }
    removeNode(tocTree, item);
  }
  return movedTableOfContentItemVO;
};

export const copyDeletedItemToTempForUndelete = (
  originalItem: TableOfContentItemVO,
) => {
  if (originalItem.softActionAttr === DELETE) {
    originalItem.id = originalItem.id.replace(
      SOFT_DELETE_PLACEHOLDER_ID_PREFIX,
      '',
    );
    originalItem.originNumAttr = EC;
    originalItem.softActionAttr = UNDELETE;
    originalItem.softActionRoot = null;
    originalItem.softUserAttr = null;
    originalItem.softDateAttr = null;
    originalItem.softMoveFrom = null;
    originalItem.softMoveTo = null;
    originalItem.softTransFrom = null;
    originalItem.undeleted = true;
    originalItem.numSoftActionAttr = originalItem.numSoftActionAttr;
  } else {
    originalItem.id = originalItem.id;
    originalItem.trackChangeAction = LEOS_TC_DELETE_ACTION;
  }
  originalItem.content = originalItem.content;
  originalItem.itemDepth = originalItem.itemDepth;
  originalItem.originalDepthLevel = originalItem.originalDepthLevel;
  originalItem.childItems = originalItem.childItems.map((child) => {
    const newChild = copyDeletedItemToTempForUndelete(child);
    newChild.parentItem = newChild.parentItem.replace(
      SOFT_DELETE_PLACEHOLDER_ID_PREFIX,
      '',
    );
    return newChild;
  });
  return originalItem;
};

export const softDeleteMovedRootItems = (
  tocTree: TableOfContentItemVO[],
  item: TableOfContentItemVO,
): number => {
  let totalDeletedItems = 0;

  for (const childItem of item.childItems) {
    totalDeletedItems += softDeleteMovedRootItems(tocTree, childItem);
  }

  if (
    isRootElement(item) && item.softActionAttr &&
    MOVE_FROM.toLowerCase() === item.softActionAttr.toLowerCase()
  ) {
    revertMoveAndTransformToSoftDeleted(tocTree, item);
    totalDeletedItems++;
  } else if ( item.originAttr &&
    CN === item.originAttr.toLowerCase() &&
    item.softActionAttr == null
  ) {
    removeNode(tocTree, item);
    totalDeletedItems++;
  }

  return totalDeletedItems;
};

export const revertMoveAndTransformToSoftDeleted = (
  tocTree: TableOfContentItemVO[],
  item: TableOfContentItemVO,
) => {
  const originalItem = getTableOfContentItemVOById(item.softMoveFrom, tocTree);
  if (originalItem != null) {
    //TODO either check if this valid and needed or remove it
    // const movedItem = moveItem(item, originalItem, tocTree.getTreeData());
    // restoreOriginal(movedItem, originalItem, tocTree);
    // if (originalItem.getParentItem() != null) {
    //     TableOfContentHelper.removeChildItem(originalItem.getParentItem(), originalItem);
    // }
    // transformToSoftDeleted(tocTree.getTreeData(), movedItem);
  } else {
    throw new Error(
      'Soft-moved element was later hard-deleted or its id was not set in its placeholder',
    );
  }
};

export const transformToSoftDeleted = (
  treeData: TableOfContentItemVO[],
  item: TableOfContentItemVO,
) => {
  const tempDeletedItem = copyDeletedItemToTemp(item, true);
  return movingItem(item, item, treeData, tempDeletedItem);
};

export const movingItem = (
  item: TableOfContentItemVO,
  moveBefore: TableOfContentItemVO,
  tocTree: TableOfContentItemVO[],
  finalItem: TableOfContentItemVO,
) => {
  dropItemAtOriginalPosition(finalItem, item, tocTree);
  removeNode(tocTree, item);
  //TODO : handle not found, edge case senario the previous code won't be able to reach here
  return item;
};

export const dropItemAtOriginalPosition = (
  nodeToAdd: TableOfContentItemVO,
  originalNode: TableOfContentItemVO,
  tocTree: TableOfContentItemVO[],
) => {
  const originalParent = findNodeById(tocTree, originalNode.parentItem);
  const indexOfOriginalNode = originalParent.childItemsView.indexOf(
    originalNode.id,
  );
  if (indexOfOriginalNode !== -1) {
    originalParent.childItems.splice(indexOfOriginalNode, 0, nodeToAdd);
  }
  //handle not found, edge case senario the previous code won't be able to reach here
};

export const copyDeletedItemToTemp = (
  originalItem: TableOfContentItemVO,
  isSoftActionRoot: boolean,
) => {
  const tempDeletedItem = cloneDeep(originalItem);
  if (
    MOVE_TO !== originalItem.softActionAttr &&
    DELETE !== originalItem.softActionAttr
  ) {
    tempDeletedItem.id = SOFT_DELETE_PLACEHOLDER_ID_PREFIX + originalItem.id;
    tempDeletedItem.originNumAttr = EC;
    tempDeletedItem.softActionRoot = isSoftActionRoot;
    tempDeletedItem.softActionAttr = DELETE;
    tempDeletedItem.softUserAttr = null;
    tempDeletedItem.softDateAttr = null;
  } else {
    tempDeletedItem.id = TEMP_PREFIX + originalItem.id;
  }
  tempDeletedItem.childItems = [];
  originalItem.childItems.forEach((c) => {
    c.parentItem = tempDeletedItem.id;
    tempDeletedItem.childItems.push(copyDeletedItemToTemp(c, false));
  });
  return tempDeletedItem;
};

export const isRootElement = (element: TableOfContentItemVO) =>
  element.softActionRoot;

export const isSourceDivision = (sourceItem: TableOfContentItemVO) =>
  sourceItem.tocItem.aknTag === DIVISION;

export const getActualTargetItem = (
  sourceItem: TableOfContentItemVO,
  targetItem: TableOfContentItemVO,
  parentItem: TableOfContentItemVO,
  position: string,
  isTocItemSibling: boolean,
) => {
  switch (position) {
    case 'AS_CHILDREN':
      if (
        (isTocItemSibling &&
          parentItem != null &&
          !targetItem.tocItem.sameParentAsChild &&
          !isCrossheading(sourceItem)) ||
        (targetItem.tocItem.sameParentAsChild &&
          containsItem(targetItem, LIST)) ||
        targetItem.id === SOFT_MOVE_PLACEHOLDER_ID_PREFIX + sourceItem.id ||
        (targetItem.tocItem.aknTag === SUBPARAGRAPH &&
          isCrossheading(sourceItem))
      ) {
        return parentItem;
      } else if (sourceItem !== targetItem) {
        return targetItem;
      }
      break;
    case 'BEFORE':
      return parentItem != null ? parentItem : targetItem;
    case 'AFTER':
      return isTocItemSibling ? parentItem : targetItem;
  }
  return null;
};

export const isCrossheading = (sourceItem: TableOfContentItemVO) => {
  const sourceTagValue = sourceItem.tocItem.aknTag;
  return sourceTagValue === CROSSHEADING;
};

export const containsItem = (node: TableOfContentItemVO, aknTag: AknTag) => {
  for (const child of node.childItems) {
    if (child.tocItem.aknTag === aknTag) {
      return true;
    }
  }
  return false;
};

export const getTableOfContentItemVOById = (
  id: string,
  tableOfContentItemVOS: Array<TableOfContentItemVO>,
) => {
  for (const tableOfContentItemVO of tableOfContentItemVOS) {
    if (tableOfContentItemVO.id === id) {
      return tableOfContentItemVO;
    } else {
      const childResult = getTableOfContentItemVOById(
        id,
        tableOfContentItemVO.childItems,
      );
      if (childResult != null) {
        return childResult;
      }
    }
  }
  return null;
};

export const isDroppedOnPointOrIndent = (
  sourceItem: TableOfContentItemVO,
  targetItem: TableOfContentItemVO,
) => {
  const sourceTagValue: string = sourceItem.tocItem.aknTag;
  const targetTagValue: string = targetItem.tocItem.aknTag;
  return (
    (sourceTagValue === CROSSHEADING ||
      sourceTagValue === POINT ||
      sourceTagValue === INDENT) &&
    (targetTagValue === POINT || targetTagValue === INDENT)
  );
};

export const removeTag = (itemContent: string) => {
  try {
    for (const element of ELEMENTS_TO_REMOVE_FROM_CONTENT) {
      itemContent = itemContent?.replaceAll(
        '<' + element + '.*?</' + element + '>',
        '',
      );
    }
    itemContent = itemContent?.replaceAll('<[^>]+>', '');
  } catch (e) {
    console.log(e);
  }
  return itemContent?.replaceAll('\\s+', ' ').trim();
};

export const getItemSoftStyle = (
  tableOfContentItemVO: TableOfContentItemVO,
) => {
  let itemSoftStyle = '';
  if (tableOfContentItemVO.trackChangeAction) {
    if (hasTocItemTrackChangeAction(tableOfContentItemVO, LEOS_TC_DELETE_ACTION) && hasTocItemSoftAction(tableOfContentItemVO, MOVE_TO)) {
      itemSoftStyle = 'leos-soft-movedto';
    } else if (hasTocItemTrackChangeAction(tableOfContentItemVO, LEOS_TC_INSERT_ACTION) && hasTocItemSoftAction(tableOfContentItemVO, MOVE_FROM)) {
      itemSoftStyle = 'leos-soft-movedfrom';
    } else if (hasTocItemTrackChangeAction(tableOfContentItemVO, LEOS_TC_INSERT_ACTION)) {
      itemSoftStyle = 'leos-soft-new';
    } else if (hasTocItemTrackChangeAction(tableOfContentItemVO, LEOS_TC_DELETE_ACTION)) {
      let initialNum = tableOfContentItemVO.initialNum;
      if (initialNum != null) {
        initialNum = initialNum.replace('Article ', '');
        tableOfContentItemVO.number = initialNum;
      }
      itemSoftStyle = 'leos-soft-removed';
    }
  } else if (tableOfContentItemVO.softActionAttr) {
    if (hasTocItemSoftAction(tableOfContentItemVO, ADD)) {
      itemSoftStyle = 'leos-soft-new';
    } else if (hasTocItemSoftAction(tableOfContentItemVO, DELETE)) {
      let initialNum = tableOfContentItemVO.initialNum;
      if (initialNum != null) {
        initialNum = initialNum.replace('Article ', '');
        tableOfContentItemVO.number = initialNum;
      }
      itemSoftStyle = 'leos-soft-removed';
    } else if (hasTocItemSoftAction(tableOfContentItemVO, MOVE_TO)) {
      itemSoftStyle = 'leos-soft-movedto';
    } else if (hasTocItemSoftAction(tableOfContentItemVO, MOVE_FROM)) {
      itemSoftStyle = 'leos-soft-movedfrom';
    }
  }
  return itemSoftStyle;
};

export const checkDeleteOnLastItemInList = (
  tocTree: TableOfContentItemVO[],
  deletedItem: TableOfContentItemVO,
) => {
  const parentItem = findNodeById(tocTree, deletedItem.id);
  if (
    parentItem.tocItem.aknTag === LIST &&
    isLastExistingChildElement(deletedItem, parentItem)
  ) {
    return parentItem;
  }
  return null;
};

export const isLastExistingChildElement = (
  tocItemVO: TableOfContentItemVO,
  parentItem: TableOfContentItemVO,
) => parentItem.childItems.length === 1;

export const isDeletedItem = (tableOfContentItemVO: TableOfContentItemVO) =>
  DELETE === tableOfContentItemVO.softActionAttr || LEOS_TC_DELETE_ACTION === tableOfContentItemVO.trackChangeAction;

export const isMoveToItem = (tableOfContentItemVO: TableOfContentItemVO) =>
  MOVE_TO === tableOfContentItemVO.softActionAttr;

export const isUndeletableItem = (
  tocTree: TableOfContentItemVO[],
  tableOfContentItemVO: TableOfContentItemVO,
) => {
  const parentItem = findNodeById(tocTree, tableOfContentItemVO.parentItem);
  return (
    parentItem &&
    !isMoveToItem(tableOfContentItemVO) &&
    DELETE !== parentItem.softActionAttr && !hasTocItemTrackChangeAction(tableOfContentItemVO, LEOS_TC_DELETE_ACTION)
    && !hasTocItemTrackChangeAction(tableOfContentItemVO, LEOS_TC_INSERT_ACTION)
  );
};

export const isDeletableItem = (
  treeData: TableOfContentItemVO[],
  tableOfContentItemVO: TableOfContentItemVO,
) => {
  const elementName = tableOfContentItemVO.tocItem.aknTag;
  const parentItem = findNodeById(treeData, tableOfContentItemVO.parentItem);
  if (process.env.NG_APP_LEOS_INSTANCE === CN)
    return !(
      (DELETE === tableOfContentItemVO.softActionAttr ||
        MOVE_TO === tableOfContentItemVO.softActionAttr ||
        (PARAGRAPH === elementName &&
          checkOriginParentTocITem(tableOfContentItemVO, CN))) &&
      isLastExistingChildElement(tableOfContentItemVO, parentItem)
    );
  if (process.env.NG_APP_LEOS_INSTANCE !== CN) {
    return !(PARAGRAPH === elementName
      ? isLastExistingChildElement(tableOfContentItemVO, parentItem)
      : false) && !hasTocItemTrackChangeAction(tableOfContentItemVO, LEOS_TC_DELETE_ACTION)
      && !hasTocItemTrackChangeAction(tableOfContentItemVO, LEOS_TC_INSERT_ACTION);
  }
};

export const checkOriginParentTocITem = (
  tableOfContentItemVO: TableOfContentItemVO,
  origin: string,
) =>
  tableOfContentItemVO.originAttr && tableOfContentItemVO.originAttr === origin;

export const checkIfConfirmDeletion = (
  treeData: TableOfContentItemVO[],
  tableOfContentItemVO: TableOfContentItemVO,
) => {
  if (process.env.NG_APP_LEOS_INSTANCE === CN) {
    return (
      tableOfContentItemVO.childItems.length > 0 &&
      containsNoSoftDeletedItem(treeData, tableOfContentItemVO)
    );
  }
  if (process.env.NG_APP_LEOS_INSTANCE === EC) {
    return tableOfContentItemVO.childItems.length > 0;
  }
};

export const containsNoSoftDeletedItem = (
  treeData: TableOfContentItemVO[],
  tableOfContentItemVO: TableOfContentItemVO,
) => {
  let containsItemNoSoftDeleted = false;
  for (const item of tableOfContentItemVO.childItems || []) {
    if (item.softActionAttr == null || !hasTocItemSoftAction(item, DELETE)) {
      containsItemNoSoftDeleted = true;
    } else {
      containsItemNoSoftDeleted = containsNoSoftDeletedItem(
        item.childItems,
        tableOfContentItemVO,
      );
    }
    if (containsItemNoSoftDeleted) break;
  }
  return containsItemNoSoftDeleted;
};

export const validateMaxDepth = (
  validationResult: NodeValidation,
  sourceItem: TableOfContentItemVO,
  targetItem: TableOfContentItemVO,
) => {
  if (targetItem.tocItem.maxDepth != null) {
    const maxDepthRule = parseInt(targetItem.tocItem.maxDepth, 10);
    if (maxDepthRule > 0 && targetItem.itemDepth >= maxDepthRule) {
      validationResult.success = false;
      validationResult.messageKey = 'toc.edit.window.drop.error.depth.message';
      validationResult.sourceItem = sourceItem;
      validationResult.targetItem = targetItem;
    }
  }
  return true;
};

export const validateAddingToItem = (
  validationResult: NodeValidation,
  sourceItem: TableOfContentItemVO,
  targetItem: TableOfContentItemVO,
  tocTree: TableOfContentItemVO[],
  actualTargetItem: TableOfContentItemVO,
  position: string,
) => {
  const isNumberedCN = (element: TableOfContentItemVO) => {
    let _isNumbered = true;
    if (element.tocItem.itemNumber === 'NONE') {
      _isNumbered = false;
    } else if (
      element.tocItem.itemNumber === 'OPTIONAL' &&
      (!element.number ||
        element.number === '' ||
        isNumSoftDeleted(element.numSoftActionAttr))
    ) {
      _isNumbered = false;
    }
    return _isNumbered;
  };
  if (process.env.NG_APP_LEOS_INSTANCE !== 'cn') {
    return true;
  }
  if (process.env.NG_APP_LEOS_INSTANCE === 'cn') {
  }
  if (!actualTargetItem) {
    actualTargetItem = targetItem;
  }
  const droppedElementTagName = sourceItem.tocItem.aknTag;
  const droppedElementTagNumberingType = sourceItem.tocItem.numberingType;

  const targetName = actualTargetItem.tocItem.aknTag;
  let indentAllowed = false;

  switch (droppedElementTagName) {
    case SUBPARAGRAPH: {
      if (!isNumberedCN(actualTargetItem)) {
        validationResult.success = true;
        validationResult.messageKey =
          'toc.edit.window.drop.error.subparagraph.message';
        return false;
      }
      break;
    }
    case POINT:
    case INDENT: {
      indentAllowed = isIndentAllowed(
        tocTree,
        actualTargetItem,
        MAX_INDENT_LEVEL - getIndentLevel(sourceItem),
      );
      if (
        !indentAllowed ||
        ![PARAGRAPH, LEVEL, LIST, POINT, INDENT].includes(targetName) ||
        ([PARAGRAPH, LEVEL].includes(targetName) &&
          containsItem(actualTargetItem, droppedElementTagName) &&
          droppedElementTagName !== POINT &&
          ![INDENT, BULLET_NUM].includes(droppedElementTagNumberingType)) ||
        ([PARAGRAPH, LEVEL].includes(targetName) &&
          (containsItem(actualTargetItem, LIST) ||
            !containsOnlySameIndentType(
              actualTargetItem,
              droppedElementTagNumberingType,
            ))) ||
        (targetName === droppedElementTagName &&
          containsItem(actualTargetItem, LIST)) ||
        !validateAgainstOtherIndentsInList(tocTree, sourceItem, targetItem)
      ) {
        validationResult.success = false;
        if (!indentAllowed) {
          validationResult.messageKey =
            'toc.edit.window.drop.error.indentation.message';
        } else if (containsItem(actualTargetItem, LIST)) {
          validationResult.messageKey =
            'toc.edit.window.drop.already.contains.list.error.message';
        } else {
          validationResult.messageKey = 'toc.edit.window.drop.error.message';
        }
        return false;
      }
      break;
    }
    case LIST: {
      indentAllowed = isIndentAllowed(
        tocTree,
        actualTargetItem,
        MAX_INDENT_LEVEL - getIndentLevel(sourceItem),
      );
      if (
        !indentAllowed ||
        ((targetName === PARAGRAPH || targetName === LEVEL) &&
          containsItem(actualTargetItem, LIST)) ||
        ((targetName === POINT || targetName === INDENT) &&
          containsItem(actualTargetItem, LIST))
      ) {
        validationResult.success = false;
        validationResult.messageKey = !indentAllowed
          ? 'toc.edit.window.drop.error.indentation.message'
          : 'toc.edit.window.drop.error.list.message';
        return false;
      }
      break;
    }
    default:
      break;
  }
  return true;
};

export const isNumSoftDeleted = (numSoftACtionAttr: string) =>
  DELETE === numSoftACtionAttr;

export const isIndentAllowed = (
  treeData: TableOfContentItemVO[],
  targetElement: TableOfContentItemVO,
  indentLevel: number,
) => {
  let isAllowed = true;
  if (indentLevel < 0) {
    isAllowed = false;
  } else if (targetElement != null) {
    const tagValue = targetElement.tocItem.aknTag;
    const parentItem = findNodeById(treeData, targetElement.parentItem);
    isAllowed = isIndentAllowed(
      treeData,
      parentItem,
      tagValue === POINT || tagValue === INDENT ? indentLevel - 1 : indentLevel,
    );
  }
  return isAllowed;
};

export const getIndentLevel = (element: TableOfContentItemVO) => {
  let identLevel = 0;
  for (const child of element.childItems) {
    identLevel = Math.max(identLevel, getIndentLevel(child));
  }
  const tagValue = element.tocItem.aknTag;
  return tagValue === POINT || tagValue === INDENT
    ? identLevel + 1
    : identLevel;
};

export const validateAgainstOtherIndentsInList = (
  tocTree: TableOfContentItemVO[],
  sourceItem: TableOfContentItemVO,
  targetItem: TableOfContentItemVO,
) => {
  if (
    targetItem.tocItem.aknTag !== INDENT &&
    targetItem.tocItem.aknTag !== POINT &&
    targetItem.childItems.length > 0
  ) {
    for (const child of targetItem.childItems) {
      if (!validateAgainstOtherIndent(sourceItem, child)) {
        return false;
      }
    }
  } else if (
    targetItem.tocItem.aknTag === POINT ||
    targetItem.tocItem.aknTag === INDENT
  ) {
    return validateAgainstOtherIndent(sourceItem, targetItem);
  } else if (
    targetItem.tocItem.aknTag === LIST &&
    targetItem.childItems.length === 0
  ) {
    const parentItem = findNodeById(tocTree, sourceItem.parentItem);
    return validateAgainstOtherIndentsInList(tocTree, sourceItem, parentItem);
  }
  return true;
};

export const validateAgainstOtherIndent = (
  sourceItem: TableOfContentItemVO,
  targetItem: TableOfContentItemVO,
) => {
  const targetNumberingType = targetItem.tocItem.numberingType;
  const sourceNumberingType = sourceItem.tocItem.numberingType;
  return targetNumberingType === sourceNumberingType;
};

export const containsOnlySameIndentType = (
  node: TableOfContentItemVO,
  numberingType: string,
) => {
  const childItems: TableOfContentItemVO[] = node.childItems;
  for (const child of childItems || []) {
    if (
      child.tocItem.aknTag === INDENT &&
      child.tocItem.numberingType !== numberingType
    ) {
      return false;
    }
  }
  return true;
};

export const isNodeLastElement = (
  toc: TableOfContentItemVO[],
  elementId: string,
) => {
  const targetNode = findNodeById(toc, elementId);
  const parentNode = findNodeById(toc, targetNode.parentItem);

  return parentNode?.childItems?.length === 1;
};

export const restoreMovedItemOrSetNumber = (
  tocTree: TableOfContentItemVO[],
  droppedItem: TableOfContentItemVO,
  newPosition: TableOfContentItemVO,
  position: string,
) => {
  setNumber(tocTree, droppedItem, newPosition);
};

const isPlaceholderForDroppedItem = (
  tocTree: TableOfContentItemVO[],
  candidate: TableOfContentItemVO,
  droppedItem: TableOfContentItemVO,
) => {
  const parentItemOfCandiate = findNodeById(tocTree, candidate.parentItem);
  if (candidate && hasTocItemSoftAction(parentItemOfCandiate, MOVE_TO)) {
    return false;
  }
  return (
    candidate &&
    candidate.id === SOFT_MOVE_PLACEHOLDER_ID_PREFIX + droppedItem.id
  );
};

export const isFirstPointOrSubparagraph = (
  tocTree: TableOfContentItemVO[],
  item: TableOfContentItemVO,
) => {
  const parentNodeOfItem = findNodeById(tocTree, item.parentItem);
  return (
    item.parentItem !== null &&
    [SUBPARAGRAPH, SUBPOINT].includes(item.tocItem.aknTag) &&
    isTocItemFirstChild(tocTree, parentNodeOfItem, item)
  );
};

export const isTocItemFirstChild = (
  tocTree: TableOfContentItemVO[],
  item: TableOfContentItemVO,
  child: TableOfContentItemVO,
) => {
  const parentOfItem = findNodeById(tocTree, item.parentItem);
  return LIST === item.tocItem.aknTag &&
    child.tocItem.aknTag === SUBPARAGRAPH &&
    item.childItems.indexOf(child) === 0
    ? parentOfItem.childItems.indexOf(
        findNodeById(tocTree, child.parentItem),
      ) === 0
    : item.childItems.indexOf(child) === 0;
};

export const getInstanceType = (instance: string) => {
  if(instance === EC) {
    return 'COMMISSION';
  } else if( instance === CN) {
    return 'COUNCIL';
  } else {
    return 'OS';
  }
}
