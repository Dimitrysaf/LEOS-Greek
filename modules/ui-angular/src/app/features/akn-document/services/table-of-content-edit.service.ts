import { Injectable } from '@angular/core';

import { DocumentConfig } from '@/shared';
import {
  CHAPTER,
  CN,
  CROSSHEADING,
  DELETE,
  DIVISION,
  HASH_NUM_VALUE,
  INDENT,
  LEVEL,
  LIST,
  LS,
  MOVE_TO,
  PARAGRAPH,
  PART,
  POINT,
  SECTION,
  SOFT_MOVE_PLACEHOLDER_ID_PREFIX,
  SUBPARAGRAPH,
  TITLE,
} from '@/shared/constants/toc.constant';
import { NodeValidation } from '@/shared/models/drop-response.model';
import {
  AknTag,
  TableOfContentItemVO,
  TocItem,
} from '@/shared/models/toc.model';
import {
  copyDeletedItemToTempForUndelete,
  findNodeById,
  getItemIndentLevel,
  isLastExistingChildElement,
  isNumSoftDeleted,
} from '@/shared/utils/toc.utils';

import { TableOfContentService } from './table-of-content.service';

@Injectable()
export abstract class TableOfContentEditService {
  environment: string;
  documentConfig: DocumentConfig;

  private treeHistory: Array<TableOfContentItemVO[]> = [];

  constructor(protected tocService: TableOfContentService) {}

  setTree(newTree: TableOfContentItemVO[]) {
    this.tocService.setToc(newTree);
  }

  popTreeHistory() {
    return this.treeHistory.pop();
  }

  getTreeHistorySize() {
    return this.treeHistory.length;
  }

  setTreeHistory(oldTree: TableOfContentItemVO[]) {
    this.treeHistory.push(oldTree);
  }

  resetTreeHistory(): TableOfContentItemVO[] {
    const tempInitialTreeBeforeEdit = this.treeHistory.shift();
    this.treeHistory = [];
    return tempInitialTreeBeforeEdit;
  }

  setDocumentConfig(documentConfig: DocumentConfig) {
    this.environment = process.env.NG_APP_LEOS_INSTANCE;
    this.documentConfig = documentConfig;
  }

  isDeletedItem = (tableOfContentItemVO: TableOfContentItemVO) =>
    DELETE === tableOfContentItemVO.softActionAttr;

  isMoveToItem = (tableOfContentItemVO: TableOfContentItemVO) =>
    MOVE_TO === tableOfContentItemVO.softActionAttr;

  isUndeletableItem = (
    tocTree: TableOfContentItemVO[],
    tableOfContentItemVO: TableOfContentItemVO,
  ) => {
    const parentItem = findNodeById(tocTree, tableOfContentItemVO.parentItem);
    return (
      parentItem &&
      !this.isMoveToItem(tableOfContentItemVO) &&
      DELETE !== parentItem.softActionAttr
    );
  };

  undeleteItem = (
    tocTree: TableOfContentItemVO[],
    tableOfContentItemVO: TableOfContentItemVO,
  ) => {
    copyDeletedItemToTempForUndelete(tableOfContentItemVO);
    this.setTree(tocTree);
  };

  dropItemAtOriginalPosition(
    nodeToAdd: TableOfContentItemVO,
    originalNode: TableOfContentItemVO,
    tocTree: TableOfContentItemVO[],
  ) {
    const originalParent = findNodeById(tocTree, originalNode.parentItem);
    const indexOfOriginalNode = originalParent.childItems.indexOf(originalNode);
    if (indexOfOriginalNode !== -1) {
      originalParent.childItems.splice(indexOfOriginalNode, 0, nodeToAdd);
    }
    //remove children from original node, this
    nodeToAdd.childItems = [];
    //handle not found, edge case senario the previous code won't be able to reach here
  }

  restoreMovedItemOrSetNumber = (
    tocTree: TableOfContentItemVO[],
    droppedItem: TableOfContentItemVO,
    newPosition: TableOfContentItemVO,
    position: string,
  ) => {
    const siblings =
      position === 'as_children'
        ? newPosition.childItems
        : findNodeById(tocTree, newPosition.parentItem)?.childItems;

    const droppedItemIndex = siblings.indexOf(droppedItem);
    const previousSibling =
      droppedItemIndex > 0 ? siblings.at(droppedItemIndex - 1) : null;
    const nextSibling =
      droppedItemIndex < siblings.length - 1
        ? siblings.at(droppedItemIndex + 1)
        : null;

    if (this.isPlaceholderForDroppedItem(tocTree, newPosition, droppedItem)) {
      // restoreOriginal(droppedItem, newPosition, tocTree);
      if (newPosition.parentItem) {
        // removeNode(tocTree, newPosition);
      }
    } else if (
      this.isPlaceholderForDroppedItem(tocTree, previousSibling, droppedItem)
    ) {
      // restoreOriginal(droppedItem, previousSibling, tocTree);
      // if (newPosition.getParentItem() != null) {
      //     TableOfContentHelper.removeChildItem(newPosition.getParentItem(), previousSibling);
    } else {
      this.setNumber(tocTree, droppedItem, newPosition);
    }
  };

  hasTocItemSoftAction = (item: TableOfContentItemVO, actionType: string) =>
    item && item.softActionAttr && item.softActionAttr === actionType;

  isPlaceholderForDroppedItem = (
    tocTree: TableOfContentItemVO[],
    candidate: TableOfContentItemVO,
    droppedItem: TableOfContentItemVO,
  ) => {
    const parentItemOfCandiate = findNodeById(tocTree, candidate.parentItem);
    if (candidate && this.hasTocItemSoftAction(parentItemOfCandiate, MOVE_TO)) {
      return false;
    }
    return (
      candidate &&
      candidate.id === SOFT_MOVE_PLACEHOLDER_ID_PREFIX + droppedItem.id
    );
  };

  removeNode(root: TableOfContentItemVO[], target: TableOfContentItemVO) {
    const parentNode = findNodeById(root, target.parentItem);
    parentNode.childItems = parentNode.childItems.filter(
      (n) => target.id !== n.id,
    );
  }

  validateAddingItemAsSibling(
    validationResult: NodeValidation,
    sourceItem: TableOfContentItemVO,
    targetItem: TableOfContentItemVO,
    tocTree: TableOfContentItemVO[],
    parentItem: TableOfContentItemVO,
    position: string,
  ) {
    const actualTargetItem = this.getActualTargetItem(
      sourceItem,
      targetItem,
      parentItem,
      position,
      true,
    );
    return this.validateAddingToActualTargetItem(
      validationResult,
      sourceItem,
      targetItem,
      tocTree,
      actualTargetItem,
      position,
    );
  }

  getActualTargetItem = (
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
            !this.isCrossheading(sourceItem)) ||
          (targetItem.tocItem.sameParentAsChild &&
            this.containsItem(targetItem, LIST)) ||
          targetItem.id === SOFT_MOVE_PLACEHOLDER_ID_PREFIX + sourceItem.id ||
          (targetItem.tocItem.aknTag === SUBPARAGRAPH &&
            this.isCrossheading(sourceItem))
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

  validateAddingToActualTargetItem = (
    validationResult: NodeValidation,
    sourceItem: TableOfContentItemVO,
    targetItem: TableOfContentItemVO,
    tocTree: TableOfContentItemVO[],
    actualTargetItem: TableOfContentItemVO,
    position: string,
  ): boolean => {
    const validAddingToItem = this.validateAddingToItem(
      validationResult,
      sourceItem,
      targetItem,
      tocTree,
      actualTargetItem,
      position,
    );
    const maxDepthReached = this.validateMaxDepth(
      validationResult,
      sourceItem,
      targetItem,
    );
    return validAddingToItem && !maxDepthReached;
  };

  abstract validateAddingToItem(
    validationResult: NodeValidation,
    sourceItem: TableOfContentItemVO,
    targetItem: TableOfContentItemVO,
    tocTree: TableOfContentItemVO[],
    actualTargetItem: TableOfContentItemVO,
    position: string,
  );

  validateMaxDepth = (
    validationResult: NodeValidation,
    sourceItem: TableOfContentItemVO,
    targetItem: TableOfContentItemVO,
  ) => {
    if (targetItem.tocItem.maxDepth != null) {
      const maxDepthRule = parseInt(targetItem.tocItem.maxDepth, 10);
      if (maxDepthRule > 0 && targetItem.itemDepth >= maxDepthRule) {
        validationResult.success = false;
        validationResult.messageKey =
          'toc.edit.window.drop.error.depth.message';
        validationResult.sourceItem = sourceItem;
        validationResult.targetItem = targetItem;
      }
    }
    return true;
  };

  addOrMoveItem(
    isAdd: boolean,
    sourceItem: TableOfContentItemVO,
    targetItem: TableOfContentItemVO,
    tocTree: TableOfContentItemVO[],
    actualTargetItem: TableOfContentItemVO,
    position: string,
  ) {
    if (isAdd) {
      if (actualTargetItem == null) {
        sourceItem.parentItem = null;
        sourceItem.itemDepth = 1;
      }
    } else if (sourceItem.parentItem != null) {
      this.removeNode(tocTree, sourceItem);
      sourceItem.originalDepthLevel = sourceItem.itemDepth;
    }

    if (actualTargetItem) {
      sourceItem.parentItem = actualTargetItem.id;
      if (
        (LEVEL === targetItem.tocItem.aknTag &&
          LEVEL !== sourceItem.tocItem.aknTag) ||
        [PART, TITLE, CHAPTER, SECTION].includes(targetItem.tocItem.aknTag)
      ) {
        /*
         * This else is when we add level as child or after a Part, Title, Chapter or Section,
         * because in this case the actualTargetItem is equal to targetItem, and we need to set
         * the level as the first of list of children
         */
        sourceItem.parentItem = targetItem.id;
        targetItem.childItems.splice(0, 0, sourceItem);
        return;
      }
      if ('BEFORE' === position) {
        this.insertBefore(tocTree, targetItem, sourceItem, isAdd);
      } else if ('AFTER' === position) {
        this.insertAfter(tocTree, targetItem, sourceItem, isAdd);
      } else if ('AS_CHILDREN' === position) {
        this.insertChild(tocTree, targetItem, sourceItem, isAdd);
      }
    }
    this.setItemDepth(sourceItem, targetItem, position);
    this.setItemLevel(tocTree, sourceItem, targetItem, position);
  }

  abstract handleMoveAction(
    moveFromItem: TableOfContentItemVO,
    tocTree: TableOfContentItemVO[],
  );

  abstract copyMovingItemToTemp(
    originalItem: TableOfContentItemVO,
    isSoftActionRoot: boolean,
    tocTree: TableOfContentItemVO[],
  );

  abstract deleteItem(
    newTree: TableOfContentItemVO[],
    item: TableOfContentItemVO,
  );

  setItemLevel = (
    toc: TableOfContentItemVO[],
    sourceItem: TableOfContentItemVO,
    targetItem: TableOfContentItemVO,
    position: string,
  ) => {
    const targetItemLevel = 0;
    getItemIndentLevel(toc, targetItem, targetItemLevel, [
      LEVEL,
      PARAGRAPH,
      INDENT,
      POINT,
    ]);

    switch (position) {
      case 'AS_CHILDREN':
        if (targetItem.tocItem.root) {
          sourceItem.indentLevel = 0;
        } else if (
          [LEVEL, PARAGRAPH, 'INDENT', POINT].includes(
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

  performAddOrMoveAction(
    isAdd: boolean,
    tocTree: TableOfContentItemVO[],
    sourceItem: TableOfContentItemVO,
    targetItem: TableOfContentItemVO,
    parentItem: TableOfContentItemVO,
    position: string,
  ) {
    if (targetItem.tocItem.childrenAllowed) {
      const targetTocItem: TocItem = targetItem.tocItem;
      const targetRules = [
        targetTocItem.aknTag.toUpperCase(),
        targetTocItem.numberingType.toUpperCase(),
      ].join('_');
      const targetTocAllowedItems = this.documentConfig.tocRules[targetRules];
      if (
        this.isSourceDivision(sourceItem) ||
        this.isCrossheading(sourceItem) ||
        this.isDroppedOnPointOrIndent(sourceItem, targetItem) ||
        sourceItem.tocItem.aknTag === targetItem.tocItem.aknTag ||
        !(
          targetTocAllowedItems != null &&
          targetTocAllowedItems.length > 0 &&
          targetTocAllowedItems.includes(sourceItem.tocItem)
        )
      ) {
        // If items have the same type or if child elements are not allowed in target add it to its parent
        const actualTargetItem = this.getActualTargetItem(
          sourceItem,
          targetItem,
          parentItem,
          position,
          true,
        );
        this.addOrMoveItem(
          isAdd,
          sourceItem,
          targetItem,
          tocTree,
          actualTargetItem,
          position,
        );
      } else if (!targetTocItem.root) {
        const actualTargetItem = this.getActualTargetItem(
          sourceItem,
          targetItem,
          parentItem,
          position,
          false,
        );
        this.addOrMoveItem(
          isAdd,
          sourceItem,
          targetItem,
          tocTree,
          actualTargetItem,
          position,
        );
      } else {
        if (this.containsItem(targetItem, 'CLAUSE')) {
          const clauseItem: TableOfContentItemVO =
            targetItem.childItems.filter(
              (x) => x.tocItem.aknTag === 'CLAUSE',
            )[0] ?? null;
          if (clauseItem != null) {
            const parent = findNodeById(tocTree, clauseItem.parentItem);
            const actualTargetItem = this.getActualTargetItem(
              sourceItem,
              clauseItem,
              parent,
              'BEFORE',
              true,
            );
            this.addOrMoveItem(
              isAdd,
              sourceItem,
              targetItem,
              tocTree,
              actualTargetItem,
              position,
            );
          }
        } else {
          this.addOrMoveItem(
            isAdd,
            sourceItem,
            targetItem,
            tocTree,
            targetItem,
            'AS_CHILDREN',
          );
        }
      }
    } else {
      const actualTargetItem: TableOfContentItemVO = this.getActualTargetItem(
        sourceItem,
        targetItem,
        parentItem,
        position,
        true,
      );
      this.addOrMoveItem(
        isAdd,
        sourceItem,
        targetItem,
        tocTree,
        actualTargetItem,
        position,
      );
    }
  }

  isInList = (
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

  handleLevelMove = (
    sourceItem: TableOfContentItemVO,
    targetItem: TableOfContentItemVO,
  ) => {
    if (
      sourceItem.tocItem.aknTag === LEVEL &&
      targetItem.tocItem.aknTag === LEVEL
    )
      sourceItem.itemDepth = targetItem.itemDepth;
  };

  isDroppedOnPointOrIndent = (
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

  isRootElement = (element: TableOfContentItemVO) => element.softActionRoot;

  isSourceDivision = (sourceItem: TableOfContentItemVO) =>
    sourceItem.tocItem.aknTag === DIVISION;

  isCrossheading = (sourceItem: TableOfContentItemVO) => {
    const sourceTagValue = sourceItem.tocItem.aknTag;
    return sourceTagValue === CROSSHEADING;
  };

  setItemDepthInHigherElements = (
    sourceItem: TableOfContentItemVO,
    targetItem: TableOfContentItemVO,
  ) => {
    sourceItem.itemDepth =
      targetItem.itemDepth === 0 ? 1 : targetItem.itemDepth;
    sourceItem.childItems.forEach((c) =>
      this.setItemDepthInHigherElements(c, targetItem),
    );
  };

  setItemDepth = (
    sourceItem: TableOfContentItemVO,
    targetItem: TableOfContentItemVO,
    position: string,
  ) => {
    if (sourceItem.tocItem.higherElement || targetItem.tocItem.higherElement) {
      this.setItemDepthInHigherElements(sourceItem, targetItem);
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

  checkDeleteOnLastItemInList = (
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

  containsItem = (node: TableOfContentItemVO, aknTag: AknTag) => {
    for (const child of node.childItems) {
      if (child.tocItem.aknTag === aknTag) {
        return true;
      }
    }
    return false;
  };

  setNumber = (
    newTree: TableOfContentItemVO[],
    droppedElement: TableOfContentItemVO,
    targetElement: TableOfContentItemVO,
  ) => {
    if (this.isNumbered(newTree, droppedElement, targetElement)) {
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

  isNumbered = (
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

  moveOriginAttribute(
    droppedElement: TableOfContentItemVO,
    targetElement: TableOfContentItemVO,
  ) {
    if (this.isElementAndTargetOriginDifferent(droppedElement, targetElement)) {
      droppedElement.originAttr = this.environment === CN ? CN : LS;
    }
    droppedElement.originAttr = this.environment === CN ? CN : LS;
  }

  isElementAndTargetOriginDifferent(
    element: TableOfContentItemVO,
    parent: TableOfContentItemVO,
  ): boolean {
    let isDifferent = false;
    if (element.originAttr === null) {
      isDifferent = true;
    } else if (element.originAttr !== parent.originAttr) {
      isDifferent = true;
    }
    return isDifferent;
  }

  getTableOfContentItemVOById = (
    id: string,
    tableOfContentItemVOS: Array<TableOfContentItemVO>,
  ) => {
    for (const tableOfContentItemVO of tableOfContentItemVOS) {
      if (tableOfContentItemVO.id === id) {
        return tableOfContentItemVO;
      } else {
        const childResult = this.getTableOfContentItemVOById(
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

  resetUserInfo(sourceItem: TableOfContentItemVO) {
    sourceItem.softUserAttr = null;
    sourceItem.softUserAttr = null;
  }

  updateMovedOnEmptyParent(
    dropData: TableOfContentItemVO,
    targetItemVO: TableOfContentItemVO,
    movedOntoType: string,
    movedElementType: string,
  ) {
    if (
      targetItemVO != null &&
      targetItemVO.tocItem.aknTag === movedOntoType &&
      dropData != null &&
      dropData.tocItem.aknTag === movedElementType &&
      !this.containsMovedElement(targetItemVO.childItems, movedElementType)
    ) {
      dropData.movedOnEmptyParent = true;
    }
  }

  containsMovedElement(
    childItems: TableOfContentItemVO[],
    movedElementType: string,
  ) {
    for (const child of childItems) {
      if (child.tocItem.aknTag === movedElementType && child.node != null) {
        return true;
      }
    }
    return false;
  }

  flattened = (node: TableOfContentItemVO): TableOfContentItemVO[] => {
    const childItemsFlat = node.childItems.flatMap((child) =>
      child.childItems.flatMap((l) => this.flattened(l)),
    );
    return [node, ...childItemsFlat];
  };

  updateDepthOfTocItems = (list: TableOfContentItemVO[]) => {
    const tocItems = list
      .flatMap((l) => this.flattened(l))
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

  protected insertAfter(
    tree: TableOfContentItemVO[],
    target: TableOfContentItemVO,
    eventItem: TableOfContentItemVO,
    isAdd: boolean,
  ) {
    //remove the node from the tree
    // if (!isAdd) this.removeNode(newTree, eventItem);
    //get parent of the node droped / to moved at
    const parentNode = findNodeById(tree, target.parentItem);

    //set the selected / dragged  node to have the same id as the node droped/moved at
    eventItem.parentItem = parentNode.id;
    const targetIndex = parentNode.childItems.findIndex(
      (x) => x.id === target.id,
    );
    parentNode.childItems.splice(targetIndex + 1, 0, eventItem);
    //set the new tree
  }

  protected insertBefore(
    tree: TableOfContentItemVO[],
    target: TableOfContentItemVO,
    eventItem: TableOfContentItemVO,
    isAdd: boolean,
  ) {
    // if (!isAdd) this.removeNode(tree, eventItem);
    const parentNode = findNodeById(tree, target.parentItem);
    const targetIndex = parentNode.childItems.findIndex(
      (x) => x.id === target.id,
    );
    //set the selected / dragged  node to have the same id as the node droped/moved at
    eventItem.parentItem = parentNode.id;

    if (targetIndex === 0) {
      parentNode.childItems.unshift(eventItem);
    } else {
      parentNode.childItems.splice(targetIndex, 0, eventItem);
    }
  }

  protected insertChild(
    tree: TableOfContentItemVO[],
    target: TableOfContentItemVO,
    eventItem: TableOfContentItemVO,
    isAdd: boolean,
  ) {
    // if (!isAdd) this.removeNode(tree, eventItem);
    //get node to insert to as child
    const parentToBeNode = findNodeById(tree, target.id);
    //set the selected / dragged  node to have the same id as the node droped/moved at
    eventItem.parentItem = parentToBeNode.id;
    parentToBeNode.childItems.push(eventItem);
  }
}
