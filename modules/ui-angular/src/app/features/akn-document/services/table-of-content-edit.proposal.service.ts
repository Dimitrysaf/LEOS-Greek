import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';

import {
  ADD,
  CN,
  DELETE,
  EC,
  LEOS_TC_DELETE_ACTION,
  LEOS_TC_INSERT_ACTION,
  LEOS_TC_MOVE_ACTION,
  LS,
  MOVE_FROM,
  MOVE_TO,
  SOFT_MOVE_PLACEHOLDER_ID_PREFIX,
} from '@/shared/constants';
import {
  HASH_NUM_VALUE,
  MOVED_TITLE_SPAN_START_TAG,
} from '@/shared/constants/toc.constant';
import { NodeValidation } from '@/shared/models/drop-response.model';
import { TableOfContentItemVO } from '@/shared/models/toc.model';
import { DocumentService } from '@/shared/services/document.service';
import { findNodeById, softDeleteItem } from '@/shared/utils/toc.utils';

import { TableOfContentService } from './table-of-content.service';
import { TableOfContentEditService } from './table-of-content-edit.service';

@Injectable()
export class TableOfContentProposalEditService extends TableOfContentEditService {
  constructor(
    protected tocService: TableOfContentService,
    protected documentService: DocumentService,
  ) {
    super(tocService, documentService);
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
      if (this.tocService.isClonedProposal) {
        sourceItem.originAttr = LS;
      }
      this.setNumber(tocTree, sourceItem, targetItem);
      if (this.tocService.isTrackChangesEnabled) {
        sourceItem.softActionAttr = ADD;
        sourceItem.trackChangeAction = LEOS_TC_INSERT_ACTION;
        sourceItem.softActionRoot = true;
      }
    } else {
      if (this.tocService.isTrackChangesEnabled) {
        this.handleMoveAction(sourceItem, tocTree);
      }
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
    if (
      (targetItem.softMoveTo || targetItem.softMoveFrom) &&
      (sourceItem.softMoveFrom || sourceItem.softMoveTo)
    )
      this.restoreOriginState(tocTree, sourceItem, targetItem, position);

    this.updateDepthOfTocItems(paretnNode?.childItems ?? []);
    this.resetUserInfo(sourceItem);
    this.setTree(tocTree);
  }

  public handleMoveAction(
    moveFromItem: TableOfContentItemVO,
    tocTree: TableOfContentItemVO[],
  ) {
    if (
      (!this.tocService.isClonedProposal ||
        (moveFromItem.originAttr !== null &&
          moveFromItem.originAttr.toLowerCase() === EC)) &&
      (moveFromItem.softActionAttr == null ||
        (!this.hasTocItemSoftAction(moveFromItem, MOVE_FROM) &&
          !this.hasTocItemSoftAction(moveFromItem, MOVE_TO) &&
          !this.hasTocItemSoftAction(moveFromItem, ADD) &&
          !this.hasTocItemSoftAction(moveFromItem, DELETE)))
    ) {
      const moveTemp = this.copyMovingItemToTemp(moveFromItem, true, tocTree);
      moveFromItem.originNumAttr = this.tocService.isClonedProposal ? LS : null;
      moveFromItem.softActionRoot = true;

      this.dropItemAtOriginalPosition(moveTemp, moveFromItem, tocTree);
    }
    moveFromItem.originNumAttr = this.tocService.isClonedProposal ? LS : null;
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
    moveToItem.originNumAttr = this.tocService.isClonedProposal ? EC : null;
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
    if (originalItem.number) {
      originalItem.number = HASH_NUM_VALUE;
    }
    return moveToItem;
  }

  deleteItem(newTree: TableOfContentItemVO[], item: TableOfContentItemVO) {
    if (this.tocService.isTrackChangesEnabled) {
      softDeleteItem(newTree, item, LS);
    } else {
      this.removeNode(newTree, item);
    }
    const parent = findNodeById(newTree, item.parentItem);
    this.updateDepthOfTocItems(parent.childItems);
    this.setTree(newTree);
  }

  restoreOriginState(
    tocTree: TableOfContentItemVO[],
    droppedItem: TableOfContentItemVO,
    newPosition: TableOfContentItemVO,
    position: string,
  ) {
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
    if (
      previousSibling &&
      previousSibling.id.startsWith(SOFT_MOVE_PLACEHOLDER_ID_PREFIX) &&
      previousSibling.elementNumberId.toString().substring(6) ===
        droppedItem.elementNumberId.toString()
    ) {
      this.checkAndRestore(droppedItem, previousSibling, tocTree, position);
    }
    if (
      nextSibling &&
      nextSibling.id.startsWith(SOFT_MOVE_PLACEHOLDER_ID_PREFIX) &&
      nextSibling.elementNumberId.toString().substring(6) ===
        droppedItem.elementNumberId.toString()
    ) {
      this.checkAndRestore(droppedItem, nextSibling, tocTree, position);
    }
  }

  private checkAndRestore(
    droppedItem: TableOfContentItemVO,
    sibling: TableOfContentItemVO,
    tocTree: TableOfContentItemVO[],
    prefix: string,
  ) {
    if (
      sibling &&
      sibling.id.substring(0, 6) === SOFT_MOVE_PLACEHOLDER_ID_PREFIX
    ) {
      this.resetDroppedItemProperties(droppedItem);
      this.removeNode(tocTree, sibling);
    }
  }

  private resetDroppedItemProperties(droppedItem: TableOfContentItemVO) {
    droppedItem.softActionAttr = null;
    droppedItem.softActionRoot = null;
    droppedItem.softMoveTo = null;
  }
}
