import { NestedTreeControl } from '@angular/cdk/tree';
import { ViewportScroller } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { Subject, takeUntil } from 'rxjs';

import { CKEditorService } from '@/features/akn-document/services/ckeditor.service';
import { Document } from '@/shared/models';
import { DocumentService } from '@/shared/services/document.service';

import { TableOfContentItemVO } from '../../models/toc.model';

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
  tocItem: TableOfContentItemVO[];
  selectedNodeToMove: TableOfContentItemVO = null;

  treeControl: NestedTreeControl<TableOfContentItemVO>;
  levels = new Map<TableOfContentItemVO, number>();
  dataSource: MatTreeNestedDataSource<TableOfContentItemVO>;
  expandedNodes: TableOfContentItemVO[] = [];

  destroy$: Subject<any> = new Subject();
  constructor(
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private editotService: CKEditorService,
    private scroller: ViewportScroller,
  ) {
    this.documentService.tocItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tocItem) => {
        // this.saveExpanded();
        this.setTree(tocItem);
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
        .getTocItems(this.documentRef)
        .pipe(takeUntil(this.destroy$))
        .subscribe((toc) => this.setTree(toc));
    }
  }

  getChildren = (node: TableOfContentItemVO) => node.childItems;

  hasChildren = (index: number, node: TableOfContentItemVO) =>
    node.childItems.length > 0;

  getParent = (node: TableOfContentItemVO) =>
    this.findNodeById(node, node.parentItem);

  getLabel(node: TableOfContentItemVO) {
    if (node.tocItem.aknTag === 'PREFACE') {
      return 'Preface';
    }
    if (node.tocItem.aknTag === 'MAIN_BODY') {
      return 'Body';
    }
    return `${node.number} ${node.content}`;
  }

  isEditMode() {
    return this.isEdit;
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

  hanldeNodeClick(node: TableOfContentItemVO) {
    console.log('clikign');
    const element = document.querySelector(`level[xml\\:id="${node.id}"]`);
    console.log(node);
    element.scrollIntoView({ behavior: 'smooth' });
  }

  private removeNode(root: TableOfContentItemVO, target: TableOfContentItemVO) {
    const parentNode = this.findNodeById(root, target.parentItem);
    parentNode.childItems = parentNode.childItems.filter(
      (n) => target.id !== n.id,
    );
  }

  private insertAfter(target: TableOfContentItemVO) {
    const newTree = cloneDeep(this.treeControl.dataNodes);
    this.removeNode(newTree[1], this.selectedNodeToMove);
    const parentNode = this.findNodeById(newTree[1], target.parentItem);
    const targetIndex = parentNode.childItems.findIndex(
      (x) => x.id === target.id,
    );
    parentNode.childItems.splice(targetIndex + 1, 0, this.selectedNodeToMove);
    this.documentService.setToc(newTree);
  }

  private insertBefore(target: TableOfContentItemVO) {
    const newTree = cloneDeep(this.treeControl.dataNodes);
    this.removeNode(newTree[1], this.selectedNodeToMove);
    const parentNode = this.findNodeById(newTree[1], target.parentItem);
    const targetIndex = parentNode.childItems.findIndex(
      (x) => x.id === target.id,
    );
    if (targetIndex === 0) {
      parentNode.childItems.unshift(this.selectedNodeToMove);
    } else {
      parentNode.childItems.splice(targetIndex, 0, this.selectedNodeToMove);
    }
    this.documentService.setToc(newTree);
  }

  private insertChild(target: TableOfContentItemVO) {
    const newTree = cloneDeep(this.treeControl.dataNodes);
    this.removeNode(newTree[1], this.selectedNodeToMove);
    const node = this.findNodeById(newTree[1], target.id);
    node.childItems.push(this.selectedNodeToMove);
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

  private setTree(tocItem: TableOfContentItemVO[]) {
    this.tocItem = tocItem;
    this.treeControl = new NestedTreeControl<TableOfContentItemVO>(
      this.getChildren,
    );
    this.dataSource = new MatTreeNestedDataSource();
    this.dataSource.data = tocItem;
    this.treeControl.dataNodes = this.dataSource.data;
    this.restoreExpanded();
  }
}
