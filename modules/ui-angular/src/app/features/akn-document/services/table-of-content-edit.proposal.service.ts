import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';

import {
  ADD,
  DELETE,
  EC,
  LEOS_TC_DELETE_ACTION,
  LS,
  MOVE_FROM,
  MOVE_TO,
  SOFT_MOVE_PLACEHOLDER_ID_PREFIX,
  LEOS_TC_INSERT_ACTION, LEOS_TC_MOVE_ACTION
} from '@/shared/constants';
import { NodeValidation } from '@/shared/models/drop-response.model';
import { TableOfContentItemVO } from '@/shared/models/toc.model';
import {
  containsItemOfOrigin,
  findNodeById,
  softDeleteItem,
} from '@/shared/utils/toc.utils';

import { TableOfContentService } from './table-of-content.service';
import { TableOfContentEditService } from './table-of-content-edit.service';

@Injectable()
export class TableOfContentProposalEditService extends TableOfContentEditService {
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
      sourceItem.softActionAttr = ADD;
      sourceItem.trackChangeAction = LEOS_TC_INSERT_ACTION;
      sourceItem.softActionRoot = true;
    } else {
      this.handleMoveAction(sourceItem, tocTree);
      super.addOrMoveItem(
        isAdd,
        sourceItem,
        targetItem,
        tocTree,
        actualTargetItem,
        position,
      );
    }
    const paretnNode = findNodeById(tocTree, sourceItem.parentItem);
    this.handleLevelMove(sourceItem, targetItem);
    this.updateDepthOfTocItems(paretnNode?.childItems ?? []);
    this.resetUserInfo(sourceItem);
    this.setTree(tocTree);
  }

  handleMoveAction(
    moveFromItem: TableOfContentItemVO,
    tocTree: TableOfContentItemVO[],
  ) {
    if (
      moveFromItem.originAttr !== null &&
      moveFromItem.originAttr.toLowerCase() === EC &&
      (moveFromItem.softActionAttr == null ||
        (!this.hasTocItemSoftAction(moveFromItem, MOVE_FROM) &&
          !this.hasTocItemSoftAction(moveFromItem, MOVE_TO) &&
          !this.hasTocItemSoftAction(moveFromItem, ADD) &&
          !this.hasTocItemSoftAction(moveFromItem, DELETE)))
    ) {
      const moveTemp = this.copyMovingItemToTemp(moveFromItem, true, tocTree);
      moveFromItem.originNumAttr = LS;
      moveFromItem.softActionRoot = true;

      this.dropItemAtOriginalPosition(moveTemp, moveFromItem, tocTree);
    }
    moveFromItem.originNumAttr = LS;
    moveFromItem.softActionRoot = true;
    if (moveFromItem.softActionAttr === MOVE_FROM) {
      moveFromItem.softMoveFrom =
        SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromItem.id;
      const moveToItem: TableOfContentItemVO = this.getTableOfContentItemVOById(
        moveFromItem.softMoveFrom,
        tocTree,
      );
      if (moveToItem != null) {
        moveToItem.softActionRoot = true;
      }
    }
  }

  copyMovingItemToTemp(
    originalItem: TableOfContentItemVO,
    isSoftActionRoot: boolean,
    tocTree: TableOfContentItemVO[],
  ) {
    //create a clone of the original item to a item with moved attributes
    const moveToItem = cloneDeep(originalItem);
    moveToItem.id = SOFT_MOVE_PLACEHOLDER_ID_PREFIX + originalItem.id;
    moveToItem.originNumAttr = EC;
    moveToItem.softUserAttr = null;
    moveToItem.softDateAttr = null;
    moveToItem.trackChangeAction = LEOS_TC_DELETE_ACTION;
    moveToItem.softActionRoot = isSoftActionRoot;
    moveToItem.itemDepth = originalItem.itemDepth;
    moveToItem.softMoveTo = originalItem.id;
    moveToItem.softActionAttr = MOVE_TO;

    //set values on original item
    originalItem.softActionAttr = MOVE_FROM;
    originalItem.softActionRoot = isSoftActionRoot;
    originalItem.trackChangeAction = LEOS_TC_MOVE_ACTION;
    originalItem.softMoveFrom =
      SOFT_MOVE_PLACEHOLDER_ID_PREFIX + originalItem.id;
    return moveToItem;
  }

  deleteItem(newTree: TableOfContentItemVO[], item: TableOfContentItemVO) {
    if (this.documentConfig?.trackChangesEnabled) {
      softDeleteItem(newTree, item, LS);
    } else {
      this.removeNode(newTree, item);
    }
    const parent = findNodeById(newTree, item.parentItem);
    this.updateDepthOfTocItems(parent.childItems);
    this.setTree(newTree);
  }
}
