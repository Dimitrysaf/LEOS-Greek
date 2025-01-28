import {Injectable, OnDestroy} from '@angular/core';
import { EuiDialogConfig, EuiDialogService } from '@eui/components/eui-dialog';
import { getI18nState } from '@eui/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep, keys } from 'lodash-es';
import {BehaviorSubject, combineLatest, filter, Observable, Subject, take, takeUntil} from 'rxjs';

import {
  ARTICLE_TYPE_CHANGE_ACTION_ID,
  ARTICLE_TYPE_DEFINITION,
  ARTICLE_TYPE_REGULAR,
  CANCEL_MOVE_ID,
  CHAPTER_NUMBER_ARABIC,
  CHAPTER_NUMBER_CHANGE_ID,
  CHAPTER_NUMBER_ROMAN,
  DELETE_ACTION_ID,
  ITEM_NAME_ACTION_ID,
  MOVE_ACTION_ID,
  PART_NUMBER_CHANGE_ID,
  PART_NUMBER_ROMAN,
  PART_NUMBER_TEXTUTAL,
  PLACE_AFTER_ACTION_ID,
  PLACE_AS_CHILDREN_ACTION_ID,
  PLACE_BEFORE_ACTION_ID,
} from '@/features/akn-document/constants/inline-toc-actions.constants';
import { TableOfContentService } from '@/features/akn-document/services/table-of-content.service';
import { TableOfContentEditService } from '@/features/akn-document/services/table-of-content-edit.service';
import { ValidateTocService } from '@/features/akn-document/services/validate-node-drop.service';
import { DocumentConfig, NumberingType } from '@/shared';
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
  getNumberingTypeByLanguage,
  isDeletableItem,
  isDeletedItem,
  isMoveToItem,
  isUndeletableItem,
} from '@/shared/utils/toc.utils';
import { DropdownModel } from '@/shared/dropdown.model';
import {CoEditionVO} from "@/shared/models/coEditionVO.model";

@Injectable()
export abstract class TocInlineEditMenuService implements OnDestroy {
  public items$: Observable<DropdownModel[]>;
  public documentConfig: DocumentConfig;
  public selectedNodeToMove: TableOfContentItemVO;
  private destroy$ = new Subject<void>();

  private heading: string;
  private previousHeading: string;
  private previousType: string;
  private isReadyToMove = false;

  private itemsBS = new BehaviorSubject<DropdownModel[]>([]);
  private targetNodeBS = new BehaviorSubject<TableOfContentItemVO>(null);
  private documentConfigBS = new BehaviorSubject<DocumentConfig>(null);
  private coEditionForDocumentId: Record<string, CoEditionVO[]>;

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
    this.coEditionService.getDocCoEditionInfo()
      .pipe(takeUntil(this.destroy$))
      .subscribe((coEdits: Record<string, CoEditionVO[]>) => {
        this.coEditionForDocumentId = coEdits;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    if (
      getNumberingTypeByLanguage(tocItem, this.documentConfig.langGroup) ===
      BULLET_NUM
    ) {
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
  ): DropdownModel[];

   protected setIsGoingToMove(
     isReady: boolean,
     selectedNode: TableOfContentItemVO,
   ) {
     if (this.isReadyToMove !== isReady) {
       this.isReadyToMove = isReady;
       this.selectedNodeToMove = selectedNode;
     }
   }

  protected buildArticleItem(node: TableOfContentItemVO): DropdownModel {
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

  private flatten(
    tableOfContentItemVO: TableOfContentItemVO[],
  ): TableOfContentItemVO[] {
    return tableOfContentItemVO.flatMap((tableOfContentItemVO) => [
      tableOfContentItemVO,
      ...(tableOfContentItemVO.childItems
        ? this.flatten(tableOfContentItemVO.childItems)
        : []),
    ]);
  }

  protected buildChapterItem(node: TableOfContentItemVO): DropdownModel {
    const initialToc = this.tocService.returnInitialToc();
    const initialTocChapterVos =
      initialToc != null
        ? this.flatten(
            initialToc.filter(
              (obj) =>
                obj.tocItem.aknTag === 'BODY' ||
                obj.tocItem.aknTag === MAIN_BODY,
            )[0].childItems,
          ).filter((obj) => obj.tocItem.aknTag === node.tocItem.aknTag)
        : null;
    const toc = this.tocService.getCurrentToc();
    const chapterTocVos = this.flatten(
      toc.filter(
        (obj) =>
          obj.tocItem.aknTag === 'BODY' || obj.tocItem.aknTag === MAIN_BODY,
      )[0].childItems,
    ).filter((obj) => obj.tocItem.aknTag === node.tocItem.aknTag);
    const itemWithNumType =
      chapterTocVos != null
        ? chapterTocVos.find((value) => value.numberingType != null)
        : null;
    const numType =
      itemWithNumType != null ? itemWithNumType.numberingType : null;
    const initialItemWithNumType =
      initialTocChapterVos != null
        ? initialTocChapterVos.find((value) => value.numberingType != null)
        : null;
    const initialNumType =
      initialItemWithNumType != null
        ? initialItemWithNumType.numberingType
        : null;
    node.numberingType = numType;
    return {
      id: CHAPTER_NUMBER_CHANGE_ID,
      label: this.translateService.instant(
        'toc.edit.window.item.list.type.change.numbering',
      ),
      children: [
        {
          id: CHAPTER_NUMBER_ROMAN,
          label: this.translateService.instant(
            'toc.edit.window.item.regular.chapter.num.roman',
          ),
          disabled:
            node.tocItem.aknTag === 'CHAPTER' &&
            node.numberingType === 'ROMAN_UPPER',
          command: () =>
            this.handleHighSubdivChangeNumbering(
              'ROMAN_UPPER',
              initialNumType,
              toc,
              chapterTocVos,
              initialTocChapterVos,
            ),
        },
        {
          id: CHAPTER_NUMBER_ARABIC,
          label: this.translateService.instant(
            'toc.edit.window.item.regular.chapter.num.arabic',
          ),
          disabled:
            node.tocItem.aknTag === 'CHAPTER' &&
            node.numberingType === 'HIGHER_ELEMENT_NUM',
          command: () =>
            this.handleHighSubdivChangeNumbering(
              'HIGHER_ELEMENT_NUM',
              initialNumType,
              toc,
              chapterTocVos,
              initialTocChapterVos,
            ),
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
      this.documentConfig.langGroup,
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

  protected handleHighSubdivChangeNumbering(
    numberingType: NumberingType,
    initialNumType: NumberingType,
    toc: TableOfContentItemVO[],
    tocVOs: TableOfContentItemVO[],
    initialTocChapterVos: TableOfContentItemVO[],
  ) {
    this.tocEditService.handleNodeChanges(toc, true);
    for (const tocVO of tocVOs) {
      if (initialNumType === numberingType) {
        const sameIdChapterVO = initialTocChapterVos.find(
          (item) => item.id === tocVO.id,
        );
        if (sameIdChapterVO != null) {
          tocVO.number = sameIdChapterVO.number;
        }
      } else {
        tocVO.numberingToggled = true;
        tocVO.number = '#';
      }
      tocVO.numberingType = numberingType;
    }
    this.tocEditService.handleNodeChanges(toc);
  }

  private buildCommonItems(node: TableOfContentItemVO): DropdownModel[] {
    return [
      this.buildItemNameItem(node),
      this.buildMoveItem(node),
      this.buildDeleteItem(node),
    ];
  }

  private buildItemNameItem(node: TableOfContentItemVO): DropdownModel {
    return {
      id: ITEM_NAME_ACTION_ID,
      label: this.getDisplayableTocItem(node.tocItem),
      disabled: true,
    };
  }

  private buildDeleteItem(node: TableOfContentItemVO): DropdownModel {
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
    let isDeleteDisabled = (
      node.tocItem.deletable &&
      (deletedItem ? isUndeletableItem(toc, node) : isDeletableItem(toc, node))
    );
    isDeleteDisabled &&= !this.isNodeCoEdited(node);
    return  isDeleteDisabled ;

  }

  private isNodeCoEdited(node: TableOfContentItemVO){
    let result = keys(this.coEditionForDocumentId).includes(node.id);
    if(!result){
      result =  keys(this.coEditionForDocumentId).some(
        (key) =>
          !document.querySelector(`[data-id="${key}"]`)
          && !!document.querySelector(`#${node.id}`)
          && Array.from(document.querySelector(`#${node.id}`).children)
            .some((child) => child.matches(`#${key}`) )
      );
    }
    return result;
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
           //co edition dialog
          this.dialogService.openDialog({
            title: this.translateService.instant(
              'page.editor.co-edition-detected.title',
            ),
            bodyComponent: {
              component: CoEditionDetectedDialogComponent,
              config: {
                coEditionAction: 'EDIT_TOC'
              }
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

  private buildMoveItem(selectedNode: TableOfContentItemVO): DropdownModel {
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

  private buildMovePlaceBeforeItem(node: TableOfContentItemVO): DropdownModel {
    return {
      id: PLACE_BEFORE_ACTION_ID,
      label: this.translateService.instant(
        'page.editor.toc.move-actions.place-before',
      ),
      command: () => this.handlePlaceAt(node, 'BEFORE'),
    };
  }

  private buildMovePlaceAfterItem(node: TableOfContentItemVO): DropdownModel {
    return {
      id: PLACE_AFTER_ACTION_ID,
      label: this.translateService.instant(
        'page.editor.toc.move-actions.place-after',
      ),
      command: () => this.handlePlaceAt(node, 'AFTER'),
    };
  }

  private buildMoveAsChildrenItem(node: TableOfContentItemVO): DropdownModel {
    return {
      id: PLACE_AS_CHILDREN_ACTION_ID,
      label: this.translateService.instant(
        'page.editor.toc.move-actions.place-child',
      ),
      command: () => this.handlePlaceAt(node, 'AS_CHILDREN'),
    };
  }

  private buildCancelItem(node: TableOfContentItemVO): DropdownModel {
    return {
      id: CANCEL_MOVE_ID,
      label: this.translateService.instant('Cancel'),
      command: () => this.onCancelMove(),
    };
  }

  private onCancelMove() {
   // this.setIsGoingToMove(false, null);
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
