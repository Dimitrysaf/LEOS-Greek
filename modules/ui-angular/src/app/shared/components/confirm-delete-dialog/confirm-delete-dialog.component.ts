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
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.scss'],
})
export class ConfirmDeleteDialogComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;
  @Output() confrimDelete: EventEmitter<any> = new EventEmitter();
  @Output() cancelDelete: EventEmitter<any> = new EventEmitter();

  @ViewChild('deleteDialog') deleteDialog: EuiDialogComponent;

  get deleteDilaog(): EuiDialogComponent {
    return this.deleteDialog;
  }

  constructor() {}

  ngOnInit(): void {}

  handleConfirm() {
    this.confrimDelete.emit();
    this.deleteDialog.closeDialog();
  }

  handleCancel() {
    this.cancelDelete.emit();
    this.deleteDialog.closeDialog();
  }
}
