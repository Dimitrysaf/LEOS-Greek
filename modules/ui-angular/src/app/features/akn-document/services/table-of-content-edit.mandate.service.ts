import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';

import {
  ADD,
  BULLET_NUM,
  CN,
  DELETE,
  EC,
  ELEMENTS_TO_BE_PROCESSED_FOR_NUMBERING,
  ELEMENTS_WITHOUT_CONTENT,
  HASH_NUM_VALUE,
  INDENT,
  LEVEL,
  LIST,
  MAX_INDENT_LEVEL,
  MOVE_FROM,
  MOVE_TO,
  PARAGRAPH,
  POINT,
  POINT_ROOT_PARENT_ELEMENTS,
  SOFT_MOVE_PLACEHOLDER_ID_PREFIX,
  SUBPARAGRAPH,
} from '@/shared/constants';
import { NodeValidation } from '@/shared/models/drop-response.model';
import { TableOfContentItemVO } from '@/shared/models/toc.model';
import {
  containsItemOfOrigin,
  containsOnlySameIndentType,
  findNodeById,
  getIndentLevel,
  isIndentAllowed,
  isLastExistingChildElement,
  isNumSoftDeleted,
  restoreMovedItemOrSetNumber,
  setBlockOrCrossHeading,
  softDeleteItem,
  validateAgainstOtherIndentsInList,
} from '@/shared/utils/toc.utils';

import { TableOfContentService } from './table-of-content.service';
import { TableOfContentEditService } from './table-of-content-edit.service';

@Injectable()
export class TableOfContentMandateEditService extends TableOfContentEditService {
  constructor(tocService: TableOfContentService) {
    super(tocService);
  }

  validateAddingToItem(
    validationResult: NodeValidation,
    sourceItem: TableOfContentItemVO,
    targetItem: TableOfContentItemVO,
    tocTree: TableOfContentItemVO[],
    actualTargetItem: TableOfContentItemVO,
    position: string,
  ) {
    if (!actualTargetItem) {
      actualTargetItem = targetItem;
    }
    const droppedElementTagName = sourceItem.tocItem.aknTag;
    const droppedElementTagNumberingType = sourceItem.tocItem.numberingType;

    const targetName = actualTargetItem.tocItem.aknTag;
    let indentAllowed = false;

    switch (droppedElementTagName) {
      case SUBPARAGRAPH: {
        if (!this.isNumberedCN(actualTargetItem)) {
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
            this.containsItem(actualTargetItem, droppedElementTagName) &&
            droppedElementTagName !== POINT &&
            ![INDENT, BULLET_NUM].includes(droppedElementTagNumberingType)) ||
          ([PARAGRAPH, LEVEL].includes(targetName) &&
            (this.containsItem(actualTargetItem, LIST) ||
              !containsOnlySameIndentType(
                actualTargetItem,
                droppedElementTagNumberingType,
              ))) ||
          (targetName === droppedElementTagName &&
            this.containsItem(actualTargetItem, LIST)) ||
          !validateAgainstOtherIndentsInList(tocTree, sourceItem, targetItem)
        ) {
          validationResult.success = false;
          if (!indentAllowed) {
            validationResult.messageKey =
              'toc.edit.window.drop.error.indentation.message';
            console.log('toc.edit.window.drop.error.indentation.message');
            // result.setMessageKey("toc.edit.window.drop.error.indentation.message");
          } else if (this.containsItem(actualTargetItem, LIST)) {
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
            this.containsItem(actualTargetItem, LIST)) ||
          ((targetName === POINT || targetName === INDENT) &&
            this.containsItem(actualTargetItem, LIST))
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
  }

  addOrMoveItem(
    isAdd: boolean,
    sourceItem: TableOfContentItemVO,
    targetItem: TableOfContentItemVO,
    tocTree: TableOfContentItemVO[],
    actualTargetItem: TableOfContentItemVO,
    position: string,
  ) {
    if (isAdd) {
      super.addOrMoveItem(
        isAdd,
        sourceItem,
        targetItem,
        tocTree,
        actualTargetItem,
        position,
      );
      this.moveOriginAttribute(sourceItem, targetItem);
      this.setNumber(tocTree, sourceItem, targetItem);
      if (!sourceItem.tocItem.addSoftAttr) {
        sourceItem.softActionAttr = ADD;
        sourceItem.softActionRoot = true;
      }
      if (sourceItem.tocItem.aknTag === 'DIVISION') {
        sourceItem.style = 'type_1';
      }
    } else {
      this.updateMovedOnEmptyParent(
        sourceItem,
        actualTargetItem,
        PARAGRAPH,
        SUBPARAGRAPH,
      );
      this.updateMovedOnEmptyParent(
        sourceItem,
        actualTargetItem,
        POINT,
        SUBPARAGRAPH,
      );
      this.updateMovedOnEmptyParent(
        sourceItem,
        actualTargetItem,
        INDENT,
        SUBPARAGRAPH,
      );
      this.updateMovedOnEmptyParent(
        sourceItem,
        actualTargetItem,
        LEVEL,
        SUBPARAGRAPH,
      );
      //handle the logic for original item
      this.handleMoveAction(sourceItem, tocTree);
      //insert the moved node to the target position
      super.addOrMoveItem(
        isAdd,
        sourceItem,
        targetItem,
        tocTree,
        actualTargetItem,
        position,
      );
      restoreMovedItemOrSetNumber(tocTree, sourceItem, targetItem, position);
    }
    const paretnNode = findNodeById(tocTree, sourceItem.parentItem);
    this.handleLevelMove(sourceItem, targetItem);
    this.updateDepthOfTocItems(paretnNode?.childItems ?? []);
    this.setAffectedAttribute(sourceItem, tocTree);
    setBlockOrCrossHeading(tocTree, sourceItem);

    this.resetUserInfo(sourceItem);
    this.setTree(tocTree);
  }

  handleMoveAction(
    moveFromItem: TableOfContentItemVO,
    tocTree: TableOfContentItemVO[],
  ) {
    if (
      moveFromItem.originAttr === EC &&
      (moveFromItem.softActionAttr == null ||
        (!this.hasTocItemSoftAction(moveFromItem, MOVE_FROM) &&
          !this.hasTocItemSoftAction(moveFromItem, MOVE_TO) &&
          !this.hasTocItemSoftAction(moveFromItem, ADD) &&
          !this.hasTocItemSoftAction(moveFromItem, DELETE)))
    ) {
      const moveTemp = this.copyMovingItemToTemp(moveFromItem, true, tocTree);

      // Handles specific case while moving unnumbered paragraph together with numbered paragraphs
      if (
        [PARAGRAPH, LEVEL].includes(moveFromItem.tocItem.aknTag) &&
        moveFromItem.number === ''
      ) {
        const moveFromSiblings = findNodeById(
          tocTree,
          moveTemp.parentItem,
        ).childItems;
        if (moveFromSiblings?.length > 0) {
          const refItem = moveFromSiblings[0];
          if (refItem.number !== '') {
            moveFromItem.number = HASH_NUM_VALUE;
          }
        }
      }

      this.dropItemAtOriginalPosition(moveTemp, moveFromItem, tocTree);

      moveFromItem.originNumAttr = CN;
      moveFromItem.softActionRoot = true;

      // dropItemAtOriginalPosition(moveToTemp, moveToFinal, container);

      this.setAffectedAttribute(moveFromItem, tocTree);

      if (moveFromItem.softActionAttr === MOVE_FROM) {
        moveFromItem.softMoveFrom =
          SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromItem.id;
        const moveToItem = findNodeById(tocTree, moveFromItem.softMoveFrom);
        if (moveToItem) {
          moveToItem.softActionRoot = true;
          this.setAffectedAttribute(moveToItem, tocTree);
        }
      }
    }
  }

  copyMovingItemToTemp(
    originalItem: TableOfContentItemVO,
    isSoftActionRoot: boolean,
    tocTree: TableOfContentItemVO[],
  ) {
    const moveToItem = cloneDeep(originalItem);
    moveToItem.childItems = [];
    if (!ELEMENTS_WITHOUT_CONTENT.includes(originalItem.tocItem.aknTag)) {
      moveToItem.id = SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveToItem.id;
      moveToItem.originNumAttr = EC;
      moveToItem.softActionAttr = MOVE_TO;
      moveToItem.softActionRoot = isSoftActionRoot;
      moveToItem.softUserAttr = null;
      moveToItem.softDateAttr = null;
      moveToItem.numSoftActionAttr = originalItem.numSoftActionAttr;
      moveToItem.content = originalItem.content;

      originalItem.childItems.forEach((child) => {
        if (
          child.originAttr === EC &&
          child.softActionAttr !== MOVE_FROM &&
          child.softActionAttr !== MOVE_TO &&
          child.softActionAttr !== ADD &&
          child.softActionAttr !== DELETE
        ) {
          moveToItem.childItems.push(
            this.copyMovingItemToTemp(child, false, tocTree),
          );
        } else if (
          child.originAttr === EC &&
          (child.softActionAttr === MOVE_TO || child.softActionAttr === DELETE)
        ) {
          this.setAffectedAttribute(child, tocTree);
        }
      });
    } else {
      moveToItem.id = SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveToItem.id;
      moveToItem.softActionAttr = MOVE_TO;
      moveToItem.softActionRoot = isSoftActionRoot;
      moveToItem.originNumAttr = EC;
      moveToItem.heading = null;
      moveToItem.softUserAttr = null;
      moveToItem.softDateAttr = null;
    }
    moveToItem.softMoveTo = originalItem.id;
    moveToItem.itemDepth = originalItem.itemDepth;
    moveToItem.originalDepthLevel = originalItem.originalDepthLevel;
    originalItem.softActionAttr = MOVE_FROM;
    originalItem.softActionRoot = isSoftActionRoot;
    originalItem.softMoveFrom =
      SOFT_MOVE_PLACEHOLDER_ID_PREFIX + originalItem.id;
    return moveToItem;
  }

  setAffectedAttribute(
    dropData: TableOfContentItemVO,
    treeData: TableOfContentItemVO[],
  ) {
    if (
      ELEMENTS_TO_BE_PROCESSED_FOR_NUMBERING.includes(dropData.tocItem.aknTag)
    ) {
      let parentItemVO = findNodeById(treeData, dropData.parentItem);
      while (parentItemVO != null) {
        if (
          ELEMENTS_TO_BE_PROCESSED_FOR_NUMBERING.includes(
            parentItemVO.tocItem.aknTag,
          )
        ) {
          parentItemVO.isAffected = true;
          if (
            POINT_ROOT_PARENT_ELEMENTS.includes(parentItemVO.tocItem.aknTag)
          ) {
            break;
          }
        }
        parentItemVO = findNodeById(treeData, parentItemVO.parentItem);
      }
    }
  }

  isNumberedCN = (element: TableOfContentItemVO) => {
    let isNumbered = true;
    if ('NONE' === element.tocItem.itemNumber) {
      isNumbered = false;
    } else if (
      'OPTIONAL' === element.tocItem.itemNumber &&
      (element.number == null ||
        element.number === '' ||
        isNumSoftDeleted(element.numSoftActionAttr))
    ) {
      isNumbered = false;
    }
    return isNumbered;
  };

  deleteItem(newTree: TableOfContentItemVO[], item: TableOfContentItemVO) {
    this.setAffectedAttribute(item, newTree);
    const parentItem = this.checkDeleteOnLastItemInList(newTree, item);
    // LEOS-5958: Delete selected item element.
    if (!containsItemOfOrigin(item, EC, CN)) {
      this.removeNode(newTree, item);
    } else {
      softDeleteItem(newTree, item, CN);
    }
    // LEOS-5958: If parentItem is not null, means it is a list without any points. Then delete parentItem as well.
    if (parentItem) {
      if (!containsItemOfOrigin(parentItem, EC, CN)) {
        this.removeNode(newTree, parentItem);
      } else {
        softDeleteItem(newTree, parentItem, CN);
      }
    } else {
      const parent = findNodeById(newTree, item.parentItem);
      this.updateDepthOfTocItems(parent.childItems);
    }
  }

  private checkDeleteOnLastItemInList = (
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
}
