import { CdkDragDrop, CdkDragMove } from '@angular/cdk/drag-drop';
import { NestedTreeControl } from '@angular/cdk/tree';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { EuiDialogService } from '@eui/components/eui-dialog';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep, debounce } from 'lodash-es';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  filter,
  Subject,
  take,
  takeUntil,
} from 'rxjs';

import { CoEditionDetectedDialogComponent } from '@/shared/components/co-edition-detected-dialog/co-edition-detected-dialog.component';
import { ConfirmDeleteDialogComponent } from '@/shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import {
  ADD,
  ARTICLE,
  BULLET_NUM,
  CONTENT_SEPARATOR,
  DELETE,
  EC,
  HASH_NUM_VALUE,
  LEOS_TC_DELETE_ACTION,
  MAX_TRUNCATION_LIMIT,
  MOVE_FROM,
  MOVE_LABEL_SPAN_START_TAG,
  MOVE_TO,
  MOVED_TITLE_SPAN_START_TAG,
  NUM_HEADING_SEPARATOR,
  ONE_LINE_NODE_LABEL_LENGTH,
  PARAGRAPH,
  RESTORED,
  SPACE,
  SPAN_END_TAG,
  TBLOCK,
  TIME_TO_CLEAR_INVALID,
} from '@/shared/constants/toc.constant';
import { DocumentConfig } from '@/shared/models';
import { DragAction } from '@/shared/models/drag-action.model';
import { NodeValidation } from '@/shared/models/drop-response.model';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';
import { scrollInParent } from '@/shared/utils';
import { capitalizeFirstLetter } from '@/shared/utils/string.utils';
import {
  checkDeleteOnLastItemInList,
  checkIfConfirmDeletion,
  checkPositionAfterValidation,
  checkPositionAfterValidationExplanatory,
  findNodeById,
  getItemSoftStyle,
  removeTag,
} from '@/shared/utils/toc.utils';

import {
  TableOfContentItemVO,
  TocItem,
} from '../../../../shared/models/toc.model';
import { TableOfContentService } from '../../services/table-of-content.service';
import { TableOfContentEditService } from '../../services/table-of-content-edit.service';
import { ValidateTocService } from '../../services/validate-node-drop.service';

@Component({
  selector: 'app-document-toc',
  templateUrl: './document-toc.component.html',
  styleUrls: ['./document-toc.component.scss'],
})
export class DocumentTocComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() isEdit: boolean;
  @Input() documentType: string;
  @Input() documentRef: string;
  @Input() versionId: string;
  @Input() tocItems: TocItem[];
  @Output() reBuildTocItems: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('treeContainer') treeContainer: ElementRef<HTMLElement>;
  @ViewChild('tree', { read: ElementRef }) treeElRef: ElementRef<HTMLElement>;
  documentConfig: DocumentConfig;

  //toc related
  selectedNode: TableOfContentItemVO = null;
  selectedNodeToMove: TableOfContentItemVO = null;
  isToCDraft: boolean;
  messageFromValidation: string;
  isDropValid: boolean;
  dragAction: DragAction;
  expandedNodeIds = new Set<string>();
  invalidNodes: Set<TableOfContentItemVO>;

  //related to drag and drop ui actions
  prevElem: HTMLElement;
  prevAction: string;
  dragTimer: any;

  //environment var
  environment = process.env.NG_APP_LEOS_INSTANCE;

  treeControl: NestedTreeControl<TableOfContentItemVO>;
  dataSource: MatTreeNestedDataSource<TableOfContentItemVO>;

  draggedItem: TableOfContentItemVO = null;

  @ViewChild('deleteTocConfirmation')
  deleteDialog: ConfirmDeleteDialogComponent;

  private tooltips = new Map<TableOfContentItemVO, string>();
  private resizeObserver: ResizeObserver;
  private cancelPendingPersistTreeHeight: () => void;
  private destroy$: Subject<any> = new Subject();

  constructor(
    private documentService: DocumentService,
    private dialogService: EuiDialogService,
    public translateService: TranslateService,
    private coEditionService: CoEditionServiceWS,
    private validateTocService: ValidateTocService,
    private tocEditService: TableOfContentEditService,
    private tocService: TableOfContentService,
    @Inject(DOCUMENT) private document: Document,
    private zone: NgZone,
  ) {
    this.treeControl = new NestedTreeControl<TableOfContentItemVO>(
      this.getChildren,
    );
    this.dataSource = new MatTreeNestedDataSource();
    this.documentService.documentConfig$
      .pipe(takeUntil(this.destroy$))
      .subscribe((dConfig) => {
        this.validateTocService.setDocumentConfig(dConfig);
        this.tocEditService.setDocumentConfig(dConfig);
        this.documentConfig = dConfig;
      });
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.tocService.toc$.pipe(takeUntil(this.destroy$)).subscribe((toc) => {
      //expand the default nodes if the expanded state is empty
      if (!this.expandedNodeIds.size) {
        this.setByDefaultExpandedNodes(toc);
      }
      this.expandNodesFromHistory(toc);
      this.setTree(toc);
    });

    this.validateTocService.dropValidationResult$
      .pipe(takeUntil(this.destroy$), filter(Boolean))
      .subscribe((result) => {
        this.handleNodeValidationResult(result);
      });
  }

  ngAfterViewInit() {
    this.setupResizeObserver();
  }

  getNodeTooltip(node: TableOfContentItemVO): string {
    return this.tooltips.get(node) ?? '';
  }

  isLabelTextMoreThanOneLine(label: string) {
    return label.length >= ONE_LINE_NODE_LABEL_LENGTH;
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
      this.tocEditService.setTreeHistory(event.newTree);
      return;
    }
    this.tocEditService.setTree(event.newTree);
    this.isToCDraft = true;
    this.highlightInvalidNodes();
  }

  handlePlaceAt(nodeTarget: TableOfContentItemVO, position: string) {
    const nodeTargetParent = findNodeById(
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

  deleteItem(newTree: TableOfContentItemVO[], item: TableOfContentItemVO) {
    item.trackChangeAction = LEOS_TC_DELETE_ACTION;
    this.tocEditService.setTreeHistory(this.treeControl.dataNodes);
    this.tocEditService.deleteItem(newTree, item);
    this.tocEditService.setTree(newTree);
    this.selectedNodeToMove = null;
  }

  handleTocRemove() {
    const newTree = cloneDeep(this.treeControl.dataNodes);
    const item = findNodeById(newTree, this.selectedNode.id);
    const parentItem: TableOfContentItemVO = checkDeleteOnLastItemInList(
      newTree,
      item,
    );
    if (item) {
      if (item.softActionAttr === DELETE) {
        this.tocEditService.setTreeHistory(this.treeControl.dataNodes);
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
          this.deleteWithConfirmationCheck(newTree, item);
        }
      }
    }
  }

  openLastElementDeleteConfirmation(onConfirm: () => void) {
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

  deleteWithConfirmationCheck(
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

  onTocDeleteWithChildren() {
    this.deleteDialog.deleteDialog.openDialog();
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

  handleNodeSelect(node: TableOfContentItemVO, scrollTo = true) {
    this.selectedNode = node;

    if (!scrollTo) return;

    this.scrollNodeIntoView(node);
    this.scrollToDocumentElement(node, 'docContainer');
    const syncScrollElements =
      document.querySelectorAll(`.sync-scroll-enabled`);
    syncScrollElements.forEach((element) => {
      if (element.id !== 'docContainer') {
        this.scrollToDocumentElement(node, element.id);
      }
    });
  }

  cancelDrop() {
    this.restoreExpanded(this.treeControl.dataNodes);
    this.clearDragInfo();
  }

  //a node can be dropped from two sources
  //1) the ToC itself
  //2) the drag elements found on the left
  onDrop(event: CdkDragDrop<TableOfContentItemVO>) {
    if (this.dragAction.targetId === null) {
      this.cancelDrop();
      return;
    }

    const nodeTarget = findNodeById(
      this.treeControl.dataNodes,
      this.dragAction.targetId,
    );

    const nodeDragged = event.item.data as TableOfContentItemVO;
    //TODO : Fix this => this is a hack for allowing the root to go for validation otherwise it will fail to find the nodeParent and will not send it for validaiton
    if (nodeTarget.tocItem.root) {
      nodeTarget.parentItem = nodeTarget.id;
    }

    const parentNode = findNodeById(
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
    this.expandedNodeIds.add(node.id);
    //wait for the node to render and then show if invalid
    setTimeout(() => {
      this.highlightInvalidNodes();
    });
  }

  nodeCollapsed(node: TableOfContentItemVO) {
    this.treeControl.collapse(node);
    node.expanded = false;
    this.expandedNodeIds.delete(node.id);
  }

  setTree(toc: TableOfContentItemVO[] | null) {
    if (!Array.isArray(toc)) toc = [];
    this.persistTreeHeight(); // hack to maintain scroll position
    this.prepareTreeForDisplay(toc);
    this.dataSource.data = toc;
    this.treeControl.dataNodes = toc;

    this.checkForDraft();
    this.restoreExpanded(toc);

    setTimeout(() => {
      if (this.selectedNode) this.handleNodeSelect(this.selectedNode, false);
      this.highlightInvalidNodes();
      this.updateNodeTooltips();
    });
  }

  checkForDraft() {
    if (this.tocEditService.getTreeHistorySize() === 0) this.isToCDraft = false;
    if (this.tocEditService.getTreeHistorySize() > 0) {
      this.isToCDraft = true;
    }
  }

  resetTreeState() {
    this.clearSelectedNode();
    this.isDropValid = false;
    this.selectedNodeToMove = null;
    const initialTreeBeforeEdit = this.tocEditService.resetTreeHistory();
    if (initialTreeBeforeEdit) {
      this.tocService.setToc(initialTreeBeforeEdit);
    }
    this.isToCDraft = false;
    this.invalidNodes?.clear();
  }

  private scrollNodeIntoView(node: TableOfContentItemVO) {
    if (node) {
      document
        .querySelector(`[data-id="${node.id}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  private clearSelectedNode() {
    this.selectedNode = null;
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
    this.draggedItem = nodeDragged;
    this.validateTocService.validateNodeDrop(
      this.treeControl.dataNodes,
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
      this.documentType,
      this.documentRef,
    );
  }

  private handleNodeValidationResult(result: NodeValidation) {
    this.populateValidationMessage(result);
    setTimeout(() => {
      this.clearValidationMessage();
    }, TIME_TO_CLEAR_INVALID);

    if (!result.success) {
      return;
    }

    this.handleAddNodeAfterValidation(
      result.targetItem,
      this.draggedItem,
      this.dragAction.isAdd,
      this.dragAction.action,
    );

    this.draggedItem = null;
  }

  private handleAddNodeAfterValidation(
    nodeTarget: TableOfContentItemVO,
    nodeDragged: TableOfContentItemVO,
    isAdd: boolean,
    position: string,
  ) {
    // same type nodes will validate to response.success since in the validation processs , it will validates if it can drop as sibling and not as children
    if (position === 'AS_CHILDREN') {
      const validationResult: NodeValidation = {
        success: true,
        targetItem: nodeTarget,
        sourceItem: nodeDragged,
        messageKey: 'toc.edit.window.drop.success.message',
      };

      const parentNode = findNodeById(
        this.treeControl.dataNodes,
        nodeTarget.parentItem,
      );

      const resultOfValidation =
        this.validateTocService.validateAddingItemAsChildOrSibling(
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
      this.tocEditService.setTreeHistory(this.treeControl.dataNodes);
      const newTree = cloneDeep(this.treeControl.dataNodes);
      const newEventItem = isAdd
        ? nodeDragged
        : findNodeById(newTree, nodeDragged.id);
      const newTargetItem = findNodeById(newTree, nodeTarget.id);
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
      this.tocEditService.popTreeHistory();
      this.clearDragInfo(true);
      this.populateValidationMessage({
        success: false,
        sourceItem: nodeDragged,
        targetItem: nodeTarget,
        messageKey: 'toc.edit.window.drop.unexpected.error',
      } as NodeValidation);
      return;
    }
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

  private scrollToDocumentElement(
    node: TableOfContentItemVO,
    containerId: string,
  ) {
    const el = document.querySelector(`#${containerId} #${node.id}`);
    if (el instanceof HTMLElement) {
      el.style.background = 'cornsilk';
      setTimeout(() => {
        el.style.background = '';
      }, 1000);

      scrollInParent(el, { topOffset: 100, behavior: 'smooth', left: null });
    }
  }

  private restoreExpanded(root: TableOfContentItemVO[]) {
    for (const node of root) {
      if (node.expanded) this.treeControl.expand(node);
      this.restoreExpanded(node.childItems);
    }
  }

  private setByDefaultExpandedNodes(toc: TableOfContentItemVO[] | null) {
    if (!Array.isArray(toc)) return;
    for (const node of toc) {
      if (node.childItems) {
        if (node.tocItem.expandedByDefault) {
          this.expandedNodeIds.add(node.id);
        }
        this.setByDefaultExpandedNodes(node.childItems);
      }
    }
  }

  //used for restoring nodes after save
  private expandNodesFromHistory(toc: TableOfContentItemVO[] | null) {
    if (!Array.isArray(toc)) return;
    for (const node of toc) {
      node.expanded = this.expandedNodeIds.has(node.id);
      this.expandNodesFromHistory(node.childItems);
    }
  }

  private addDefaultToNewItem(
    tree: TableOfContentItemVO[],
    isAdd: boolean,
    eventItem: TableOfContentItemVO,
    targetElement: TableOfContentItemVO,
    position: string,
  ) {
    const parent = findNodeById(tree, targetElement.parentItem);
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

    this.tocEditService.performAddOrMoveAction(
      isAdd,
      tree,
      eventItem,
      targetElement,
      parent,
      position,
    );
  }

  private setupResizeObserver() {
    const widthBS = new BehaviorSubject<number>(0);
    this.resizeObserver = new ResizeObserver((entries) => {
      widthBS.next(entries[0].contentRect.width);
    });

    widthBS
      .pipe(debounceTime(250), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.updateNodeTooltips());
    this.resizeObserver.observe(this.treeContainer.nativeElement);
  }

  private updateNodeTooltips() {
    this.tooltips.clear();
    const updateTooltip = (node: TableOfContentItemVO) => {
      this.tooltips.set(node, this.createNodeTooltip(node));
      node.childItems?.forEach(updateTooltip);
    };
    this.dataSource?.data?.forEach(updateTooltip);
  }

  private createNodeTooltip(node: TableOfContentItemVO) {
    const labelEl = this.treeContainer.nativeElement.querySelector(
      `#node-label-${node.id}`,
    ) as HTMLElement;
    const isLabelTextTruncated =
      labelEl && labelEl.offsetWidth < labelEl.scrollWidth;
    const labelWithoutSpans = node.label.replace(
      /<span[^>]*>([^<]+)<\/span>/g,
      '',
    );
    return isLabelTextTruncated
      ? this.truncateLabelText(labelWithoutSpans)
      : '';
  }

  private truncateLabelText(label: string): string {
    if (label.length > MAX_TRUNCATION_LIMIT) {
      return label.substring(0, MAX_TRUNCATION_LIMIT) + '…';
    }
    return label;
  }

  /** Persist the height of the tree while it is being rendered. */
  private persistTreeHeight() {
    this.cancelPendingPersistTreeHeight?.();

    const treeEl = this.treeElRef?.nativeElement;
    if (!treeEl) {
      return;
    }

    const height = treeEl.getBoundingClientRect().height;
    treeEl.style.minHeight = height + 'px';

    // Wait until angular zone has no more tasks in queue - ie tree has
    // finished rendering - before restoring height
    const callback = debounce(() => {
      this.cancelPendingPersistTreeHeight?.();
      treeEl.style.minHeight = '';
    }, 100);

    const sub = this.zone.onStable
      .pipe(takeUntil(this.destroy$))
      .subscribe(callback);

    this.cancelPendingPersistTreeHeight = () => {
      sub.unsubscribe();
      callback.cancel();
      this.cancelPendingPersistTreeHeight = undefined;
    };
  }
}
