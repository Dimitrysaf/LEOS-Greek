import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-toc-actions-buttons',
  templateUrl: './toc-actions-buttons.component.html',
  styleUrls: ['./toc-actions-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TocActionsButtonsComponent implements OnInit {
  @Input() isEditMode: boolean;
  @Input() isUndoDisabled: boolean;
  @Input() isSaveDisabled: boolean;
  @Input() isCollapseToc: boolean;
  @Input() isAnnotationsPaneCollapsed: boolean;
  @Input() isVersionsPaneCollapsed: boolean;

  @Output() handleUndo = new EventEmitter<void>();
  @Output() handleSave = new EventEmitter<void>();
  @Output() handleSaveAndClose = new EventEmitter<void>();
  @Output() handleCancel = new EventEmitter<void>();
  @Output() handleExpandAll = new EventEmitter<void>();

  constructor(
    private translateService: TranslateService,
    @Inject(DOCUMENT) private document: Document,
  ) {}

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
}
