import { Injectable } from '@angular/core';
import { EuiDialogConfig, EuiDialogService } from '@eui/components/eui-dialog';
import { EuiDropdownButtonMenuItem } from '@eui/components/eui-dropdown-button-menu';
import { getI18nState } from '@eui/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash-es';
import { BehaviorSubject, combineLatest, filter, Observable, take } from 'rxjs';

import {
  ARTICLE_TYPE_CHANGE_ACTION_ID,
  ARTICLE_TYPE_DEFINITION,
  ARTICLE_TYPE_REGULAR,
  CANCEL_MOVE_ID,
  DELETE_ACTION_ID,
  ITEM_NAME_ACTION_ID,
  MOVE_ACTION_ID,
  PLACE_AFTER_ACTION_ID,
  PLACE_AS_CHILDREN_ACTION_ID,
  PLACE_BEFORE_ACTION_ID,
} from '@/features/akn-document/constants/inline-toc-actions.constants';
import { TableOfContentService } from '@/features/akn-document/services/table-of-content.service';
import { TableOfContentEditService } from '@/features/akn-document/services/table-of-content-edit.service';
import { ValidateTocService } from '@/features/akn-document/services/validate-node-drop.service';
import { DocumentConfig } from '@/shared';
import { CoEditionDetectedDialogComponent } from '@/shared/components/co-edition-detected-dialog/co-edition-detected-dialog.component';
import {
  BULLET_NUM,
  CROSSHEADING,
  DELETE,
  LEOS_TC_DELETE_ACTION,
  MAIN_BODY,
  MOVE_FROM,
  MOVE_TO,
} from '@/shared/constants';
import { TableOfContentItemVO, TocItem } from '@/shared/models/toc.model';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';
import {
  checkDeleteOnLastItemInList,
  checkIfConfirmDeletion,
  convertArticle,
  findNodeById,
  isDeletableItem,
  isDeletedItem,
  isMoveToItem,
  isUndeletableItem,
} from '@/shared/utils/toc.utils';

@Injectable()
export abstract class TocInlineEditMenuService {
  public items$: Observable<EuiDropdownButtonMenuItem[]>;
  public documentConfig: DocumentConfig;
  public selectedNodeToMove: TableOfContentItemVO;

  private heading: string;
  private previousHeading: string;
  private previousType: string;
  private isReadyToMove = false;

  private itemsBS = new BehaviorSubject<EuiDropdownButtonMenuItem[]>([]);
  private targetNodeBS = new BehaviorSubject<TableOfContentItemVO>(null);
  private documentConfigBS = new BehaviorSubject<DocumentConfig>(null);

  protected constructor(
    protected store: Store<any>,
    protected dialogService: EuiDialogService,
    protected validateTocService: ValidateTocService,
    protected tocEditService: TableOfContentEditService,
    protected coEditionService: CoEditionServiceWS,
    protected translateService: TranslateService,
    protected tocService: TableOfContentService,
    protected documentService: DocumentService,
  ) {
    combineLatest([
      this.targetNodeBS,
      this.store.select(getI18nState),
      this.documentService.documentConfig$,
    ])
      .pipe(filter(([node]) => node !== null))
      .subscribe(([targetNode, state, documentConfig]) => {
        this.documentConfig = documentConfig;
        this.updateDropdownItems(targetNode);
      });

    this.items$ = this.itemsBS.asObservable();
  }

  public setDocumentConfig(documentConfig: DocumentConfig) {
    this.documentConfigBS.next(documentConfig);
  }

  public getTargetNode() {
    return this.targetNodeBS.value;
  }

  public setTargetNode(node: TableOfContentItemVO) {
    this.targetNodeBS.next(node);
  }

  public getDisplayableTocItem(tocItem: TocItem): string {
    if (tocItem.numberingType === BULLET_NUM) {
      return this.translateService.instant('toc.item.type.bullet');
    }
    if (tocItem.aknTag === MAIN_BODY) {
      return this.translateService.instant('toc.item.type.mainbody');
    }
    if (tocItem.aknTag === CROSSHEADING) {
      return this.translateService.instant('toc.item.type.crossheading');
    }
    return this.translateService.instant(
      'toc.item.type.' + tocItem.aknTag.toLowerCase(),
    );
  }

  protected abstract buildTypeSpecificItems(
    type: TableOfContentItemVO,
  ): EuiDropdownButtonMenuItem[];

  protected setIsGoingToMove(
    isReady: boolean,
    selectedNode: TableOfContentItemVO,
  ) {
    if (this.isReadyToMove !== isReady) {
      this.isReadyToMove = isReady;
      this.selectedNodeToMove = selectedNode;
    }
  }

  protected buildArticleItem(
    node: TableOfContentItemVO,
  ): EuiDropdownButtonMenuItem {
    return {
      id: ARTICLE_TYPE_CHANGE_ACTION_ID,
      label: this.translateService.instant(
        'toc.edit.window.item.list.type.change',
      ),
      children: [
        {
          id: ARTICLE_TYPE_REGULAR,
          label: this.translateService.instant(
            'toc.edit.window.item.regular.article.type',
          ),
          disabled: node.tocItemType === 'REGULAR',
          command: () => this.handleArticleTypeChange('REGULAR'),
        },
        {
          id: ARTICLE_TYPE_DEFINITION,
          label: this.translateService.instant(
            'toc.edit.window.item.definition.article.type',
          ),
          disabled: node.tocItemType === 'DEFINITION',
          command: () => this.handleArticleTypeChange('DEFINITION'),
        },
      ],
    };
  }

  protected updateDropdownItems(selectedNode: TableOfContentItemVO) {
    if (!this.isReadyToMove) {
      this.itemsBS.next([
        ...this.buildCommonItems(selectedNode),
        ...this.buildTypeSpecificItems(selectedNode),
      ]);
      this.isDeletedOrMoved(selectedNode);
    } else {
      this.itemsBS.next([...this.buildMoveItems(selectedNode)]);
    }
  }

  protected handleArticleTypeChange(newType: string) {
    const selectedNode = this.targetNodeBS.value;
    const toc = this.tocService.getCurrentToc();
    const tocItems = this.tocService.getCurrentTocItems();
    const oldHeading = this.heading;
    const oldValue = selectedNode.tocItemType;
    // Get the maxDepth for list
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(
      selectedNode.node.toString(),
      'application/xml',
    );
    const currentMaxDepth = this.getMaxDepth(xmlDoc);
    const pointConfig = this.documentConfig.numberingConfig.find(
      (obj) =>
        (newType.toUpperCase() === 'REGULAR'
          ? 'POINT_NUM'
          : newType.toUpperCase() === 'DEFINITION'
          ? 'POINT_NUM_DEF'
          : '') === obj.type,
    );
    const allowedDepth = pointConfig.levels.levels.length;

    if (currentMaxDepth > allowedDepth) {
      return this.dialogService.openDialog({
        title: this.translateService.instant(
          'page.editor.article.convert.depth.warning.title',
          {
            newType,
            currentMaxDepth,
            allowedDepth,
          },
        ),
        typeClass: 'warning',
        hasDismissButton: false,
        content: this.translateService.instant(
          'page.editor.article.convert.depth.warning.content',
          {
            newType,
            currentMaxDepth,
            allowedDepth,
          },
        ),
        accept: () => null,
        acceptLabel: this.translateService.instant('global.actions.close'),
      });
    }
    //save snapshot of old tree
    this.tocEditService.handleNodeChanges(toc, true);
    selectedNode.tocItemType = newType;
    convertArticle(
      tocItems,
      selectedNode,
      oldValue.toUpperCase(),
      newType.toUpperCase(),
    );
    if (
      this.previousType &&
      this.previousType.toLowerCase() === newType.toLowerCase()
    ) {
      selectedNode.isAffected = false;
      if (oldHeading !== '') {
        this.heading = this.previousHeading;
        selectedNode.heading = this.heading;
      } else {
        this.heading = this.translateService.instant(
          'toc.item.type.' +
            selectedNode.tocItemType.toLowerCase() +
            '.article.heading',
        );
        selectedNode.heading = this.heading;
      }
    } else {
      selectedNode.isAffected = false;
      this.heading = this.translateService.instant(
        'toc.item.type.' +
          selectedNode.tocItemType.toLowerCase() +
          '.article.heading',
      );
      selectedNode.heading = this.heading;
    }
    this.previousType = oldValue;
    this.previousHeading = oldHeading;
    this.tocEditService.handleNodeChanges(toc);
  }

  private buildCommonItems(
    node: TableOfContentItemVO,
  ): EuiDropdownButtonMenuItem[] {
    return [
      this.buildItemNameItem(node),
      this.buildMoveItem(node),
      this.buildDeleteItem(node),
    ];
  }

  private buildItemNameItem(
    node: TableOfContentItemVO,
  ): EuiDropdownButtonMenuItem {
    return {
      id: ITEM_NAME_ACTION_ID,
      label: this.getDisplayableTocItem(node.tocItem),
      disabled: true,
    };
  }

  private buildDeleteItem(
    node: TableOfContentItemVO,
  ): EuiDropdownButtonMenuItem {
    return {
      id: DELETE_ACTION_ID,
      label: this.getDeleteButtonLabel(node),
      disabled: !this.isDeleteButtonDisabled(node),
      command: () => this.handleNodeDeletion(node),
    };
  }

  private isDeleteButtonDisabled(node: TableOfContentItemVO) {
    const toc = this.tocService.getCurrentToc();
    const deletedItem = isDeletedItem(node) || isMoveToItem(node);
    return (
      node.tocItem.deletable &&
      (deletedItem ? isUndeletableItem(toc, node) : isDeletableItem(toc, node))
    );
  }

  private getDeleteButtonLabel(node: TableOfContentItemVO) {
    const deletedItem = isDeletedItem(node) || isMoveToItem(node);
    return deletedItem
      ? this.translateService.instant('global.actions.undelete')
      : this.translateService.instant('global.actions.delete');
  }

  private handleNodeDeletion(targetNode: TableOfContentItemVO) {
    const currentTree = this.tocService.getCurrentToc();
    const newTree = cloneDeep(currentTree);
    const item = findNodeById(newTree, targetNode.id);
    const parentItem: TableOfContentItemVO = checkDeleteOnLastItemInList(
      newTree,
      item,
    );
    if (item) {
      if (item.softActionAttr === DELETE) {
        this.tocEditService.setTreeHistory(currentTree);
        this.tocEditService.undeleteItem(newTree, item);
      } else {
        if (this.coEditionService.checkForCoEdition('EDIT_TOC')) {
          // co edition dialog
          this.dialogService.openDialog({
            title: this.translateService.instant(
              'page.editor.co-edition-detected.title',
            ),
            bodyComponent: {
              component: CoEditionDetectedDialogComponent,
            },
            accept: () => this.deleteWithConfirmationCheck(newTree, item),
          });
        } else {
          this.dialogService.openDialog({
            title: this.translateService.instant(
              'page.editor.element-delete-dialog.title',
            ),
            content: this.translateService.instant(
              'page.editor.element-delete-dialog.body',
            ),
            accept: () => this.deleteWithConfirmationCheck(newTree, item),
          });
        }
      }
    }
  }

  private deleteWithConfirmationCheck(
    newTree: TableOfContentItemVO[],
    item: TableOfContentItemVO,
  ) {
    if (checkIfConfirmDeletion(newTree, item)) {
      this.onTocDeleteWithChildren(newTree, item);
    } else {
      this.deleteItem(newTree, item);
    }
  }

  private openDeleteDialog(
    newTree: TableOfContentItemVO[],
    item: TableOfContentItemVO,
  ) {
    this.dialogService.openDialog(
      new EuiDialogConfig({
        dialogId: 'delete-dialog-id',
        title: this.translateService.instant(
          'toc.edit.window.item.selected.delete-dialog.title',
        ),
        content: this.translateService.instant(
          'toc.edit.window.item.selected.delete-dialog.desc',
        ),
        acceptLabel: this.translateService.instant('global.actions.delete'),
        typeClass: 'danger',
        accept: () => this.deleteItem(newTree, item),
      }),
    );
  }

  private onTocDeleteWithChildren(
    newTree: TableOfContentItemVO[],
    item: TableOfContentItemVO,
  ) {
    this.openDeleteDialog(newTree, item);
  }

  private deleteItem(
    newTree: TableOfContentItemVO[],
    item: TableOfContentItemVO,
  ) {
    const currentTree = this.tocService.getCurrentToc();
    item.trackChangeAction = LEOS_TC_DELETE_ACTION;
    this.tocEditService.setTreeHistory(currentTree);
    this.tocEditService.deleteItem(newTree, item);
    this.tocEditService.setTree(newTree);
  }

  private handlePlaceAt(nodeTarget: TableOfContentItemVO, position: string) {
    const nodeTargetParent = findNodeById(
      this.tocService.getCurrentToc(),
      nodeTarget.parentItem,
    );
    this.validateAndMove(
      this.selectedNodeToMove,
      nodeTarget,
      nodeTargetParent,
      position,
    );
    this.setIsGoingToMove(false, null);
  }

  private validateAndMove(
    nodeDragged: TableOfContentItemVO,
    nodeTarget: TableOfContentItemVO,
    parentNode: any,
    position: string,
    isAdd: boolean = false,
  ) {
    const ref = this.tocService.documentRefAndCategoryBS.value.ref;
    const category = this.tocService.documentRefAndCategoryBS.value.category;

    this.validateTocService.validateNodeDrop(
      this.tocService.getCurrentToc(),
      parentNode,
      nodeTarget,
      nodeDragged,
      [nodeDragged.id],
      nodeDragged.tocItem.aknTag,
      nodeTarget.id,
      nodeTarget.tocItem.aknTag,
      parentNode.id,
      parentNode.tocItem.aknTag,
      position,
      category,
      ref,
    );
  }

  private buildMoveItem(
    selectedNode: TableOfContentItemVO,
  ): EuiDropdownButtonMenuItem {
    return {
      id: MOVE_ACTION_ID,
      label: this.translateService.instant('page.editor.toc.move-actions.move'),
      command: () => this.setIsGoingToMove(true, selectedNode),
    };
  }

  private buildMoveItems(selectedNode: TableOfContentItemVO) {
    return [
      this.isReadyToMove && this.buildMovePlaceBeforeItem(selectedNode),
      this.isReadyToMove && this.buildMoveAsChildrenItem(selectedNode),
      this.isReadyToMove && this.buildMovePlaceAfterItem(selectedNode),
      this.isReadyToMove && this.buildCancelItem(selectedNode),
    ];
  }

  private buildMovePlaceBeforeItem(
    node: TableOfContentItemVO,
  ): EuiDropdownButtonMenuItem {
    return {
      id: PLACE_BEFORE_ACTION_ID,
      label: this.translateService.instant(
        'page.editor.toc.move-actions.place-before',
      ),
      command: () => this.handlePlaceAt(node, 'BEFORE'),
    };
  }

  private buildMovePlaceAfterItem(
    node: TableOfContentItemVO,
  ): EuiDropdownButtonMenuItem {
    return {
      id: PLACE_AFTER_ACTION_ID,
      label: this.translateService.instant(
        'page.editor.toc.move-actions.place-after',
      ),
      command: () => this.handlePlaceAt(node, 'AFTER'),
    };
  }

  private buildMoveAsChildrenItem(
    node: TableOfContentItemVO,
  ): EuiDropdownButtonMenuItem {
    return {
      id: PLACE_AS_CHILDREN_ACTION_ID,
      label: this.translateService.instant(
        'page.editor.toc.move-actions.place-child',
      ),
      command: () => this.handlePlaceAt(node, 'AS_CHILDREN'),
    };
  }

  private buildCancelItem(
    node: TableOfContentItemVO,
  ): EuiDropdownButtonMenuItem {
    return {
      id: CANCEL_MOVE_ID,
      label: this.translateService.instant('Cancel'),
      command: () => this.onCancelMove(),
    };
  }

  private onCancelMove() {
    this.setIsGoingToMove(false, null);
  }

  private isDeletedOrMoved(selectedNode: TableOfContentItemVO) {
    if (this.isMovedNode(selectedNode) || isDeletedItem(selectedNode)) {
      const value = this.itemsBS.value.filter(
        (item) => item.id !== MOVE_ACTION_ID,
      );
      this.itemsBS.next(value);
    }
  }

  private isMovedNode(node: TableOfContentItemVO) {
    return (
      node.softActionRoot && [MOVE_TO, MOVE_FROM].includes(node.softActionAttr)
    );
  }

  private getMaxDepth(element, currentDepth = 0) {
    let maxDepth = currentDepth;

    // Check if the element has child nodes
    if (element.childNodes && element.childNodes.length > 0) {
      for (const childNode of element.childNodes) {
        // Check if the child node is an element node
        if (childNode.nodeType === 1) {
          // Check if the element is a <list> element
          if (childNode.nodeName === 'list') {
            // Recursively calculate the depth for each child <list> element
            const childDepth = this.getMaxDepth(childNode, currentDepth + 1);

            // Update maxDepth if the childDepth is greater
            maxDepth = Math.max(maxDepth, childDepth);
          } else {
            // Recursively continue traversal for other elements
            const childDepth = this.getMaxDepth(childNode, currentDepth);

            // Update maxDepth if the childDepth is greater
            maxDepth = Math.max(maxDepth, childDepth);
          }
        }
      }
    }

    return maxDepth;
  }
}
