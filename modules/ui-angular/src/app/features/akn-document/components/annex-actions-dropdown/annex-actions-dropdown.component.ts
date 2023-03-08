import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EuiDialogComponent } from '@eui/components/eui-dialog';
import { of, Subject } from 'rxjs';

import { DocumentService } from '@/shared/services/document.service';

@Component({
  selector: 'app-annex-actions-dropdown',
  templateUrl: './annex-actions-dropdown.component.html',
  styleUrls: ['./annex-actions-dropdown.component.scss'],
})
export class AnnexActionsDropdownComponent implements OnInit, OnDestroy {
  createForm: FormGroup;

  @ViewChild('createVersionDialog') createVersionDialog: EuiDialogComponent;
  private destroy$ = new Subject();

  constructor(private fb: FormBuilder, public doc: DocumentService) {}

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.createForm = this.fb.group({
      title: new FormControl(
        { value: '', disabled: false },
        { validators: Validators.required },
      ),
      description: new FormControl(
        { value: '', disabled: false },
        { validators: Validators.required },
      ),
    });
  }

  openVersionModal() {
    this.createVersionDialog.openDialog();
  }

  closeVersionModal() {
    this.createVersionDialog.closeDialog();
  }

  onSaveVersion() {
    const requestBody = this.populateDataForVersionSave();
    this.doc.saveVersion(requestBody).subscribe((response) => {
      this.doc.setDocumentId(this.doc.documentRef);
      this.closeVersionModal();
    });
  }

  private populateDataForVersionSave() {
    //TODO when version Type is defined refactor this.
    const { title, description } = this.createForm.getRawValue();
    return {
      checkinComment: JSON.stringify({
        title,
        description,
      }),
      versionType: 'INTERMEDIATE',
    };
  }
}
