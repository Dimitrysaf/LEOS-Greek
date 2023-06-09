import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { EuiDialogComponent } from '@eui/components/eui-dialog';

@Component({
  selector: 'app-confirm-reload-dialog',
  templateUrl: './confirm-reload-dialog.component.html',
})
export class ConfirmReloadDialogComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;
  @Output() confirmReload: EventEmitter<any> = new EventEmitter();
  @Output() cancelReload: EventEmitter<any> = new EventEmitter();

  @ViewChild('reloadDialog') reloadDialog: EuiDialogComponent;

  constructor() {}

  ngOnInit(): void {}

  handleConfirm() {
    this.confirmReload.emit();
    this.reloadDialog.closeDialog();
  }

  handleCancel() {
    this.cancelReload.emit();
    this.reloadDialog.closeDialog();
  }
}
