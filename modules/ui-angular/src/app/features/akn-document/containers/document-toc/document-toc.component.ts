import { CdkDragDrop, CdkDragEnter, CdkDragMove } from '@angular/cdk/drag-drop';
import { NestedTreeControl } from '@angular/cdk/tree';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { EuiDialogService } from '@eui/components/eui-dialog';
import { getUserDetails, UserDetails } from '@eui/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep, result, some, truncate, update } from 'lodash-es';
import { Subject, take, takeUntil } from 'rxjs';

import {
  ADD,
  ARTICLE,
  BULLET_NUM,
  CN,
  CONTENT_SEPARATOR,
  DELETE,
  DIVISION,
  EC,
  ELEMENTS_TO_BE_PROCESSED_FOR_NUMBERING,
  ELEMENTS_WITHOUT_CONTENT,
  HASH_NUM_VALUE,
  INDENT,
  LEVEL,
  LS,
  MOVE_FROM,
  MOVE_LABEL_SPAN_START_TAG,
  MOVE_TO,
  MOVED_LABEL_SIZE,
  MOVED_TITLE_SPAN_START_TAG,
  NUM_HEADING_SEPARATOR,
  PARAGRAPH,
  POINT,
  POINT_ROOT_PARENT_ELEMENTS,
  RESTORED,
  SOFT_MOVE_PLACEHOLDER_ID_PREFIX,
  SPACE,
  SPAN_END_TAG,
  SUBPARAGRAPH,
  TBLOCK,
  TEMP_PREFIX,
  TIME_TO_CLEAR_INVALID,
} from '@/shared/constants/toc.constant';
import { DocumentConfig } from '@/shared/models';
import { DragAction } from '@/shared/models/drag-action.model';
import {
  NodeValidation,
  NodeValidationResponse,
} from '@/shared/models/drop-response.model';
import { DocumentService } from '@/shared/services/document.service';
import { capitalizeFirstLetter } from '@/shared/utils/string.utils';
import {
  checkDeleteOnLastItemInList,
  checkPositionAfterValidation,
  checkPositionAfterValidationExplanatory,
  containsItem,
  containsItemOfOrigin,
  copyDeletedItemToTempForUndelete,
  getActualTargetItem,
  getItemSoftStyle,
  getTableOfContentItemVOById,
  handleLevelMove,
  hasTocItemSoftAction,
  isCrossheading,
  isDeletedItem,
  isDroppedOnPointOrIndent,
  isNodeLastElement,
  isNumbered,
  isRootElement,
  isSourceDivision,
  removeTag,
  setBlockOrCrossHeading,
  setItemDepth,
  setItemLevel,
  softDeleteItem,
  updateDepthOfTocItems,
  validateAddingToItem,
  validateMaxDepth,
} from '@/shared/utils/toc.utils';
import { isTocItemsEqual } from '@/shared/utils/tocRules.utils';

import {
  TableOfContentItemVO,
  TocItem,
} from '../../../../shared/models/toc.model';
import { TableOfContentService } from '../../services/tableOfContent.service';

@Component({
  selector: 'app-document-toc',
  templateUrl: './document-toc.component.html',
  styleUrls: ['./document-toc.component.scss'],
})
export class DocumentTocComponent implements OnInit, OnDestroy {
  @Input() isEdit: boolean;
  @Input() documentType: string;
  @Input() documentRef: string;
  @Input() versionId: string;
  @Input() tocItems: TocItem[];
  @Output() reBuildTocItems: EventEmitter<boolean> = new EventEmitter();

  documentConfig: DocumentConfig;
  user: UserDetails;

  //toc related
  selectedNode: TableOfContentItemVO = null;
  selectedNodeToMove: TableOfContentItemVO = null;
  isToCDraft: boolean;
  messageFromValidation: string;
  isDropValid: boolean;
  dragAction: DragAction;
  expandedNodes: string[] = [];
  invalidNodes: Set<TableOfContentItemVO>;

  //related to drag and drop ui actions
  prevElem: HTMLElement;
  prevAction: string;
  dragTimer: any;

  //environment var
  environment = process.env.NG_APP_LEOS_INSTANCE;

  //keep track of changes done on tree, used mainly from undo
  treeHistory: Array<TableOfContentItemVO[]> = [];

  treeControl: NestedTreeControl<TableOfContentItemVO>;
  levels = new Map<TableOfContentItemVO, number>();
  dataSource: MatTreeNestedDataSource<TableOfContentItemVO>;

  destroy$: Subject<any> = new Subject();

  constructor(
    private documentService: DocumentService,
    private dialogService: EuiDialogService,
    private tableOfContentService: TableOfContentService,
    public translateService: TranslateService,
    public elementRef: ElementRef,
    private cdRef: ChangeDetectorRef,
    private store: Store,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.treeControl = new NestedTreeControl<TableOfContentItemVO>(
      this.getChildren,
    );
    this.dataSource = new MatTreeNestedDataSource();
    this.documentService.documentConfig$
      .pipe(takeUntil(this.destroy$))
      .subscribe((dConfig) => (this.documentConfig = dConfig));

    this.store
      .select(getUserDetails)
      .pipe(take(1))
      .subscribe((state) => (this.user = state));

    this.treeControl = new NestedTreeControl<TableOfContentItemVO>(
      this.getChildren,
    );
    this.dataSource = new MatTreeNestedDataSource();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.tableOfContentService.toc$
      .pipe(takeUntil(this.destroy$))
      .subscribe((toc) => {
        this.setTree(toc);
        //expand the default nodes if the expanded state is empty
        setTimeout(() => {
          if (this.expandedNodes.length > 0) {
            this.expandNodesFromHistory(this.treeControl.dataNodes);
          } else
            for (const nodes of this.treeControl.dataNodes)
              this.defaultExpanded(nodes);
        });
      });
  }

  isLabelTextTruncated(element: HTMLDivElement): boolean {
    return element.offsetWidth < element.scrollWidth;
  }

  getChildren = (node: TableOfContentItemVO) => node.childItems;

  hasChildren = (index: number, node: TableOfContentItemVO) =>
    node.childItems.length > 0;

  shouldAddMoveLabel(tocItem: TableOfContentItemVO) {
    return (
      tocItem.softActionRoot &&
      (MOVE_TO === tocItem.softActionAttr ||
        MOVE_FROM === tocItem.softActionAttr)
    );
  }
  getLabel(node: TableOfContentItemVO) {
    if (node != null) {
      if (node.tocItem.numberingType === BULLET_NUM) {
        return this.translateService.instant('toc.item.type.bullet');
      } else {
        return this.translateService.instant(
          'toc.item.type.' + node.tocItem.aknTag.toLowerCase(),
        );
      }
    }
  }

  handleNodeChanges(event) {
    if (event.saveSnapshot) {
      this.treeHistory.push(event.newTree);
      return;
    }
    this.setTree(event.newTree);
    this.isToCDraft = true;
    this.highlightInvalidNodes();
  }

  handlePlaceAt(nodeTarget: TableOfContentItemVO, position: string) {
    const nodeTargetParent = this.findNodeById(
      this.treeControl.dataNodes,
      nodeTarget.parentItem,
    );
    this.validateAndMove(
      this.selectedNodeToMove,
      nodeTarget,
      nodeTargetParent,
      position,
    );
  }

  handleMove(node: TableOfContentItemVO) {
    this.handleNodeSelect(node);
    this.selectedNodeToMove = node;
  }

  isNodeSelected() {
    return this.selectedNode !== null;
  }

  isNodeSelectedToMove() {
    return this.selectedNodeToMove !== null;
  }

  expandAll() {
    this.treeControl.expandAll();
  }

  colllapseAll() {
    this.treeControl.collapseAll();
  }

  showNumParagraphToggle(item: TableOfContentItemVO) {
    const env = process.env.NG_APP_LEOS_INSTANCE;
    return (
      item.originAttr &&
      item.originAttr === EC &&
      item.tocItem.aknTag === ARTICLE &&
      item.childItems.length > 0 &&
      !(item.softActionAttr === DELETE || item.softActionAttr === 'MOVE')
    );
  }

  isArticle(tocItem: TocItem) {
    return tocItem.aknTag.toLowerCase() === 'article';
  }

  isDivision(tocItem: TocItem) {
    return tocItem.aknTag.toLowerCase() === 'division';
  }

  isItemHeadingVisible(tocItem: TocItem) {
    return (
      tocItem.itemHeading === 'MANDATORY' || tocItem.itemHeading === 'OPTIONAL'
    );
  }
  isItemHeadingEditable(tocItem: TocItem) {
    return tocItem.aknTag === 'DIVISION'
      ? false
      : this.isItemHeadingVisible(tocItem);
  }

  isItemNumberEditable(tocItem: TocItem) {
    return tocItem.numberEditable;
  }

  isItemNumberVisible(tocItem: TocItem) {
    return (
      tocItem.itemNumber === 'MANDATORY' || tocItem.itemNumber === 'OPTIONAL'
    );
  }

  handleTocRemove() {
    const newTree = cloneDeep(this.treeControl.dataNodes);
    const item = this.findNodeById(newTree, this.selectedNode.id);
    const parentItem: TableOfContentItemVO = checkDeleteOnLastItemInList(
      newTree,
      item,
    );
    const deleteTocElement = () => {
      if (this.environment === CN) {
        this.setAffectedAttribute(item, newTree);
        // LEOS-5958: Delete selected item element.
        if (!containsItemOfOrigin(item, EC, CN)) {
          this.removeNode(newTree, item);
        } else {
          softDeleteItem(newTree, item, CN);
        }
        // LEOS-5958: If parentItem is not null, means it is a list without any points. Then delete parentItem as well.
        if (parentItem != null) {
          if (!containsItemOfOrigin(parentItem, EC, CN)) {
            this.removeNode(newTree, parentItem);
          } else {
            softDeleteItem(newTree, parentItem, CN);
          }
        } else {
          const parent = this.findNodeById(newTree, item.parentItem);
          updateDepthOfTocItems(parent.childItems);
        }
      } else {
        if (!containsItemOfOrigin(item, EC, LS)) {
          this.removeNode(newTree, item);
        } else {
          softDeleteItem(newTree, item, LS);
        }
        const parent = this.findNodeById(newTree, item.parentItem);
        updateDepthOfTocItems(parent.childItems);

        this.treeHistory.push(this.treeControl.dataNodes);
        this.setTree(newTree);
        this.selectedNodeToMove = null;
      }

      this.treeHistory.push(this.treeControl.dataNodes);
      this.setTree(newTree);
      this.selectedNodeToMove = null;
    };

    if (isDeletedItem(item)) {
      this.undeleteItem(newTree, item);
    } else {
      if (
        'RECITAL' === item.tocItem.aknTag &&
        isNodeLastElement(this.tableOfContentService.getCurrentToc(), item.id)
      ) {
        this.openLastRecitalDeleteConfirmation(deleteTocElement);
      } else {
        deleteTocElement();
      }
    }
  }

  openLastRecitalDeleteConfirmation(onConfirm: () => void) {
    this.dialogService.openDialog({
      title: this.translateService.instant(
        'page.editor.last-element-delete-confirmation.title',
      ),
      content: this.translateService.instant(
        'page.editor.last-element-delete-confirmation.message',
      ),
      acceptLabel: this.translateService.instant('global.actions.continue'),
      accept: onConfirm,
      dismiss: () => {},
    });
  }

  undeleteItem = (
    tocTree: TableOfContentItemVO[],
    tableOfContentItemVO: TableOfContentItemVO,
  ) => {
    const tempDeletedItem =
      copyDeletedItemToTempForUndelete(tableOfContentItemVO);
    this.dropItemAtOriginalPosition(
      tempDeletedItem,
      tableOfContentItemVO,
      tocTree,
    );
    this.removeNode(tocTree, tableOfContentItemVO);
  };

  performAddOrMoveAction(
    isAdd: boolean,
    tocTree: TableOfContentItemVO[],
    sourceItem: TableOfContentItemVO,
    targetItem: TableOfContentItemVO,
    parentItem: TableOfContentItemVO,
    position: string,
  ) {
    const addOrMoveItem = (
      actualTargetItem: TableOfContentItemVO,
      clauseItem?: TableOfContentItemVO,
    ) =>
      this.environment === CN
        ? this.addOrMoveItemCN(
            isAdd,
            sourceItem,
            clauseItem ? clauseItem : targetItem,
            tocTree,
            actualTargetItem,
            position,
          )
        : this.addOrMoveItemProposal(
            isAdd,
            sourceItem,
            clauseItem ? clauseItem : targetItem,
            tocTree,
            actualTargetItem,
            position,
          );
    if (targetItem.tocItem.childrenAllowed) {
      const targetTocItem: TocItem = targetItem.tocItem;

      if (
        isSourceDivision(sourceItem) ||
        isCrossheading(sourceItem) ||
        isDroppedOnPointOrIndent(sourceItem, targetItem) ||
        sourceItem.tocItem.aknTag === targetItem.tocItem.aknTag
        // || !(targetTocItems && targetTocItems.includes(sourceItem.tocItem))
      ) {
        // If items have the same type or if child elements are not allowed in target add it to its parent
        const actualTargetItem = getActualTargetItem(
          sourceItem,
          targetItem,
          parentItem,
          position,
          true,
        );
        addOrMoveItem(actualTargetItem);
      } else if (!targetTocItem.root) {
        const actualTargetItem = getActualTargetItem(
          sourceItem,
          targetItem,
          parentItem,
          position,
          false,
        );
        addOrMoveItem(actualTargetItem);
      } else {
        if (containsItem(targetItem, 'CLAUSE')) {
          const clauseItem: TableOfContentItemVO =
            targetItem.childItems.filter(
              (x) => x.tocItem.aknTag === 'CLAUSE',
            )[0] ?? null;
          if (clauseItem != null) {
            const parent = this.findNodeById(tocTree, clauseItem.parentItem);
            const actualTargetItem = getActualTargetItem(
              sourceItem,
              clauseItem,
              parent,
              'BEFORE',
              true,
            );
            addOrMoveItem(actualTargetItem, clauseItem);
          }
        } else {
          addOrMoveItem(targetItem);
        }
      }
    } else {
      const actualTargetItem: TableOfContentItemVO = getActualTargetItem(
        sourceItem,
        targetItem,
        parentItem,
        position,
        true,
      );
      addOrMoveItem(actualTargetItem);
    }
  }

  addOrMoveItemCN(
    isAdd: boolean,
    sourceItem: TableOfContentItemVO,
    targetItem: TableOfContentItemVO,
    tocTree: TableOfContentItemVO[],
    actualTargetItem: TableOfContentItemVO,
    position: string,
  ) {
    if (isAdd) {
      this.addOrMoveItem(
        isAdd,
        sourceItem,
        targetItem,
        tocTree,
        actualTargetItem,
        position,
      );
      this.moveOriginAttribute(sourceItem, targetItem);
      this.setNumber(sourceItem, targetItem);
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
      this.handleMoveActionCN(sourceItem, tocTree);
      //insert the moved node to the target position
      this.addOrMoveItem(
        isAdd,
        sourceItem,
        targetItem,
        tocTree,
        actualTargetItem,
        position,
      );
    }
    const paretnNode = this.findNodeById(tocTree, sourceItem.parentItem);
    handleLevelMove(sourceItem, targetItem);
    updateDepthOfTocItems(paretnNode?.childItems ?? []);
    this.setAffectedAttribute(sourceItem, tocTree);
    setBlockOrCrossHeading(tocTree, sourceItem);

    this.resetUserInfo(sourceItem);
  }

  addOrMoveItemProposal(
    isAdd: boolean,
    sourceItem: TableOfContentItemVO,
    targetItem: TableOfContentItemVO,
    tocTree: TableOfContentItemVO[],
    actualTargetItem: TableOfContentItemVO,
    position: string,
  ) {
    if (isAdd) {
      this.addOrMoveItem(
        isAdd,
        sourceItem,
        targetItem,
        tocTree,
        actualTargetItem,
        position,
      );
      sourceItem.softActionAttr = ADD;
      sourceItem.softActionRoot = true;
      this.moveOriginAttribute(sourceItem, targetItem);
      this.setNumber(sourceItem, targetItem);
    } else {
      this.handleMoveActionEC(sourceItem, tocTree);
      this.addOrMoveItem(
        isAdd,
        sourceItem,
        targetItem,
        tocTree,
        actualTargetItem,
        position,
      );
    }
    const paretnNode = this.findNodeById(tocTree, sourceItem.parentItem);
    handleLevelMove(sourceItem, targetItem);
    updateDepthOfTocItems(paretnNode?.childItems ?? []);
    this.resetUserInfo(sourceItem);
  }

  copyMovingItemToTempCN(
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
    } else {
      moveToItem.id = SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveToItem.id;
      moveToItem.softActionAttr = MOVE_TO;
      moveToItem.softActionRoot = isSoftActionRoot;

      originalItem.childItems.forEach((child) => {
        if (
          child.originAttr === EC &&
          child.softActionAttr !== MOVE_FROM &&
          child.softActionAttr !== MOVE_TO &&
          child.softActionAttr !== ADD &&
          child.softActionAttr !== DELETE
        ) {
          moveToItem.childItems.push(
            this.copyMovingItemToTempCN(child, false, tocTree),
          );
        } else if (
          child.originAttr === EC &&
          (child.softActionAttr === MOVE_TO || child.softActionAttr === DELETE)
        ) {
          this.setAffectedAttribute(child, tocTree);
        }
      });
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

  copyMovingItemToTempEC(
    originalItem: TableOfContentItemVO,
    isSoftActionRoot: boolean,
    tocTree: TableOfContentItemVO[],
  ) {
    const moveToItem = cloneDeep(originalItem);
    moveToItem.id = SOFT_MOVE_PLACEHOLDER_ID_PREFIX + originalItem.id;
    moveToItem.originNumAttr = EC;
    moveToItem.softUserAttr = null;
    moveToItem.softDateAttr = null;
    originalItem.softActionAttr = MOVE_FROM;
    originalItem.softActionRoot = isSoftActionRoot;
    originalItem.softMoveFrom =
      SOFT_MOVE_PLACEHOLDER_ID_PREFIX + originalItem.id;
    return moveToItem;
  }

  handleMoveActionCN(
    moveFromItem: TableOfContentItemVO,
    tocTree: TableOfContentItemVO[],
  ) {
    if (
      moveFromItem.originAttr === EC &&
      (moveFromItem.softActionAttr == null ||
        (!hasTocItemSoftAction(moveFromItem, MOVE_FROM) &&
          !hasTocItemSoftAction(moveFromItem, MOVE_TO) &&
          !hasTocItemSoftAction(moveFromItem, ADD) &&
          !hasTocItemSoftAction(moveFromItem, DELETE)))
    ) {
      //skips the copyMovingItemFinal since it only does replace the temp from the id not necessary here
      const moveTemp = this.copyMovingItemToTempCN(moveFromItem, true, tocTree);
      this.dropItemAtOriginalPosition(moveTemp, moveFromItem, tocTree);

      // Handles specific case while moving unnumbered paragraph together with numbered paragraphs
      if (
        [PARAGRAPH, LEVEL].includes(moveFromItem.tocItem.aknTag) &&
        moveFromItem.number === ''
      ) {
        const moveFromSiblings = this.findNodeById(
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
      moveFromItem.originNumAttr = CN;
      moveFromItem.softActionRoot = true;

      // dropItemAtOriginalPosition(moveToTemp, moveToFinal, container);

      this.setAffectedAttribute(moveFromItem, tocTree);

      if (moveFromItem.softActionAttr === MOVE_FROM) {
        moveFromItem.softMoveFrom =
          SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromItem.id;
        const moveToItem = this.findNodeById(
          tocTree,
          moveFromItem.softMoveFrom,
        );
        if (moveToItem) {
          moveToItem.softActionRoot = true;
          this.setAffectedAttribute(moveToItem, tocTree);
        }
      }
    }
  }

  handleMoveActionEC(
    moveFromItem: TableOfContentItemVO,
    tocTree: TableOfContentItemVO[],
  ) {
    if (
      moveFromItem.originAttr === EC &&
      (moveFromItem.softActionAttr == null ||
        (!hasTocItemSoftAction(moveFromItem, MOVE_FROM) &&
          !hasTocItemSoftAction(moveFromItem, MOVE_TO) &&
          !hasTocItemSoftAction(moveFromItem, ADD) &&
          !hasTocItemSoftAction(moveFromItem, DELETE)))
    ) {
      const moveTemp = this.copyMovingItemToTempEC(moveFromItem, true, tocTree);
      moveFromItem.originNumAttr = LS;
      moveFromItem.softActionRoot = true;

      this.dropItemAtOriginalPosition(moveTemp, moveFromItem, tocTree);
    }
    moveFromItem.originNumAttr = LS;
    moveFromItem.softActionRoot = true;
    if (moveFromItem.softActionAttr === MOVE_FROM) {
      moveFromItem.softMoveFrom =
        SOFT_MOVE_PLACEHOLDER_ID_PREFIX + moveFromItem.id;
      const moveToItem: TableOfContentItemVO = getTableOfContentItemVOById(
        moveFromItem.softMoveFrom,
        tocTree,
      );
      if (moveToItem != null) {
        moveToItem.softActionRoot = true;
      }
    }
  }
  //copy the source item, to a temp moved
  copyMovingItemToTemp(
    originalItem: TableOfContentItemVO,
    isSoftActionRoot: boolean,
  ) {
    const moveToItem: TableOfContentItemVO = cloneDeep(originalItem);
    moveToItem.id = SOFT_MOVE_PLACEHOLDER_ID_PREFIX + originalItem.id;
    moveToItem.originNumAttr = EC;
    moveToItem.softActionAttr = MOVE_TO;
    moveToItem.softMoveTo = originalItem.id;
    originalItem.softActionAttr = MOVE_FROM;
    originalItem.softActionRoot = isSoftActionRoot;
    originalItem.softMoveFrom =
      SOFT_MOVE_PLACEHOLDER_ID_PREFIX + originalItem.id;
    return moveToItem;
  }

  handleInvalidNodes(event: Set<TableOfContentItemVO>) {
    this.invalidNodes = event;
    //show invalid message
    if (event.size > 0) {
      this.messageFromValidation = this.translateService.instant(
        'page.editor.toc.invalid-node.save-error',
      );
      setTimeout(() => {
        this.clearValidationMessage();
      }, TIME_TO_CLEAR_INVALID);
      //clear any invalid node that was removed
      setTimeout(() => {
        //TODO:
        this.highlightInvalidNodes();
      });
    } else {
      this.clearValidationMessage();
    }
  }

  highlightInvalidNodes() {
    this.document
      .querySelectorAll('.invalid-node')
      .forEach((el) => el.classList.remove('invalid-node'));
    for (const node of this.invalidNodes || []) {
      //hilight invalid nodes
      const element = document.querySelector(`[data-id=${node.id}]`);
      if (element)
        element.children[1].children[0].classList.add('invalid-node');
    }
  }

  clearHighlightInvalidNodes() {
    this.document
      .querySelectorAll('.invalid-node')
      .forEach((el) => el.classList.remove('invalid-node'));
  }

  handleCancelMove() {
    this.selectedNodeToMove = null;
  }

  handleNodeSelect(node: TableOfContentItemVO) {
    this.selectedNode = node;
    // this.hilightSelectedNode(node);

    this.handleTocStylingOnInlineEdit(this.isEdit);

    this.delay(0) // Delay of 0ms to allow UI rendering
      .then(() => this.scrollToDocumentElement(node, 'docContainer'))
      .then(() => this.delay(100)) // Delay of 100ms before the next scroll
      .then(() =>
        this.scrollToDocumentElement(node, 'versionComparisonContainer'),
      );
  }

  //a node can be dropped from two sources
  //1) the ToC itself
  //2) the drag elements found on the left
  onDrop(event: CdkDragDrop<TableOfContentItemVO>) {
    if (this.dragAction.targetId === null) {
      this.cancelDrop();
      return;
    }

    const nodeTarget = this.findNodeById(
      this.treeControl.dataNodes,
      this.dragAction.targetId,
    );

    const nodeDragged = event.item.data as TableOfContentItemVO;
    //TODO : Fix this => this is a hack for allowing the root to go for validation otherwise it will fail to find the nodeParent and will not send it for validaiton
    if (nodeTarget.tocItem.root) {
      nodeTarget.parentItem = nodeTarget.id;
    }

    const parentNode = this.findNodeById(
      this.treeControl.dataNodes,
      nodeTarget.parentItem,
    );

    // validate Drop
    this.validateAndMove(
      nodeDragged,
      nodeTarget,
      parentNode,
      this.dragAction.action,
      this.dragAction.isAdd,
    );
  }

  dragMoved(event: CdkDragMove<TableOfContentItemVO>, isAdd: boolean = false) {
    //introduce a small debounce , when the toc gets to large we have performance issues
    //drag moved runs on every drag and drop move , this means a lot ...
    clearTimeout(this.dragTimer);
    this.dragTimer = setTimeout(() => {
      this.clearDragInfo();
      this.selectedNode = null;
      let el = this.document.elementFromPoint(
        event.pointerPosition.x,
        event.pointerPosition.y,
      );

      const node = this.getToMatNodeFromChild(el);
      if (node) {
        const targetId = node.getAttribute('data-id');
        const level = parseInt(node.getAttribute('aria-level'), 10);

        if (!node || !level) {
          this.dragAction = null;
          return;
        }
        el = node.children[1].children[0];

        const targetRect = el.getBoundingClientRect();
        const oneThird = targetRect.height / 3;
        if (event.pointerPosition.y - targetRect.top < oneThird) {
          this.dragAction = {
            action: 'BEFORE',
            targetId,
            level,
            isAdd,
          };
        } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
          this.dragAction = {
            action: 'AFTER',
            targetId,
            level,
            isAdd,
          };
        } else {
          this.dragAction = {
            action: 'AS_CHILDREN',
            targetId,
            level,
            isAdd,
          };
        }
        this.showNodeInsertion(node);
      }
    }, 5);
  }

  nodeExpanded(node: TableOfContentItemVO) {
    this.treeControl.expand(node);
    node.expanded = true;
    //wait for the node to render and then show if invalid
    setTimeout(() => {
      this.highlightInvalidNodes();
    });
  }

  nodeCollapsed(node: TableOfContentItemVO) {
    this.treeControl.collapse(node);
    node.expanded = false;
    this.expandedNodes = this.expandedNodes.filter((n) => n !== node.id);
  }

  setTree(toc: TableOfContentItemVO[]) {
    this.prepareTreeForDisplay(toc);
    this.dataSource.data = toc;
    this.treeControl.dataNodes = this.dataSource.data;

    this.checkForDraft();

    setTimeout(() => {
      if (this.selectedNode) this.handleNodeSelect(this.selectedNode);
      this.highlightInvalidNodes();
    });

    this.restoreExpanded(toc);
  }

  checkForDraft() {
    if (this.treeHistory && this.treeHistory.length === 0)
      this.isToCDraft = false;
    if (this.treeHistory && this.treeHistory.length > 0) {
      this.isToCDraft = true;
    }
  }

  resetTreeState() {
    if (this.treeHistory.length > 0) {
      const beforeEditTree = this.treeHistory.shift();
      this.setTree(beforeEditTree);
    }
    this.clearSelectedNode();
    this.isDropValid = false;
    this.selectedNodeToMove = null;
    this.treeHistory = [];
    this.isToCDraft = false;
    this.invalidNodes?.clear();
  }

  saveExpanded(node: TableOfContentItemVO) {
    if (this.treeControl.isExpanded(node)) {
      this.expandedNodes.push(node.id);
      const children = this.treeControl.getChildren(node);
      children.forEach((child) => {
        this.saveExpanded(child);
      });
    }
  }

  handleTocStylingOnInlineEdit(isEditMode: boolean) {
    setTimeout(() => {
      this.hilightSelectedNode(this.selectedNode);
    });
  }

  private hilightSelectedNode(node: TableOfContentItemVO) {
    this.document
      .querySelectorAll('.selected-node')
      .forEach((el) => el.classList.remove('selected-node'));
    if (node) {
      const element = document.querySelector(`[data-id="${node.id}"]`);
      if (element) {
        element.children[1].children[0].classList.add('selected-node');
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }
    }
  }

  private clearSelectedNode() {
    this.selectedNode = null;
    this.document
      .querySelectorAll('.selected-node')
      .forEach((el) => el.classList.remove('selected-node'));
  }

  private populateValidationMessage(validationResult: NodeValidation) {
    this.isDropValid = validationResult.success;
    this.messageFromValidation = this.translateService.instant(
      validationResult.messageKey,
      {
        0: capitalizeFirstLetter(validationResult.sourceItem.tocItem.aknTag),
        1: capitalizeFirstLetter(validationResult.targetItem.tocItem.aknTag),
      },
    );
  }

  private clearValidationMessage() {
    this.isDropValid = null;
    this.messageFromValidation = null;
  }

  private getToMatNodeFromChild(el: Element) {
    if (el.classList.contains('mat-nested-tree-node')) return el;
    if (el.parentElement) {
      const parentEl = this.getToMatNodeFromChild(el.parentElement);
      if (parentEl) return parentEl;
    }
  }

  private prepareTreeForDisplay(root: TableOfContentItemVO[]) {
    for (const n of root || []) {
      if (n) {
        n.tocStyling = getItemSoftStyle(n);
        let label: string = n.tocItem.itemDescription
          ? this.getLabel(n) + SPACE
          : '';

        const shoudlAddMovedLabel = this.shouldAddMoveLabel(n);
        if (shoudlAddMovedLabel) {
          label = MOVED_TITLE_SPAN_START_TAG.concat(' ', label);
          label += SPACE;
        }
        if (n.number && n.heading) {
          if (
            n.tocItem.aknTag.toLowerCase() === n.number.toLowerCase().trim()
          ) {
            n.number = HASH_NUM_VALUE;
          }
          label += n.number;
          if (shoudlAddMovedLabel) {
            label += SPAN_END_TAG;
            label += this.getMovedLabel();
          }
          if (n.tocItem.aknTag === TBLOCK || n.content === '') {
            label += CONTENT_SEPARATOR;
            label += n.heading;
          } else if (n.content !== '') {
            label += NUM_HEADING_SEPARATOR;
            label += n.heading;
          }
        } else if (n.number) {
          const softAction = n.numSoftActionAttr;
          if (softAction) {
            if (
              PARAGRAPH === n.tocItem.aknTag &&
              DELETE === softAction &&
              MOVE_TO !== n.softActionAttr
            ) {
              label +=
                '<span class="leos-soft-num-removed">' + n.number + '</span>';
            } else if (
              PARAGRAPH === n.tocItem.aknTag &&
              ADD === softAction &&
              MOVE_TO !== n.softActionAttr
            ) {
              label +=
                '<span class="leos-soft-num-new">' + n.number + '</span>';
            }
          } else {
            if (this.isIndented(n) && n.number !== n.indentOriginNumValue) {
              label +=
                '<span class="leos-soft-num-new">' + n.number + '</span>';
            } else {
              label += n.number;
            }
            if (shoudlAddMovedLabel) {
              label += SPAN_END_TAG;
              label += this.getMovedLabel();
            }
          }
        } else if (n.heading) {
          label += n.heading;
          if (shoudlAddMovedLabel) {
            label += SPAN_END_TAG;
            label += this.getMovedLabel();
          }
        } else if (shoudlAddMovedLabel) {
          label += SPAN_END_TAG;
          label += this.getMovedLabel();
        }
        if (n.tocItem.contentDisplayed) {
          label += label.length > 0 ? CONTENT_SEPARATOR : '';
          label += removeTag(n.content);
        }
        n.label = label;
      }
      if (n.childItems) this.prepareTreeForDisplay(n.childItems);
    }
  }

  private isIndented(item: TableOfContentItemVO) {
    return item.indentOriginType && item.indentOriginType !== RESTORED;
  }

  private getMovedLabel() {
    return (
      MOVE_LABEL_SPAN_START_TAG +
      this.translateService.instant('toc.edit.window.softmove.label') +
      SPAN_END_TAG
    );
  }

  private validateAndMove(
    nodeDragged: TableOfContentItemVO,
    nodeTarget: TableOfContentItemVO,
    parentNode: any,
    position: string,
    isAdd: boolean = false,
  ) {
    this.documentService
      .validateNodeDrop(
        [nodeDragged.id],
        nodeDragged.tocItem.aknTag,
        nodeTarget.id,
        nodeTarget.tocItem.aknTag,
        parentNode.id,
        parentNode.tocItem.aknTag,
        position,
        this.documentType,
        this.documentRef,
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.populateValidationMessage(response.result);
          setTimeout(() => {
            this.clearValidationMessage();
          }, TIME_TO_CLEAR_INVALID);
          if (response.result.success) {
            if (position === 'AS_CHILDREN') {
              const validationResult: NodeValidation = {
                success: true,
                targetItem: nodeTarget,
                sourceItem: nodeDragged,
                messageKey: 'toc.edit.window.drop.success.message',
              };
              const resultOfValidation =
                this.validateAddingItemAsChildOrSibling(
                  validationResult,
                  nodeDragged,
                  nodeTarget,
                  this.treeControl.dataNodes,
                  parentNode,
                  position,
                );
              if (!validationResult?.success) {
                this.populateValidationMessage(validationResult);
                return;
              }
            }
            // same type nodes will validate to response.success since in the validation processs , it will validates if it can drop as sibling and not as children
            // so the resutl.success will now mean that it can be dropped as a sibling
            if (position === 'AS_CHILDREN') {
              switch (this.documentType) {
                case 'council_explanatory':
                  position = checkPositionAfterValidationExplanatory(
                    nodeTarget,
                    nodeDragged,
                    position,
                  );
                  break;
                default:
                  position = checkPositionAfterValidation(
                    nodeTarget,
                    nodeDragged,
                    position,
                  );
              }
            }
            try {
              const newTree = cloneDeep(this.treeControl.dataNodes);
              const newEventItem = isAdd
                ? nodeDragged
                : this.findNodeById(newTree, nodeDragged.id);
              const newTargetItem = this.findNodeById(newTree, nodeTarget.id);
              this.addDefaultToNewItem(
                newTree,
                isAdd,
                newEventItem,
                newTargetItem,
                position,
              );
              if (isAdd) {
                this.reBuildTocItems.emit(true);
              }
              this.isToCDraft = true;
              this.selectedNodeToMove = null;
              setTimeout(() => {
                this.handleNodeSelect(nodeDragged);
              });
            } catch (e) {
              this.clearDragInfo(true);
              return;
            }
          } else {
            this.clearDragInfo(false);
          }
        },
        error: (err) => {
          this.clearDragInfo(true);
        },
      });
  }

  private resetUserInfo(sourceItem: TableOfContentItemVO) {
    sourceItem.softUserAttr = null;
    sourceItem.softUserAttr = null;
  }
  private handleLevelMove(
    sourceItem: TableOfContentItemVO,
    targetItem: TableOfContentItemVO,
  ) {
    // when moving back a LEVEL restore the initial depth
    if (
      sourceItem.tocItem.aknTag === 'LEVEL' &&
      targetItem.tocItem.aknTag === 'LEVEL'
    ) {
      sourceItem.itemDepth = targetItem.itemDepth;
    }
  }

  private moveOriginAttribute(
    droppedElement: TableOfContentItemVO,
    targetElement: TableOfContentItemVO,
  ) {
    if (this.isElementAndTargetOriginDifferent(droppedElement, targetElement)) {
      droppedElement.originAttr = this.environment === CN ? CN : LS;
    }
    droppedElement.originAttr = this.environment === CN ? CN : LS;
  }

  private setNumber(
    droppedElement: TableOfContentItemVO,
    targetElement: TableOfContentItemVO,
  ) {
    if (isNumbered(this.treeControl.dataNodes, droppedElement, targetElement)) {
      if (!droppedElement.isAutoNumOverwritten) {
        droppedElement.number = HASH_NUM_VALUE;
      }
      if (this.isNumSoftDeleted(droppedElement.numSoftActionAttr)) {
        droppedElement.numSoftActionAttr = null;
      } else {
        droppedElement.number = null;
      }
    }
  }

  private isNumSoftDeleted(numSoftACtionAttr: string) {
    return numSoftACtionAttr === DELETE;
  }
  private cancelDrop() {
    this.restoreExpanded(this.treeControl.dataNodes);
    this.clearDragInfo();
  }

  private updateMovedOnEmptyParent(
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

  private containsMovedElement(
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

  private setAffectedAttribute(
    dropData: TableOfContentItemVO,
    treeData: TableOfContentItemVO[],
  ) {
    if (
      ELEMENTS_TO_BE_PROCESSED_FOR_NUMBERING.includes(dropData.tocItem.aknTag)
    ) {
      let parentItemVO = this.findNodeById(treeData, dropData.parentItem);
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
        parentItemVO = this.findNodeById(treeData, parentItemVO.parentItem);
      }
    }
  }

  private dropItemAtOriginalPosition(
    nodeToAdd: TableOfContentItemVO,
    originalNode: TableOfContentItemVO,
    tocTree: TableOfContentItemVO[],
  ) {
    const originalParent = this.findNodeById(tocTree, originalNode.parentItem);
    const indexOfOriginalNode = originalParent.childItems.indexOf(originalNode);
    if (indexOfOriginalNode !== -1) {
      originalParent.childItems.splice(indexOfOriginalNode, 0, nodeToAdd);
    }
    //handle not found, edge case senario the previous code won't be able to reach here
  }

  private showNodeInsertion(node: HTMLElement, invalid = false) {
    //if the action isn't defined or the action and element are the same as the previous move don't render anything
    if (
      !this.dragAction ||
      (this.dragAction.action !== 'AS_CHILDREN' &&
        node === this.prevElem &&
        this.dragAction.action === this.prevAction)
    ) {
      return;
    }

    //clean previous placeholders
    this.cleanPlaceholders();

    if (this.dragAction.action !== 'AS_CHILDREN') {
      switch (this.dragAction.action) {
        case 'AFTER':
          (node.children[2] as HTMLElement).style.height = '24px';
          (node.children[2] as HTMLElement).style.display = 'block';
          break;
        case 'BEFORE':
          (node.children[0] as HTMLElement).style.height = '24px';
          (node.children[0] as HTMLElement).style.display = 'block';
          break;
      }
    }
    if (this.dragAction.action === 'AS_CHILDREN') {
      // wrap the label not the tree
      const labelContainer = node.getElementsByTagName('li')[0];
      labelContainer.classList.add(
        `drop-${this.dragAction.action.toLocaleLowerCase()}`,
      );
      if (invalid) {
        labelContainer.classList.add(
          `drop-${this.dragAction.action.toLocaleLowerCase()}-invalid`,
        );
      }
      setTimeout(() => {
        this.clearInvalidDrop();
      }, TIME_TO_CLEAR_INVALID);
    }
    this.prevElem = node;
    this.prevAction = this.dragAction.action;
  }

  private clearDragInfo(dropped = false) {
    if (dropped) {
      this.dragAction = null;
    }
    this.selectedNode = null;
    this.document
      .querySelectorAll('.drop-before')
      .forEach((element) => element.classList.remove('drop-before'));
    this.document
      .querySelectorAll('.drop-after')
      .forEach((element) => element.classList.remove('drop-after'));
    this.document
      .querySelectorAll('.drop-as_children')
      .forEach((element) => element.classList.remove('drop-as_children'));
  }

  private cleanPlaceholders() {
    this.document.querySelectorAll('.drop-placeholder').forEach((element) => {
      (element as HTMLElement).style.height = '0px';
      (element as HTMLElement).style.display = 'none';
    });
  }

  private clearInvalidDrop() {
    this.cleanPlaceholders();
    this.document
      .querySelectorAll('.drop-before-invalid')
      .forEach((element) => element.classList.remove('drop-before-invalid'));
    this.document
      .querySelectorAll('.drop-after-invalid')
      .forEach((element) => element.classList.remove('drop-after-invalid'));
    this.document
      .querySelectorAll('.drop-as_children-invalid')
      .forEach((element) =>
        element.classList.remove('drop-as_children-invalid'),
      );
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private scrollToDocumentElement(node: TableOfContentItemVO, id: string) {
    const targetElement = document.getElementById(id);
    if (targetElement) {
      const childTargetElement = targetElement.querySelector(
        `#${node.id}`,
      ) as HTMLElement;
      if (childTargetElement) {
        childTargetElement.style.backgroundColor = 'cornsilk';
        setTimeout(() => {
          childTargetElement.style.background = '';
        }, 1000);
        setTimeout(() => {
          childTargetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 100);
      }
    }
  }

  private removeNode(
    root: TableOfContentItemVO[],
    target: TableOfContentItemVO,
  ) {
    const parentNode = this.findNodeById(root, target.parentItem);
    parentNode.childItems = parentNode.childItems.filter(
      (n) => target.id !== n.id,
    );
  }

  private insertAfter(
    tree: TableOfContentItemVO[],
    target: TableOfContentItemVO,
    eventItem: TableOfContentItemVO,
    isAdd: boolean,
  ) {
    //remove the node from the tree
    // if (!isAdd) this.removeNode(newTree, eventItem);
    //get parent of the node droped / to moved at
    const parentNode = this.findNodeById(tree, target.parentItem);

    //set the selected / dragged  node to have the same id as the node droped/moved at
    eventItem.parentItem = parentNode.id;
    const targetIndex = parentNode.childItems.findIndex(
      (x) => x.id === target.id,
    );
    parentNode.childItems.splice(targetIndex + 1, 0, eventItem);
    //set the new tree
    this.treeHistory.push(this.treeControl.dataNodes);
    this.setTree(tree);
  }

  private insertBefore(
    tree: TableOfContentItemVO[],
    target: TableOfContentItemVO,
    eventItem: TableOfContentItemVO,
    isAdd: boolean,
  ) {
    // if (!isAdd) this.removeNode(tree, eventItem);
    const parentNode = this.findNodeById(tree, target.parentItem);
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
    this.treeHistory.push(this.treeControl.dataNodes);
    this.setTree(tree);
  }

  private insertChild(
    tree: TableOfContentItemVO[],
    target: TableOfContentItemVO,
    eventItem: TableOfContentItemVO,
    isAdd: boolean,
  ) {
    // if (!isAdd) this.removeNode(tree, eventItem);
    //get node to insert to as child
    const parentToBeNode = this.findNodeById(tree, target.id);
    //set the selected / dragged  node to have the same id as the node droped/moved at
    eventItem.parentItem = parentToBeNode.id;
    parentToBeNode.childItems.push(eventItem);
    this.treeHistory.push(this.treeControl.dataNodes);
    this.setTree(tree);
  }

  private restoreExpanded(root: TableOfContentItemVO[]) {
    for (const node of root) {
      if (node.expanded) this.treeControl.expand(node);
      this.restoreExpanded(node.childItems);
    }
  }

  private findNodeById(
    root: TableOfContentItemVO[],
    id: string,
  ): TableOfContentItemVO | null {
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
  }

  private defaultExpanded(node: TableOfContentItemVO) {
    if (node.tocItem.expandedByDefault && node.childItems) {
      this.treeControl.expand(node);
      this.expandedNodes.push(node.id);
      node.expanded = true;
    }
    if (node.childItems) {
      for (const n of node.childItems) this.defaultExpanded(n);
    }
  }

  //used for restoring nodes after save
  private expandNodesFromHistory(root: TableOfContentItemVO[]) {
    for (const node of root) {
      if (this.expandedNodes.includes(node.id)) {
        this.treeControl.expand(node);
        node.expanded = true;
      } else {
        this.treeControl.collapse(node);
        node.expanded = false;
      }
      this.expandNodesFromHistory(node.childItems);
    }
  }

  private isElementAndTargetOriginDifferent(
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

  private addDefaultToNewItem(
    tree: TableOfContentItemVO[],
    isAdd: boolean,
    eventItem: TableOfContentItemVO,
    targetElement: TableOfContentItemVO,
    position: string,
  ) {
    const parent = this.findNodeById(tree, targetElement.parentItem);
    if (isAdd) {
      eventItem.indentOriginIndentLevel = '-1';
      switch (eventItem.tocItem.aknTag) {
        case 'DIVISION': {
          break;
        }
        case 'CROSS_HEADING': {
          eventItem.tocItem.numberingType = 'NONE';
          break;
        }
        case 'ARTICLE': {
          eventItem.tocItemType = 'REGULAR';
          eventItem.heading = this.translateService.instant(
            'toc.item.type.regular.article.heading',
          );
        }
      }
    }

    this.performAddOrMoveAction(
      isAdd,
      tree,
      eventItem,
      targetElement,
      parent,
      position,
    );
  }

  private addOrMoveItem(
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

    if (actualTargetItem !== targetItem) {
      if ('BEFORE' === position) {
        this.insertBefore(tocTree, targetItem, sourceItem, isAdd);
      }
      if ('AFTER' === position) {
        this.insertAfter(tocTree, targetItem, sourceItem, isAdd);
      }
    } else if (
      actualTargetItem === targetItem &&
      LEVEL === sourceItem.tocItem.aknTag
    ) {
      /*
       * This else is when we add level as child or after a Part, Title, Chapter or Section,
       * because in this case the actualTargetItem is equal to targetItem, and we need to set
       * the level as the first of list of children
       */
      actualTargetItem.childItems.splice(0, 0, sourceItem);
    } else {
      this.insertChild(tocTree, targetItem, sourceItem, isAdd);
    }

    setItemDepth(sourceItem, targetItem, position);
    setItemLevel(tocTree, sourceItem, targetItem, position);
  }

  private validateAddingItemAsChildOrSibling(
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
    const targetTocItems: TocItem[] = this.documentConfig.tocRules[targetRules];

    console.log(targetTocItems);
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

  private validateAddingToActualTargetItem = (
    validationResult: NodeValidation,
    sourceItem: TableOfContentItemVO,
    targetItem: TableOfContentItemVO,
    tocTree: TableOfContentItemVO[],
    actualTargetItem: TableOfContentItemVO,
    position: string,
  ): boolean => {
    const validAddingToItem = validateAddingToItem(
      validationResult,
      sourceItem,
      targetItem,
      tocTree,
      actualTargetItem,
      position,
    );
    const maxDepthReached = validateMaxDepth(
      validationResult,
      sourceItem,
      targetItem,
    );
    return validAddingToItem && !maxDepthReached;
  };
}
