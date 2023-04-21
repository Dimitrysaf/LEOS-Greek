import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const MIN_WIDTH_FOR_ACTIONS_ROW = 235;
@Component({
  selector: 'app-toc-actions-buttons',
  templateUrl: './toc-actions-buttons.component.html',
  styleUrls: ['./toc-actions-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TocActionsButtonsComponent implements OnInit, OnChanges {
  @Input() isEditMode: boolean;
  @Input() isUndoDisabled: boolean;
  @Input() isSaveDisabled: boolean;
  @Input() isCollapseToc: boolean;
  @Input() isAnnotationsColumnCollapsed: boolean;
  @Input() isVersionsColumnCollapsed: boolean;

  @Output() handleUndo = new EventEmitter<void>();
  @Output() handleSave = new EventEmitter<void>();
  @Output() handleSaveAndClose = new EventEmitter<void>();
  @Output() handleCancel = new EventEmitter<void>();
  @Output() handleExpandAll = new EventEmitter<void>();

  isOverflowing = false;

  constructor(
    private translateService: TranslateService,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    //check for overflow on column state change
    if (
      'isEditMode' in changes ||
      'isAnnotationsColumnCollapsed' in changes ||
      'isVersionsColumnCollapsed' in changes
    ) {
      this.checkOverflow();
    }
  }

  ngOnInit(): void {}

  onUndo() {
    return this.handleUndo.emit();
  }

  onSave() {
    return this.handleSave.emit();
  }

  onSaveAndClose() {
    return this.handleSaveAndClose.emit();
  }

  onCancel() {
    return this.handleCancel.emit();
  }

  onExpandAll() {
    return this.handleExpandAll.emit();
  }

  getTooltipForToggleTree() {
    if (this.isCollapseToc) {
      return this.translateService.instant(
        'page.editor.toc.toc-column.actions.collapseAll',
      );
    }
    return this.translateService.instant(
      'page.editor.toc.toc-column.actions.expandAll',
    );
  }

  checkOverflow() {
    // get parent and the title element and calculate the availableWidth
    const parent = this.document.querySelector('.eui-page-column__header');
    const title = this.document.querySelector(
      '.eui-page-column__header-left-content-label',
    );
    if (parent && title) {
      const availableWidth = parent.clientWidth - title.clientWidth;
      if (availableWidth > MIN_WIDTH_FOR_ACTIONS_ROW) {
        this.isOverflowing = false;
      } else {
        this.isOverflowing = true;
      }
    } else this.isOverflowing = false;
  }

  @HostListener('window:resize')
  onResize() {
    this.checkOverflow();
  }
}
