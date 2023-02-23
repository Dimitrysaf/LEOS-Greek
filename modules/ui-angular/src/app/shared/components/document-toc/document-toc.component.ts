import { CdkDragDrop, CdkDragMove } from '@angular/cdk/drag-drop';
import { NestedTreeControl } from '@angular/cdk/tree';
import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash-es';
import { Subject, take, takeUntil } from 'rxjs';

import { CKEditorService } from '@/features/akn-document/services/ckeditor.service';
import { DocumentService } from '@/shared/services/document.service';
import { capitalizeFirstLetter } from '@/shared/utils/string.utils';

import { TableOfContentItemVO, TocItem } from '../../models/toc.model';

@Component({
  selector: 'app-document-toc',
  templateUrl: './document-toc.component.html',
  styleUrls: ['./document-toc.component.scss'],
})
export class DocumentTocComponent implements OnInit, OnDestroy {
  @Input() isEdit: boolean;
  @Input() documentType: string;
  @Input() documentRef: string;
  annexRef: string;
  toc: TableOfContentItemVO[];
  tocItems: TocItem[];
  selectedNodeToMove: TableOfContentItemVO = null;

  dragAction;
  isAdd: boolean;

  heading: string;
  number: string;
  type: string;

  treeControl: NestedTreeControl<TableOfContentItemVO>;
  levels = new Map<TableOfContentItemVO, number>();
  dataSource: MatTreeNestedDataSource<TableOfContentItemVO>;
  expandedNodes: TableOfContentItemVO[] = [];

  destroy$: Subject<any> = new Subject();
  constructor(
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private editotService: CKEditorService,
    private viewPortScroller: ViewportScroller,
    public tranlsateService: TranslateService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.documentService.tocItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe((toc) => {
        // this.saveExpanded();
        this.setTree(toc);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.documentService.setDocumentCategory(this.documentType.toLowerCase());

    if (this.documentRef) {
      this.documentService
        .getToc(this.documentRef)
        .pipe(takeUntil(this.destroy$))
        .subscribe((toc) => this.setTree(toc));
      this.documentService
        .getTocItems(this.documentRef)
        .pipe(takeUntil(this.destroy$))
        .subscribe((tocItems) => (this.tocItems = tocItems));
    }
  }

  getChildren = (node: TableOfContentItemVO) => node.childItems;

  hasChildren = (index: number, node: TableOfContentItemVO) =>
    node.childItems.length > 0;

  getParent = (node: TableOfContentItemVO) =>
    this.findNodeById(node, node.parentItem);

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
        return [node.number, node.heading || node.content]
          .filter(Boolean)
          .join(' ');
    }
  }

  isEditMode() {
    return this.isEdit;
  }

  handleHeadingChange(value) {
    this.selectedNodeToMove.heading = value;
  }

  handlePlaceBefore(node: TableOfContentItemVO) {
    this.insertBefore(node);
    this.selectedNodeToMove = null;
  }

  handlePlaceChild(node: TableOfContentItemVO) {
    this.insertChild(node);
    this.selectedNodeToMove = null;
  }
  handlePlaceAfter(node: TableOfContentItemVO) {
    this.insertAfter(node);
    this.selectedNodeToMove = null;
  }

  handleMove(node: TableOfContentItemVO) {
    this.selectedNodeToMove = node;
  }

  isNodeSelected() {
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
    this.removeNode(newTree, this.selectedNodeToMove);
    this.documentService.setToc(newTree);
    this.selectedNodeToMove = null;
  }

  hanldeNodeClick(node: TableOfContentItemVO) {
    this.scrollToElement(node);
    this.hilightSelectedNode(node);
    this.heading = node.heading;
    this.type = node.tocItemType;
    this.number = node.number;
    this.selectedNodeToMove = node;
  }

  getTocItemsToDrag() {
    return this.tocItems.filter((t) => t.draggable);
  }

  onDrop(event: CdkDragDrop<TableOfContentItemVO>) {
    if (this.dragAction.targetId === null) {
      this.cancelDrop();
      return;
    }

    const nodeDropped = this.findNodeById(
      this.treeControl.dataNodes[1],
      this.dragAction.targetId,
    );

    // validate Drop
    this.documentService
      .validateNodeDrop(
        this.documentRef,
        this.documentType,
        event.item.data,
        nodeDropped,
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (this.dragAction.isAdd) {
            const newItem = event.item.data;
          } else {
            this.selectedNodeToMove = event.item.data;
          }
          if (response) {
            switch (this.dragAction.action) {
              case 'AFTER':
                this.insertAfter(nodeDropped);
                break;
              case 'BEFORE':
                this.insertBefore(nodeDropped);
                break;
              case 'INSIDE':
                this.insertChild(nodeDropped);
                break;
            }
          }
          this.clearDragInfo(true);
        },
        error: (err) => {
          console.error(err);
          this.clearDragInfo(true);
        },
      });
  }

  dragMoved(event: CdkDragMove, isAdd: boolean = false) {
    this.clearDragInfo();

    let el = this.document.elementFromPoint(
      event.pointerPosition.x,
      event.pointerPosition.y,
    );
    console.log(el);
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
          action: 'INSIDE',
          targetId,
          level,
          isAdd,
        };
      }
      this.showNodeInsertion();
    }
  }

  private hilightSelectedNode(node: TableOfContentItemVO) {
    this.document
      .querySelectorAll('.selected-node')
      .forEach((el) => el.classList.remove('selected-node'));
    const element = document.querySelector(`[data-id="${node.id}"]`);
    console.log(element.children[0].children[0]);

    element.children[0].children[0].classList.add('selected-node');
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
    console.log('target is', this.dragAction);
    const node = this.document.querySelector(
      `[data-id="${this.dragAction.targetId}"]`,
    );
    console.log(node);
    // wrap the label not the tree
    const labelContainer =
      this.dragAction.action === 'INSIDE' ? node : node.children[0].children[0];
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
    this.selectedNodeToMove = null;
    this.document
      .querySelectorAll('.drop-before')
      .forEach((element) => element.classList.remove('drop-before'));
    this.document
      .querySelectorAll('.drop-after')
      .forEach((element) => element.classList.remove('drop-after'));
    this.document
      .querySelectorAll('.drop-inside')
      .forEach((element) => element.classList.remove('drop-inside'));
  }

  private clearInvalidDrop() {
    this.document
      .querySelectorAll('.drop-before-invalid')
      .forEach((element) => element.classList.remove('drop-before-invalid'));
    this.document
      .querySelectorAll('.drop-after-invalid')
      .forEach((element) => element.classList.remove('drop-after-invalid'));
    this.document
      .querySelectorAll('.drop-inside-invalid')
      .forEach((element) => element.classList.remove('drop-inside-invalid'));
  }

  private scrollToElement(node: TableOfContentItemVO) {
    const targetElement = document.getElementById(node.id);
    const bgColor = targetElement.style.backgroundColor;
    targetElement.style.backgroundColor = 'cornsilk';
    setTimeout(() => {
      targetElement.style.background = bgColor;
    }, 500);
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  private removeNode(
    root: TableOfContentItemVO[],
    target: TableOfContentItemVO,
  ) {
    const parentNode = this.findParentNode(root, target.parentItem);
    parentNode.childItems = parentNode.childItems.filter(
      (n) => target.id !== n.id,
    );
  }

  private insertAfter(target: TableOfContentItemVO) {
    //clone the tree
    const newTree = cloneDeep(this.treeControl.dataNodes);
    //remove the node from the tree
    this.removeNode(newTree, this.selectedNodeToMove);
    //get parent of the node droped / to moved at
    const parentNode = this.findParentNode(newTree, target.parentItem);
    //set the selected / dragged  node to have the same id as the node droped/moved at
    this.selectedNodeToMove.parentItem = parentNode.id;
    const targetIndex = parentNode.childItems.findIndex(
      (x) => x.id === target.id,
    );
    parentNode.childItems.splice(targetIndex + 1, 0, this.selectedNodeToMove);
    //set the new tree
    this.documentService.setToc(newTree);
  }

  private insertBefore(target: TableOfContentItemVO) {
    //deep clone the tree
    const newTree = cloneDeep(this.treeControl.dataNodes);
    //remove the already existing node
    this.removeNode(newTree, this.selectedNodeToMove);
    const parentNode = this.findParentNode(newTree, target.parentItem);
    const targetIndex = parentNode.childItems.findIndex(
      (x) => x.id === target.id,
    );
    //set the selected / dragged  node to have the same id as the node droped/moved at
    this.selectedNodeToMove.parentItem = parentNode.id;

    if (targetIndex === 0) {
      parentNode.childItems.unshift(this.selectedNodeToMove);
    } else {
      parentNode.childItems.splice(targetIndex, 0, this.selectedNodeToMove);
    }
    this.documentService.setToc(newTree);
  }

  private insertChild(target: TableOfContentItemVO) {
    const newTree = cloneDeep(this.treeControl.dataNodes);
    this.removeNode(newTree, this.selectedNodeToMove);
    //get node to insert to as child
    const parentToBeNode = this.findParentNode(newTree, target.id);
    if (!parentToBeNode.tocItem.childrenAllowed) {
      this.showNodeInsertion(true);
      return;
    }
    //set the selected / dragged  node to have the same id as the node droped/moved at
    this.selectedNodeToMove.parentItem = parentToBeNode.id;
    parentToBeNode.childItems.push(this.selectedNodeToMove);
    this.documentService.setToc(newTree);
  }

  private restoreExpanded() {
    this.expandedNodes.forEach((node) => {
      this.treeControl.expand(
        this.treeControl.dataNodes.find((x) => x.id === node.id),
      );
    });
  }

  private findParentNode(node: TableOfContentItemVO[], targetId: string) {
    for (const n of node) {
      const parent = this.findNodeById(n, targetId);
      if (parent) return parent;
    }
  }

  private findNodeById(
    node: TableOfContentItemVO,
    id: string,
  ): TableOfContentItemVO | null {
    if (node.id === id) {
      return node;
    }
    if (node.childItems) {
      for (const n of node.childItems) {
        const found = this.findNodeById(n, id);
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
    for (const nodes of toc) this.defaultExpanded(nodes);
    this.restoreExpanded();
  }
  private defaultExpanded(node: TableOfContentItemVO) {
    if (node.tocItem.expandedByDefault) this.treeControl.expand(node);
    if (node.childItems) {
      for (const n of node.childItems) this.defaultExpanded(n);
    }
  }
}
