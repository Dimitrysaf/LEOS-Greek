import { CdkDragDrop, CdkDragEnter, CdkDragMove } from '@angular/cdk/drag-drop';
import { NestedTreeControl } from '@angular/cdk/tree';
import { DOCUMENT } from '@angular/common';
import {
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
import { getUserDetails, UserDetails } from '@eui/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep, some, truncate } from 'lodash-es';
import { Subject, take, takeUntil } from 'rxjs';

import { DocumentConfig } from '@/shared/models';
import { DragAction } from '@/shared/models/drag-action.model';
import { NodeValidationResponse } from '@/shared/models/drop-response.model';
import { DocumentService } from '@/shared/services/document.service';
import { capitalizeFirstLetter } from '@/shared/utils/string.utils';
import {
  addOrMoveItem,
  checkPositionAfterValidation,
  checkPositionAfterValidationExplanatory,
  handleLevelMove,
  setBlockOrCrossHeading,
  setNumber,
  updateDepthOfTocItems,
} from '@/shared/utils/toc.utils';

import {
  TableOfContentItemVO,
  TocItem,
} from '../../../../shared/models/toc.model';

const MAX_LABEL_TREE_LENGTH = 50;

const TIME_TO_CLEAR_INVALID = 10000;
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
    public tranlsateService: TranslateService,
    public elementRef: ElementRef,
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
    this.documentService.setDocumentCategory(this.documentType.toLowerCase());
    this.documentService.toc$
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

  getChildren = (node: TableOfContentItemVO) => node.childItems;

  hasChildren = (index: number, node: TableOfContentItemVO) =>
    node.childItems.length > 0;

  getLabel(node: TableOfContentItemVO) {
    switch (node.tocItem.aknTag) {
      case 'CITATIONS':
      case 'PREAMBLE':
      case 'RECITALS':
      case 'BODY':
      case 'PREFACE':
      case 'MAIN_BODY':
      case 'CONCLUSIONS':
        return this.tranlsateService.instant(
          `toc.item.type.${node.tocItem.aknTag.toLowerCase()}`,
        );
      //higher division numbering
      case 'ARTICLE':
      case 'CHAPTER':
      case 'TITLE':
      case 'PART':
      case 'SECTION':
        return truncate(
          `${capitalizeFirstLetter(node.tocItem.aknTag)} ${node.number} ${
            node.heading ? '- ' + node.heading : ''
          }`,
          { length: MAX_LABEL_TREE_LENGTH },
        );
      default:
        return truncate(
          [node.number, node.heading || node.content].filter(Boolean).join(' '),
          { length: MAX_LABEL_TREE_LENGTH },
        );
    }
  }

  handleNodeChanges(event) {
    if (event.saveSnapshot) {
      this.treeHistory.push(event.newTree);
      return;
    }
    this.isToCDraft = true;
    this.hilightInvalidNodes();
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
    this.hanldeNodeSelect(node);
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
      item.originAttr === 'ec' &&
      item.tocItem.aknTag === 'ARTICLE' &&
      item.childItems.length > 0 &&
      !(item.softActionAttr === 'DELETE' || item.softActionAttr === 'MOVE')
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

  hanldeTocRemove() {
    const newTree = cloneDeep(this.treeControl.dataNodes);
    //TODO : handle if a node can remove or not show message
    if (this.selectedNodeToMove && this.selectedNodeToMove.tocItem.deletable) {
      this.removeNode(newTree, this.selectedNodeToMove);
      this.treeHistory.push(this.treeControl.dataNodes);
      this.setTree(newTree);
      this.selectedNodeToMove = null;
    }
    if (this.selectedNode && this.selectedNode.tocItem.deletable) {
      this.removeNode(newTree, this.selectedNode);
      this.treeHistory.push(this.treeControl.dataNodes);
      this.setTree(newTree);
      this.selectedNode = null;
    }
  }

  handleInvalidNodes(event: Set<TableOfContentItemVO>) {
    this.invalidNodes = event;
    //show invalid message
    if (event.size > 0) {
      this.messageFromValidation = this.tranlsateService.instant(
        'page.editor.toc.invalid-node.save-error',
      );
      setTimeout(() => {
        this.clearValidationMessage();
      }, TIME_TO_CLEAR_INVALID);
      //clear any invalid node that was removed
      setTimeout(() => {
        //TODO:
        this.hilightInvalidNodes();
      });
    } else {
      this.clearValidationMessage();
    }
  }

  hilightInvalidNodes() {
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

  clearHilightInvalidNodes() {
    this.document
      .querySelectorAll('.invalid-node')
      .forEach((el) => el.classList.remove('invalid-node'));
  }

  handleCancelMove() {
    this.selectedNodeToMove = null;
  }

  hanldeNodeSelect(node: TableOfContentItemVO) {
    this.selectedNode = node;
    // this.hilightSelectedNode(node);
    setTimeout(() => {
      this.handleTocStylingOnInlineEdit(this.isEdit);
      this.scrollToDocumentElement(node);
    });
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

  dragMoved(event: CdkDragMove, isAdd: boolean = false) {
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
      this.hilightInvalidNodes();
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
      if (this.selectedNode) this.hanldeNodeSelect(this.selectedNode);
      this.hilightInvalidNodes();
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
    const element = document.querySelector(`[data-id="${node.id}"]`);
    if (element) {
      element.children[1].children[0].classList.add('selected-node');
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  private clearSelectedNode() {
    this.selectedNode = null;
    this.document
      .querySelectorAll('.selected-node')
      .forEach((el) => el.classList.remove('selected-node'));
  }

  private populateValidationMessage(response: NodeValidationResponse) {
    this.isDropValid = response.result.success;
    this.messageFromValidation = response.result.messageKey;
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
        //get label to display
        n.label = this.getLabel(n);
      }
      if (n.childItems) this.prepareTreeForDisplay(n.childItems);
    }
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
          this.populateValidationMessage(response);
          setTimeout(() => {
            this.clearValidationMessage();
          }, TIME_TO_CLEAR_INVALID);
          if (response.result.success) {
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
              switch (position) {
                case 'AFTER':
                  this.insertAfter(nodeTarget, nodeDragged, isAdd);
                  break;
                case 'BEFORE':
                  this.insertBefore(nodeTarget, nodeDragged, isAdd);
                  break;
                case 'AS_CHILDREN':
                  this.insertChild(nodeTarget, nodeDragged, isAdd);
                  break;
              }
              //if source was the tocitems rebuild to change the uuid
              if (isAdd) {
                this.reBuildTocItems.emit(true);
              }
              this.isToCDraft = true;
              this.selectedNodeToMove = null;
              this.hanldeNodeSelect(nodeDragged);
            } catch (e) {
              console.log(e);
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

  private cancelDrop() {
    this.restoreExpanded(this.treeControl.dataNodes);
    this.clearDragInfo();
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

  private scrollToDocumentElement(node: TableOfContentItemVO) {
    const targetElement = document.getElementById(node.id);
    if (targetElement) {
      targetElement.style.backgroundColor = 'cornsilk';
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      setTimeout(() => {
        targetElement.style.background = '';
      }, 2000);
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
    target: TableOfContentItemVO,
    eventItem: TableOfContentItemVO,
    isAdd: boolean,
  ) {
    //clone the tree
    const newTree = cloneDeep(this.treeControl.dataNodes);
    this.addDefaultToNewItem(isAdd, eventItem, target, 'AFTER');

    //remove the node from the tree
    if (!isAdd) this.removeNode(newTree, eventItem);
    //get parent of the node droped / to moved at
    const parentNode = this.findNodeById(newTree, target.parentItem);

    //set the selected / dragged  node to have the same id as the node droped/moved at
    eventItem.parentItem = parentNode.id;
    const targetIndex = parentNode.childItems.findIndex(
      (x) => x.id === target.id,
    );
    parentNode.childItems.splice(targetIndex + 1, 0, eventItem);
    //set the new tree
    this.treeHistory.push(this.treeControl.dataNodes);
    this.setTree(newTree);
  }

  private insertBefore(
    target: TableOfContentItemVO,
    eventItem: TableOfContentItemVO,
    isAdd: boolean,
  ) {
    //deep clone the tree
    const newTree = cloneDeep(this.treeControl.dataNodes);
    //remove the already existing node
    this.addDefaultToNewItem(isAdd, eventItem, target, 'BEFORE');

    if (!isAdd) this.removeNode(newTree, eventItem);
    const parentNode = this.findNodeById(newTree, target.parentItem);
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
    this.setTree(newTree);
  }

  private insertChild(
    target: TableOfContentItemVO,
    eventItem: TableOfContentItemVO,
    isAdd: boolean,
  ) {
    const newTree = cloneDeep(this.treeControl.dataNodes);
    this.addDefaultToNewItem(isAdd, eventItem, target, 'AS_CHILDREN');

    if (!isAdd) this.removeNode(newTree, eventItem);
    //get node to insert to as child
    const parentToBeNode = this.findNodeById(newTree, target.id);
    //set the selected / dragged  node to have the same id as the node droped/moved at
    eventItem.parentItem = parentToBeNode.id;
    parentToBeNode.childItems.push(eventItem);
    this.treeHistory.push(this.treeControl.dataNodes);
    this.setTree(newTree);
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
    for (const node of root) {
      if (node.id === id) {
        return node;
      }
      if (node.childItems) {
        const found = this.findNodeById(node.childItems, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
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

  private moveOriginAttribute(
    droppedElement: TableOfContentItemVO,
    targetElement: TableOfContentItemVO,
  ) {
    if (this.environment === 'cn') {
      if (
        this.isElementAndTargetOriginDifferent(droppedElement, targetElement)
      ) {
        droppedElement.originNumAttr = 'cn';
      }
      droppedElement.originAttr = 'cn';
    } else {
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
    isAdd: boolean,
    eventItem: TableOfContentItemVO,
    targetElement: TableOfContentItemVO,
    position: string,
  ) {
    addOrMoveItem(
      isAdd,
      eventItem,
      targetElement,
      this.treeControl.dataNodes,
      null,
      position,
    );
    if (isAdd) {
      eventItem.indentOriginIndentLevel = -1;

      setNumber(this.treeControl.dataNodes, eventItem, targetElement);
      this.moveOriginAttribute(eventItem, targetElement);
      if (eventItem.tocItem.addSoftAttr) {
        eventItem.softActionAttr = 'ADD';
        eventItem.isSoftActionRoot = true;
      }
      if (eventItem.tocItem.aknTag === 'DIVISION') {
        eventItem.style = 'type_1';
      }

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
          eventItem.heading = this.tranlsateService.instant(
            'toc.item.type.regular.article.heading',
          );
        }
      }
    }

    //for both add or move
    updateDepthOfTocItems(this.treeControl.dataNodes);
    handleLevelMove(eventItem, targetElement);
    setBlockOrCrossHeading(this.treeControl.dataNodes, eventItem);
  }
}
