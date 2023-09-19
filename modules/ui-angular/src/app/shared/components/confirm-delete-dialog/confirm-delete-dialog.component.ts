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
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html'
})
export class ConfirmDeleteDialogComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;
  @Output() confirmDeletion: EventEmitter<any> = new EventEmitter();
  @Output() cancelDelete: EventEmitter<any> = new EventEmitter();

  @ViewChild('deleteDialog') deleteDialog: EuiDialogComponent;

  constructor() {}

  ngOnInit(): void {}

  handleConfirm() {
    this.confirmDeletion.emit();
    this.deleteDialog.accept.emit();
    this.deleteDialog.closeDialog();
  }

  handleCancel() {
    this.cancelDelete.emit();
    this.deleteDialog.dismiss.emit();
    this.deleteDialog.closeDialog();
  }
}
