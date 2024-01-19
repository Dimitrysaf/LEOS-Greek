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
import { EuiDropdownButtonMenuComponent } from '@eui/components/eui-dropdown-button-menu';
import { Subject, takeUntil } from 'rxjs';

import { TableOfContentService } from '@/features/akn-document/services/table-of-content.service';
import { ConfirmDeleteDialogComponent } from '@/shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { TableOfContentItemVO } from '@/shared/models/toc.model';

import { TocInlineEditMenuService } from '../../services/toc-inline-edit-menu.service';

@Component({
  selector: 'app-toc-action-menu',
  templateUrl: './toc-action-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TocActionMenuComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() node: TableOfContentItemVO;

  isEditMode: boolean;
  @ViewChild('deleteTocConfirmation')
  deleteDialog: ConfirmDeleteDialogComponent;
  @ViewChild('dropdownComponentRef', { static: false })
  private dropdownComponent: EuiDropdownButtonMenuComponent;
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
        if (this.dropdownComponent) {
          this.dropdownComponent.menuItems = items;
        }
      });
    this.tocService.isEditMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isEdit) => {
        this.isEditMode = isEdit;
        this.changeDetectorRef.markForCheck();
      });
  }

  ngAfterViewInit() {
    this.tocInlineEditMenuService.setViewChild(this.deleteDialog);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMenuIconClick() {
    this.tocInlineEditMenuService.setTargetNode(this.node);
  }
}
