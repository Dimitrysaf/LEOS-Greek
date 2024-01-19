import { Injectable } from '@angular/core';
import { EuiDialogService } from '@eui/components/eui-dialog';
import { EuiDropdownButtonMenuItem } from '@eui/components/eui-dropdown-button-menu';
import { getI18nState } from '@eui/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash-es';
import { BehaviorSubject, combineLatest, filter, Observable, take } from 'rxjs';

import {
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
import { ConfirmDeleteDialogComponent } from '@/shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import {
  BULLET_NUM,
  CROSSHEADING,
  DELETE,
  LEOS_TC_DELETE_ACTION,
  MAIN_BODY,
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
  public documentConfigBS = new BehaviorSubject<DocumentConfig>(null);
  public items$: Observable<EuiDropdownButtonMenuItem[]>;
  public isReady$: Observable<boolean>;
  public documentConfig: DocumentConfig;
  public selectedNodeToMove: TableOfContentItemVO;

  private typeSpecificItems: EuiDropdownButtonMenuItem[] = [];
  private commonItems: EuiDropdownButtonMenuItem[] = [];
  private heading: string;
  private previousHeading: string;
  private previousType: string;

  private itemsBS = new BehaviorSubject<EuiDropdownButtonMenuItem[]>([]);
  private targetNodeBS = new BehaviorSubject<TableOfContentItemVO>(null);
  private readyBS = new BehaviorSubject<boolean>(null);

  private deleteDialog: ConfirmDeleteDialogComponent;
  private isReadyToMove = false;

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
    combineLatest([this.targetNodeBS, this.store.select(getI18nState)])
      .pipe(filter(([node]) => node !== null))
      .subscribe(([targetNode, state]) => {
        this.updateDropdownItems(targetNode);
      });

    this.readyBS
      .asObservable()
      .pipe(filter((node) => node !== null))
      .subscribe((node) => {
        this.setIsGoingToMove(node, null);
      });

    this.isReady$ = this.readyBS.asObservable();
    this.items$ = this.itemsBS.asObservable();

    this.documentConfigBS.subscribe((config) => {
      this.documentConfig = config;
    });
  }

  protected abstract getItems(
    node: TableOfContentItemVO,
  ): EuiDropdownButtonMenuItem[];

  protected abstract updateTypeSpecificItems(
    type: TableOfContentItemVO,
  ): EuiDropdownButtonMenuItem[];

  public setDocumentConfigBS(dConfig: DocumentConfig): void {
    this.documentConfigBS.next(dConfig);
  }

  setViewChild(ref: any) {
    this.deleteDialog = ref;
  }

  public getTargetNode() {
    return this.targetNodeBS.value;
  }

  public setTargetNode(node: TableOfContentItemVO) {
    this.targetNodeBS.next(node);
  }

  public setIsGoingToMove(
    isReady: boolean,
    selectedNode: TableOfContentItemVO,
  ) {
    this.isReadyToMove = isReady;
    this.selectedNodeToMove = selectedNode;
    this.readyBS.next(isReady);
  }

  getDisplayableTocItem(tocItem: TocItem): string {
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

  protected updateDropdownItems(selectedNode: TableOfContentItemVO) {
    if (!this.isReadyToMove) {
      this.commonItems = [
        {
          id: MOVE_ACTION_ID,
          label: this.translateService.instant(
            'page.editor.toc.move-actions.move',
          ),
          iconClass: null,
          command: () => this.setIsGoingToMove(true, selectedNode),
        },
        {
          id: ITEM_NAME_ACTION_ID,
          label: this.getDisplayableTocItem(selectedNode.tocItem),
          iconClass: null,
          disabled: true,
        },
        {
          id: DELETE_ACTION_ID,
          label: this.getDeleteButtonLabel(selectedNode),
          iconClass: null,
          disabled: !this.isDeleteButtonDisabled(selectedNode),
          command: () => this.handleNodeDeletion(selectedNode),
        },
      ];
      this.typeSpecificItems = this.updateTypeSpecificItems(selectedNode);
      this.itemsBS.next([...this.commonItems, ...this.typeSpecificItems]);
    } else {
      this.moveItems(selectedNode);
      this.itemsBS.next(this.commonItems);
    }
  }

  protected handleArticleTypeChange(newType: string) {
    const selectedNode = this.targetNodeBS.value;
    const toc = this.tocService.getCurrentToc();
    const tocItems = this.tocService.getCurrentTocItems();
    const oldHeading = this.heading;
    const oldValue = selectedNode.tocItemType;
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
      this.onTocDeleteWithChildren();
      this.deleteDialog.deleteDialog.accept.pipe(take(1)).subscribe(() => {
        this.deleteItem(newTree, item);
      });
    } else {
      this.deleteItem(newTree, item);
    }
  }

  private onTocDeleteWithChildren() {
    this.deleteDialog.deleteDialog.openDialog();
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

  private onCancelMove() {
    this.setIsGoingToMove(false, null);
  }

  private moveItems(selectedNode: TableOfContentItemVO) {
    this.commonItems = [
      {
        id: PLACE_BEFORE_ACTION_ID,
        label: this.translateService.instant(
          'page.editor.toc.move-actions.place-before',
        ),
        iconClass: null,
        command: () => this.handlePlaceAt(selectedNode, 'BEFORE'),
      },
      {
        id: PLACE_AS_CHILDREN_ACTION_ID,
        label: this.translateService.instant(
          'page.editor.toc.move-actions.place-child',
        ),
        iconClass: null,
        command: () => this.handlePlaceAt(selectedNode, 'AS_CHILDREN'),
      },
      {
        id: PLACE_AFTER_ACTION_ID,
        label: this.translateService.instant(
          'page.editor.toc.move-actions.place-after',
        ),
        iconClass: null,
        command: () => this.handlePlaceAt(selectedNode, 'AFTER'),
      },
      {
        id: CANCEL_MOVE_ID,
        label: this.translateService.instant('Cancel'),
        iconClass: null,
        command: () => this.onCancelMove(),
      },
    ];
  }
}
