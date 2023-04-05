import {
  CdkDragDrop,
  CdkDragEnter,
  CdkDragMove,
  CdkDragStart,
} from '@angular/cdk/drag-drop';
import { NestedTreeControl } from '@angular/cdk/tree';
import { DOCUMENT } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { UxAppShellService } from '@eui/core';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep, head, includes, take, truncate } from 'lodash-es';
import { Subject, takeUntil } from 'rxjs';

import { DragAction } from '@/shared/models/drag-action.model';
import { NodeValidationResponse } from '@/shared/models/drop-response.model';
import { DocumentService } from '@/shared/services/document.service';
import { capitalizeFirstLetter } from '@/shared/utils/string.utils';
import { convertArticle } from '@/shared/utils/toc.utils';

import { TableOfContentItemVO, TocItem } from '../../models/toc.model';

const MAX_LABEL_TREE_LENGTH = 50;
interface TocUpdate {
  item: TableOfContentItemVO;
  actionOnItem: string;
}

interface TocUpdateValue {
  originalValue: any;
  newValue: any;
}

@Component({
  selector: 'app-document-toc',
  templateUrl: './document-toc.component.html',
  styleUrls: ['./document-toc.component.scss'],
})
export class DocumentTocComponent implements OnInit, OnDestroy {
  @Input() isEdit: boolean;
  @Input() documentType: string;
  @Input() documentRef: string;
  @Input() tocItems: TocItem[];
  @Output() reBuildTocItems: EventEmitter<boolean> = new EventEmitter();
  annexRef: string;

  //toc related
  toc: TableOfContentItemVO[];
  selectedNode: TableOfContentItemVO = null;
  selectedNodeToMove: TableOfContentItemVO = null;
  isToCDraft: boolean;
  messageFromValidation: string;
  isDropValid: boolean;

  dragAction: DragAction;

  //environment var
  environment = process.env.NG_APP_LEOS_INSTANCE;

  //ng values for the selected node edit
  heading: string;
  number: string;
  type: string;
  tocType: string;
  tocUpdate: Map<TocUpdate, TocUpdateValue> = new Map();

  treeHistory: Array<TableOfContentItemVO[]> = [];

  treeControl: NestedTreeControl<TableOfContentItemVO>;
  levels = new Map<TableOfContentItemVO, number>();
  dataSource: MatTreeNestedDataSource<TableOfContentItemVO>;
  expandedNodes: TableOfContentItemVO[] = [];

  destroy$: Subject<any> = new Subject();
  constructor(
    private documentService: DocumentService,
    private uxAppShellService: UxAppShellService,
    public tranlsateService: TranslateService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.documentService.tocItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe((toc) => {
        // this.saveExpanded();
        this.setTree(toc ?? []);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.documentService.setDocumentCategory(this.documentType.toLowerCase());
    // this.documentService.toc$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((toc) => {
    //     this.setTree(toc);
    //   });
    if (this.documentRef) {
      this.documentService
        .getToc(this.documentRef)
        .pipe(takeUntil(this.destroy$))
        .subscribe((toc) => this.setTree(toc));
    }
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
        return capitalizeFirstLetter(node.tocItem.aknTag);
      case 'MAIN_BODY':
        return 'Body';
      case 'CONCLUSIONS':
        return 'Signature';
      case 'ARTICLE':
        return `Article ${node.number} - ${node.heading}`;
      default:
        return truncate(
          [node.number, node.heading || node.content].filter(Boolean).join(' '),
          { length: MAX_LABEL_TREE_LENGTH },
        );
    }
  }

  isEditMode() {
    return this.isEdit;
  }

  handleHeadingChange(value) {
    this.selectedNode.heading = value;
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

  saveExpanded(node: TableOfContentItemVO) {
    if (this.expandedNodes.some((n) => n.id === node.id)) {
      this.expandedNodes.filter((n) => n.id !== node.id);
      return;
    }
    this.expandedNodes.push(node);
  }

  expandAll() {
    this.treeControl.expandAll();
  }

  colllapseAll() {
    this.treeControl.collapseAll();
  }

  hanldeTocRemove() {
    const newTree = cloneDeep(this.treeControl.dataNodes);
    //TODO : handle if a node can remove or not show message
    if (this.selectedNodeToMove.tocItem.deletable) {
      this.removeNode(newTree, this.selectedNodeToMove);
      this.treeHistory.push(this.treeControl.dataNodes);
      this.documentService.setToc(newTree);
      this.selectedNode = null;
    }
  }

  hanldeNodeSelect(node: TableOfContentItemVO) {
    this.selectedNode = node;
    this.scrollToElement(node);
    this.hilightSelectedNode(node);
    this.heading = node.heading;
    this.type = this.getDisplayableTocItem(node.tocItem);
    this.number = node.number;
    this.tocType = node.tocItemType.toLocaleLowerCase();
  }

  onDragStart(event: CdkDragStart) {
    console.log(event);
  }
  onEnter(event: CdkDragEnter) {
    console.log(event);
  }

  isArticle(tocItem: TocItem) {
    return tocItem.aknTag.toLocaleLowerCase() === 'article';
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

  handleTypeChange(event: string) {
    const oldValue = this.heading;
    this.selectedNode.tocItemType = event;
    this.tocType = event;
    const tocUpdate = {
      actionOnItem: 'TYPE_UPDATE',
      item: this.selectedNode,
    };
    this.tocUpdate.has({
      actionOnItem: 'HEADING_UPDATE',
      item: this.selectedNode,
    });
    const isHeadingUpdated: boolean = this.tocUpdate.has({
      item: this.selectedNode,
      actionOnItem: 'HEADING_UPDATE',
    });
    convertArticle(
      this.tocItems,
      this.selectedNode,
      oldValue.toUpperCase(),
      event.toUpperCase(),
    );

    const restored: boolean = this.tocUpdate.has(tocUpdate);
    if (!isHeadingUpdated) {
      if (restored) {
        this.selectedNode.isAffected = false;
        const originalValue = this.tocUpdate.get(tocUpdate).originalValue();
        if (originalValue !== '') {
          this.heading = originalValue;
          this.selectedNode.heading = this.heading;
        } else {
          this.heading = this.tranlsateService.instant(
            'toc.item.type.' +
              this.selectedNode.tocItemType +
              '.article.heading',
          );
          this.selectedNode.heading = this.heading;
        }
      } else {
        this.selectedNode.isAffected = false;
        this.heading = this.tranlsateService.instant(
          'toc.item.type.' + this.selectedNode.tocItemType + '.article.heading',
        );
        this.selectedNode.heading = this.heading;
      }
    }
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
    this.clearDragInfo();

    let el = this.document.elementFromPoint(
      event.pointerPosition.x,
      event.pointerPosition.y,
    );

    el = this.getToMatNodeFromChild(el);
    if (el) {
      const targetId = el.getAttribute('data-id');
      const level = parseInt(el.getAttribute('aria-level'), 10);

      if (!el || !level) {
        this.dragAction = null;
        return;
      }
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
      this.showNodeInsertion();
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
          }, 10000);
          if (response.result.success) {
            // same type nodes will validate to response.success since in the validation processs , it will validates if it can drop as sibling and not as children
            // so the resutl.success will now mean that it can be dropped as a sibling
            console.log('before check', position);
            if (position === 'AS_CHILDREN') {
              position = this.checkPositionAfterValidation(
                nodeTarget,
                nodeDragged,
                position,
              );
            }
            console.log('after check ', position);
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
                // this.dragItems = this.tocItemToTOC(this.tocItems);
                this.reBuildTocItems.emit(true);
              }
              this.isToCDraft = true;
              this.hanldeNodeSelect(nodeDragged);
              this.selectedNodeToMove = null;
            } catch (e) {
              this.clearDragInfo(true);
              return;
            }
          } else {
            this.clearDragInfo(false);
          }
        },
        error: (err) => {
          console.error(err);
          this.clearDragInfo(true);
        },
      });
  }

  private checkPositionAfterValidation(
    nodeTarget: TableOfContentItemVO,
    nodeDragged: TableOfContentItemVO,
    position: string,
  ) {
    //TODO add cn rules
    switch (nodeDragged.tocItem.aknTag) {
      case 'CITATION': {
        if (['CITATIONS'].includes(nodeTarget.tocItem.aknTag)) return position;
        if (['CITATION'].includes(nodeTarget.tocItem.aknTag)) return 'AFTER';
        return position;
      }
      case 'RECITAL': {
        if (['RECITALS'].includes(nodeTarget.tocItem.aknTag)) return position;
        if (['RECITAL'].includes(nodeTarget.tocItem.aknTag)) return 'AFTER';
        break;
      }
      case 'PART': {
        if (['BODY'].includes(nodeTarget.tocItem.aknTag)) return position;
        if (
          ['PART', 'TITLE', ' CHAPTER', 'SECTION', 'ARTICLE'].includes(
            nodeTarget.tocItem.aknTag,
          )
        )
          return 'AFTER';
        return position;
      }
      case 'TITLE': {
        if (['BODY', 'PART'].includes(nodeTarget.tocItem.aknTag))
          return position;
        if (
          ['TITLE', 'CHAPTER', 'SECTION', 'ARTICLE', 'LEVEL'].includes(
            nodeTarget.tocItem.aknTag,
          )
        )
          return 'AFTER';
        return position;
      }
      case 'CHAPTER': {
        if (['BODY', 'PART', 'TITLE'].includes(nodeTarget.tocItem.aknTag))
          return position;
        if (
          ['CHAPTER', 'SECTION', 'ARTICLE', 'LEVEL'].includes(
            nodeTarget.tocItem.aknTag,
          )
        )
          return 'AFTER';
        return position;
      }
      case 'SECTION': {
        if (
          ['BODY', 'PART', 'TITLE', 'CHAPTER'].includes(
            nodeTarget.tocItem.aknTag,
          )
        )
          return position;
        if (['SECTION', 'ARTICLE', 'LEVEL'].includes(nodeTarget.tocItem.aknTag))
          return 'AFTER';
        return position;
      }
      case 'ARTICLE': {
        if (
          ['PART', 'BODY', 'TITLE', 'CHAPTER', 'SECTION'].includes(
            nodeTarget.tocItem.aknTag,
          )
        )
          return position;
        if (['ARTICLE']) return 'AFTER';
        return position;
      }
      case 'PARAGRAPH': {
        if (
          ['ARTICLE', 'PARAGRAPH', 'LEVEL'].includes(nodeTarget.tocItem.aknTag)
        )
          return 'AFTER';
        return position;
      }
      case 'SUBPARAGRAPH': {
        if (['PARAGRAPH', 'POINT'].includes(nodeTarget.tocItem.aknTag))
          return position;
        if (['SUBPARAGRAPH'].includes(nodeTarget.tocItem.aknTag))
          return 'AFTER';
        return position;
      }
      case 'LEVEL': {
        if (
          ['SUBPARAGRAPH', 'SECTION', 'CHAPTER', 'TITLE', 'PART'].includes(
            nodeTarget.tocItem.aknTag,
          )
        )
          return position;
        if (['LEVEL', 'PARAGRAPH'].includes(nodeTarget.tocItem.aknTag))
          return 'AFTER';
        return position;
      }
      default:
        return position;
    }
  }

  private populateValidationMessage(response: NodeValidationResponse) {
    this.isDropValid = response.result.success;
    this.messageFromValidation = response.result.messageKey;
  }

  private clearValidationMessage() {
    this.isDropValid = null;
    this.messageFromValidation = null;
  }

  private getDisplayableTocItem(tocItem: TocItem): string {
    if (tocItem.numberingType === 'BULLET_NUM') {
      return this.tranlsateService.instant('toc.item.type.bullet');
    }
    if (tocItem.aknTag === 'MAIN_BODY') {
      return this.tranlsateService.instant('toc.item.type.mainbody');
    }
    return this.tranlsateService.instant(
      'toc.item.type.' + tocItem.aknTag.toLowerCase(),
    );
  }

  private hilightSelectedNode(node: TableOfContentItemVO) {
    this.document
      .querySelectorAll('.selected-node')
      .forEach((el) => el.classList.remove('selected-node'));
    const element = document.querySelector(`[data-id="${node.id}"]`);
    element.classList.add('selected-node');
  }

  private getToMatNodeFromChild(el: Element) {
    if (el.classList.contains('mat-nested-tree-node')) return el;
    if (el.parentElement) {
      const parentEl = this.getToMatNodeFromChild(el.parentElement);
      if (parentEl) return parentEl;
    }
  }

  private cancelDrop() {
    this.restoreExpanded();
    this.clearDragInfo();
  }

  private showNodeInsertion(invalid = false) {
    if (!this.dragAction) {
      return;
    }
    const node = this.document.querySelector(
      `[data-id="${this.dragAction.targetId}"]`,
    );
    // wrap the label not the tree
    const labelContainer = node;
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
    }, 3000);
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

  private clearInvalidDrop() {
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

  private scrollToElement(node: TableOfContentItemVO) {
    const targetElement = document.getElementById(node.id);
    if (targetElement) {
      targetElement.style.backgroundColor = 'cornsilk';
      setTimeout(() => {
        targetElement.style.background = '';
      }, 500);
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    this.documentService.setToc(newTree);
  }

  private insertBefore(
    target: TableOfContentItemVO,
    eventItem: TableOfContentItemVO,
    isAdd: boolean,
  ) {
    //deep clone the tree
    const newTree = cloneDeep(this.treeControl.dataNodes);
    //remove the already existing node
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
    this.documentService.setToc(newTree);
  }

  private insertChild(
    target: TableOfContentItemVO,
    eventItem: TableOfContentItemVO,
    isAdd: boolean,
  ) {
    const newTree = cloneDeep(this.treeControl.dataNodes);
    if (!isAdd) this.removeNode(newTree, eventItem);
    //get node to insert to as child
    const parentToBeNode = this.findNodeById(newTree, target.id);
    if (!parentToBeNode.tocItem.childrenAllowed) {
      this.showNodeInsertion(true);
      return;
    }
    //set the selected / dragged  node to have the same id as the node droped/moved at
    eventItem.parentItem = parentToBeNode.id;
    parentToBeNode.childItems.push(eventItem);
    this.treeHistory.push(this.treeControl.dataNodes);
    this.documentService.setToc(newTree);
  }

  private restoreExpanded() {
    this.expandedNodes.forEach((node) => {
      this.treeControl.expand(
        this.treeControl.dataNodes.find((x) => x.id === node.id),
      );
    });
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

  private setTree(toc: TableOfContentItemVO[]) {
    this.toc = toc;
    this.treeControl = new NestedTreeControl<TableOfContentItemVO>(
      this.getChildren,
    );
    this.dataSource = new MatTreeNestedDataSource();
    this.dataSource.data = toc;
    this.treeControl.dataNodes = this.dataSource.data;
    if (toc) for (const nodes of toc) this.defaultExpanded(nodes);
    this.restoreExpanded();
  }

  private defaultExpanded(node: TableOfContentItemVO) {
    if (node.tocItem.expandedByDefault) this.treeControl.expand(node);
    if (node.childItems) {
      for (const n of node.childItems) this.defaultExpanded(n);
    }
  }
}
