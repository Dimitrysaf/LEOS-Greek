import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';

import { TableOfContentService } from '@/features/akn-document/services/table-of-content.service';
import { TableOfContentItemVO } from '@/shared/models/toc.model';

import { TocInlineEditMenuService } from '../../services/toc-inline-edit-menu.service';
import { DropdownModel } from '@/shared/dropdown.model';

@Component({
  selector: 'app-toc-action-menu',
  templateUrl: './toc-action-menu.component.html',
})
export class TocActionMenuComponent implements OnInit, OnDestroy {
  @Input() node: TableOfContentItemVO;

  menuItems: DropdownModel[] = [];
  isEditMode: boolean;
  private destroy$ = new Subject<void>();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private tocInlineEditMenuService: TocInlineEditMenuService,
    public tocService: TableOfContentService,
  ) {}

  ngOnInit() {
     this.tocInlineEditMenuService.items$
       .pipe(takeUntil(this.destroy$))
       .subscribe((items) => {
         this.menuItems = items;
       });

    this.tocService.isEditMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isEdit) => {
        this.isEditMode = isEdit;
        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMenuIconClick() {
    this.tocInlineEditMenuService.setTargetNode(this.node);
  }
}
