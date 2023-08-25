import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { apiBaseUrl } from 'src/config';

import { DocumentConfig } from '@/shared';
import {
  NodeValidation,
  NodeValidationResponse,
} from '@/shared/models/drop-response.model';
import { TableOfContentItemVO, TocItem } from '@/shared/models/toc.model';
import {
  getActualTargetItem,
  isCrossheading,
  isDroppedOnPointOrIndent,
  isSourceDivision,
} from '@/shared/utils/toc.utils';
import { isTocItemsEqual } from '@/shared/utils/tocRules.utils';

Injectable();
export abstract class ValidateTocService {
  dropValidationResult$: Observable<NodeValidation>;

  private dropValidationResultBS: BehaviorSubject<NodeValidation> =
    new BehaviorSubject(null);
  private documentConfigBS: BehaviorSubject<DocumentConfig> =
    new BehaviorSubject(null);

  constructor(private http: HttpClient) {
    this.dropValidationResult$ = this.dropValidationResultBS.asObservable();
  }

  public validateNodeDrop(
    treeData: TableOfContentItemVO[],
    parentNode: TableOfContentItemVO,
    nodeTarget: TableOfContentItemVO,
    nodeDragged: TableOfContentItemVO,
    draggedNodeId: string[],
    draggedNodeTagName: string,
    targetNodeId: string,
    targetNodeTagName: string,
    parentNodeId: string,
    parentNodeTagName: string,
    position: string,
    documentType: string,
    documentRef: string,
  ) {
    this.requestNodeDropValidation(
      draggedNodeId,
      draggedNodeTagName,
      targetNodeId,
      targetNodeTagName,
      parentNodeId,
      parentNodeTagName,
      position,
      documentType,
      documentRef,
    ).subscribe((response) => {
      if (response.result.success) {
        if (position === 'AS_CHILDREN') {
          const validationResult: NodeValidation = {
            success: true,
            targetItem: nodeTarget,
            sourceItem: nodeDragged,
            messageKey: 'toc.edit.window.drop.success.message',
          };
          const resultOfValidation = this.validateAddingItemAsChildOrSibling(
            validationResult,
            nodeDragged,
            nodeTarget,
            treeData,
            parentNode,
            position,
          );
          this.dropValidationResultBS.next(validationResult);
          return;
        }
        this.dropValidationResultBS.next(response.result);
      } else this.dropValidationResultBS.next(response.result);
    });
  }

  public setDocumentConfig(documentConfig: DocumentConfig) {
    this.documentConfigBS.next(documentConfig);
  }

  public validateAddingItemAsChildOrSibling(
    validationResult: NodeValidation,
    sourceItem: TableOfContentItemVO,
    targetItem: TableOfContentItemVO,
    tocTree: TableOfContentItemVO[],
    parentItem: TableOfContentItemVO,
    position: string,
  ): boolean {
    const targetTocItem = targetItem.tocItem;
    const targetRules = [
      targetTocItem.aknTag.toUpperCase(),
      targetTocItem.numberingType.toUpperCase(),
    ].join('_');
    const targetTocItems: TocItem[] =
      this.documentConfigBS.value.tocRules[targetRules];

    if (
      isSourceDivision(sourceItem) ||
      isCrossheading(sourceItem) ||
      isDroppedOnPointOrIndent(sourceItem, targetItem) ||
      sourceItem.tocItem.aknTag === targetItem.tocItem.aknTag
    ) {
      const actualTargetItem = getActualTargetItem(
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
    //TODO : Add toc rules current problem rules are of type -> Map<TocItem,List<TocItem>> this cant't be parsed as json , and because some values have the same toc item key (aknTag) we can't map them by this identifier
    else if (
      targetTocItems?.length > 0 &&
      targetTocItems.some((item) => isTocItemsEqual(item, sourceItem.tocItem))
    ) {
      //If target item type is root, source item will be added as child, else validate dropping item at dragged location
      const actualTargetItem = getActualTargetItem(
        sourceItem,
        targetItem,
        parentItem,
        position,
        false,
      );
      return (
        // isRootElement(targetItem) ||
        this.validateAddingToActualTargetItem(
          validationResult,
          sourceItem,
          targetItem,
          tocTree,
          actualTargetItem,
          position,
        )
      );
    } else {
      // If child elements not allowed in target validate adding it to its parent
      return this.validateAddingItemAsSibling(
        validationResult,
        sourceItem,
        targetItem,
        tocTree,
        parentItem,
        position,
      );
    }
  }

  private validateAddingToActualTargetItem = (
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

  private validateAddingItemAsSibling(
    validationResult: NodeValidation,
    sourceItem: TableOfContentItemVO,
    targetItem: TableOfContentItemVO,
    tocTree: TableOfContentItemVO[],
    parentItem: TableOfContentItemVO,
    position: string,
  ) {
    const actualTargetItem = getActualTargetItem(
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

  private validateMaxDepth(
    validationResult: NodeValidation,
    sourceItem: TableOfContentItemVO,
    targetItem: TableOfContentItemVO,
  ) {
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
  }

  abstract validateAddingToItem(
    validationResult: NodeValidation,
    sourceItem: TableOfContentItemVO,
    targetItem: TableOfContentItemVO,
    tocTree: TableOfContentItemVO[],
    actualTargetItem: TableOfContentItemVO,
    position: string,
  );

  private requestNodeDropValidation(
    draggedNodeId: string[],
    draggedNodeTagName: string,
    targetNodeId: string,
    targetNodeTagName: string,
    parentNodeId: string,
    parentNodeTagName: string,
    position: string,
    documentType: string,
    documentRef: string,
  ) {
    return this.http.post<NodeValidationResponse>(
      `${apiBaseUrl}/secured/toc/${documentRef}/validate-node-drop`,
      {
        draggedNodeId,
        draggedNodeTagName,
        targetNodeId,
        targetNodeTagName,
        parentNodeId,
        parentNodeTagName,
        position: position.toUpperCase(),
        documentRef,
        documentType: documentType.toUpperCase(),
      },
    );
  }
}
