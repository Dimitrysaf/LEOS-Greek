import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ɵElement,Validators} from '@angular/forms';
import { EuiDialogComponent } from '@eui/components/eui-dialog';

import { DocumentService } from '@/shared/services/document.service';
import { noWhitespaceValidator } from '@/shared/utils/validators';

@Component({
  selector: 'app-save-version-dialog',
  templateUrl: './save-version-dialog.component.html',
  styleUrls: ['./save-version-dialog.component.scss'],
})
export class SaveVersionDialogComponent implements OnInit {
  @ViewChild('dialog') dialog: EuiDialogComponent;

  protected form: FormGroup<{ [K in keyof { description: FormControl<string | null>; title: FormControl<string | null> }]: ɵElement<{ description: FormControl<string | null>; title: FormControl<string | null> }[K], null> }>;
  protected dialogOpen = false;

  constructor(private formBuilder: FormBuilder, private doc: DocumentService) {
    this.form = this.createFormGroup();
  }

  ngOnInit() {}

  open() {
    this.dialogOpen = true;
    this.dialog.openDialog();
  }

  close() {
    this.dialog.closeDialog();
    this.dialogOpen = false;
    this.form = this.createFormGroup();
  }

  accept() {
    if (this.form.valid) {
      const requestBody = this.getNewVersionData();
      this.doc.saveVersion(requestBody).subscribe(() => {
        this.doc.reloadDocument();
        this.close();
      });
    }
  }

  private createFormGroup() {
    return this.formBuilder.group({
      title: new FormControl('', {
        validators: [Validators.required, noWhitespaceValidator],
      }),
      description: new FormControl(''),
    });
  }

  private getNewVersionData() {
    // TODO when version Type is defined refactor this.
    const { title, description } = this.form.getRawValue();
    return {
      checkinComment: JSON.stringify({
        title,
        description,
      }),
      versionType: 'INTERMEDIATE',
    };
  }
}
