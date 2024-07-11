import { NestedTreeControl } from '@angular/cdk/tree';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';

import { MilestoneTocItem } from '@/features/proposal-view/models/milestone-toc-item.model';

@Component({
  selector: 'app-milestone-toc',
  templateUrl: './milestone-toc.component.html',
  styleUrls: ['./milestone-toc.component.scss'],
})
export class MilestoneTocComponent implements OnInit {
  @Input() toc: MilestoneTocItem[];

  dataSource: MatTreeNestedDataSource<MilestoneTocItem>;
  expandedNodes: MilestoneTocItem[] = [];
  treeControl: NestedTreeControl<MilestoneTocItem>;
  levels = new Map<MilestoneTocItem, number>();

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.treeControl = new NestedTreeControl<MilestoneTocItem>(
      this.getChildren,
    );
    this.dataSource = new MatTreeNestedDataSource();
  }

  ngOnInit(): void {
    this.dataSource.data = this.toc;
    this.treeControl.dataNodes = this.dataSource.data;
  }

  getChildren = (node: MilestoneTocItem) => node.children;

  hasChildren = (index: number, node: MilestoneTocItem) =>
    node.children.length > 0;


  hanldeNodeSelect(node: MilestoneTocItem) {
    this.scrollToElement(node);
    this.hilightSelectedNode(node);
  }

  private hilightSelectedNode(node: MilestoneTocItem) {
    this.document
      .querySelectorAll('.selected-node')
      .forEach((el) => el.classList.remove('selected-node'));
    const element = document.querySelector(`[data-id="${node.href}"]`);
    element.children[0].children[0].classList.add('selected-node');
  }

  classAdded(node: MilestoneTocItem) {
    const element = document.querySelector(`[data-id="${node.href}"]`);
    const targetElement = document.getElementById(node.href.substring(1));
    if (element && targetElement
      && ((targetElement.hasAttribute("leos:action")
          && targetElement.getAttribute("leos:action") == 'insert') ||
        (targetElement.hasAttribute("leos:softaction")
          && targetElement.getAttribute("leos:softaction") == 'move_from'))) {
      return 'leos-soft-new';
    }
    return '';
  }

  private scrollToElement(node: MilestoneTocItem) {
    const targetElement = document.getElementById(node.href.substring(1));
    if (targetElement) {
      targetElement.style.backgroundColor = 'cornsilk';
      setTimeout(() => {
        targetElement.style.background = '';
      }, 500);
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
