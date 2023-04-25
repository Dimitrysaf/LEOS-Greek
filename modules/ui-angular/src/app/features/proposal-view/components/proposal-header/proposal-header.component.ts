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
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  EuiDialogComponent,
  EuiDialogService,
} from '@eui/components/eui-dialog';

import { noWhitespaceValidator } from '@/shared/utils/validators';

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
  createForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.title = this.editableTitle;
    this.createForm = this.fb.group({
      docPurpose: new FormControl(this.title, {
        validators: [Validators.required, noWhitespaceValidator],
      }),
    });
  }

  handleEdit() {
    this.dialog.openDialog();
  }

  handleSave() {
    this.dialog.closeDialog();
    this.saveTitle.emit(this.createForm.get('docPurpose').value.trim());
  }
  handleClose() {
    this.dialog.closeDialog();
  }

  isFormValid(): boolean {
    return this.createForm.valid;
  }
}
