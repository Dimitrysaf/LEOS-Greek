import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { EuiDialogComponent } from '@eui/components/eui-dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;

  @ViewChild('confirmDialog') confirmDialog: EuiDialogComponent;

  constructor() {}

  ngOnInit(): void {}

  handleCancel() {
    this.confirmDialog.dismiss.emit();
    this.confirmDialog.closeDialog();
  }
}
