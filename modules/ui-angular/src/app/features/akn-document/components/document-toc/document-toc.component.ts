import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';

import { TocService } from '@/shared/services/toc.service';

import { TableOfContentItemVO } from '../../models/toc.model';
import { TocNode } from '../../models/TocNode';
import { CKEditorService } from '../../services/ckeditor.service';

@Component({
  selector: 'app-document-toc',
  templateUrl: './document-toc.component.html',
  styleUrls: ['./document-toc.component.scss'],
})
export class DocumentTocComponent implements OnInit, OnDestroy {
  @Input() isEdit: boolean;
  annexRef: string;
  tocItem: TableOfContentItemVO[];

  treeControl: NestedTreeControl<TableOfContentItemVO>;
  levels = new Map<TableOfContentItemVO, number>();
  dataSource: MatTreeNestedDataSource<TableOfContentItemVO>;
  expandedNodes: TableOfContentItemVO[] = [];

  destroy$: Subject<any> = new Subject();
  constructor(
    private tocService: TocService,
    private route: ActivatedRoute,
    private editotService: CKEditorService,
  ) {
    this.tocService.tocItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tocItem) => {
        // this.saveExpanded();
        this.tocItem = tocItem;
        this.treeControl = new NestedTreeControl<TableOfContentItemVO>(
          this.getChildren,
        );
        this.dataSource = new MatTreeNestedDataSource();
        this.dataSource.data = tocItem;
        this.treeControl.dataNodes = this.dataSource.data;
        this.restoreExpanded();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((param) => {
      this.tocService.getTocItems(param['id']);
      this.editotService.setAnnexRef(param['id']);
    });
  }

  getChildren = (node: TocNode) => node.childItems;

  hasChildren = (index: number, node: TocNode) => node.childItems.length > 0;

  getLabel(node: TocNode) {
    if (node.tocItem.aknTag === 'PREFACE') {
      return 'Preface';
    }
    if (node.tocItem.aknTag === 'MAIN_BODY') {
      return 'Body';
    }
    return `${node.number} ${node.content}`;
  }

  saveExpanded(node: TableOfContentItemVO) {
    if (this.expandedNodes.some((n) => n.id === node.id)) {
      this.expandedNodes.filter((n) => n.id !== node.id);
      console.log(this.expandedNodes);

      return;
    }
    this.expandedNodes.push(node);
    console.log(this.expandedNodes);
  }

  private restoreExpanded() {
    this.expandedNodes.forEach((node) => {
      this.treeControl.expand(
        this.treeControl.dataNodes.find((x) => x.id === node.id),
      );
    });
  }
}
