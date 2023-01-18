import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  EuiDialogComponent,
  EuiDialogConfig,
  EuiDialogService,
} from '@eui/components/eui-dialog';

@Component({
  selector: 'app-proposal-header',
  templateUrl: './proposal-header.component.html',
  styleUrls: ['./proposal-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalHeaderComponent implements OnInit {
  @Input() nonEditablePartOfTitle: string;
  @Input() editableTitle: string;
  @Output() saveTitle: EventEmitter<string> = new EventEmitter();
  @ViewChild('editTitle') dialog: EuiDialogComponent;

  title: string;
  constructor(private euiDialogService: EuiDialogService) {}

  ngOnInit(): void {
    this.title = this.editableTitle;
  }

  handleEdit() {
    this.dialog.openDialog();
  }

  handleSave() {
    console.log('save');
    this.dialog.closeDialog();
    this.saveTitle.emit(this.title);
  }
  handleClose() {
    this.dialog.closeDialog();
  }
}
