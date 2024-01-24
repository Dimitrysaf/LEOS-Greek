import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  EuiDropdownButtonMenuComponent,
  EuiDropdownButtonMenuItem,
} from '@eui/components/eui-dropdown-button-menu';
import { Observable, Subject, takeUntil } from 'rxjs';

import { TableOfContentService } from '@/features/akn-document/services/table-of-content.service';
import { ConfirmDeleteDialogComponent } from '@/shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { TableOfContentItemVO } from '@/shared/models/toc.model';

import { TocInlineEditMenuService } from '../../services/toc-inline-edit-menu.service';

@Component({
  selector: 'app-toc-action-menu',
  templateUrl: './toc-action-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TocActionMenuComponent implements OnInit, OnDestroy {
  @Input() node: TableOfContentItemVO;

  menuItems: EuiDropdownButtonMenuItem[] = [];
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
