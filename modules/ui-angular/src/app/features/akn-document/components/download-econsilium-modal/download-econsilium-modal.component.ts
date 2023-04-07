import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { EuiDialogComponent } from '@eui/components/eui-dialog';

import {
  DocumentService,
  DownloadEConsiliumOptions,
  RelevantElements,
} from '@/shared/services/document.service';

@Component({
  selector: 'app-download-econsilium-modal',
  templateUrl: './download-econsilium-modal.component.html',
  styleUrls: ['./download-econsilium-modal.component.scss'],
})
export class DownloadEconsiliumModalComponent implements OnInit {
  @ViewChild('dialog') dialog: EuiDialogComponent;
  includeRecitals = this.doc.documentType === 'bill';
  includeEnactingTerms = this.doc.documentType === 'bill';
  form = this.createFormGroup();
  dialogOpen = false;

  constructor(private formBuilder: FormBuilder, public doc: DocumentService) {}

  ngOnInit() {
    type Field = 'all' | 'recitals' | 'enactingTerms';
    const getControl = (field: Field) =>
      this.form.get(`relevantElements.${field}`);
    const deselect = (field: Field) => {
      const control = getControl(field);
      if (control.value) {
        control.setValue(false, { emitEvent: false });
      }
    };

    getControl('all').valueChanges.subscribe((val) => {
      if (val) {
        deselect('recitals');
        deselect('enactingTerms');
      }
    });
    getControl('recitals').valueChanges.subscribe((val) => {
      if (val) {
        deselect('all');
      }
    });
    getControl('enactingTerms').valueChanges.subscribe((val) => {
      if (val) {
        deselect('all');
      }
    });
  }

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
      const options = this.getOptions();
      void this.doc.downloadEConsilium(options);
      this.close();
    } else {
      this.form.markAllAsTouched();
    }
  }

  private createFormGroup() {
    const requireAtLestOneCheckedValidator: ValidatorFn = (
      formGroup: FormGroup,
    ) => {
      const hasChecked = Object.values(formGroup.controls).some((c) => c.value);

      return hasChecked ? null : { requireCheckboxesToBeChecked: true };
    };

    return this.formBuilder.group({
      relevantElements: new FormGroup(
        {
          recitals: new FormControl(false),
          enactingTerms: new FormControl(false),
          annotations: new FormControl(false),
          all: new FormControl(true),
        },
        requireAtLestOneCheckedValidator,
      ),
      title: new FormControl('', { validators: Validators.required }),
      cleanVersion: new FormControl({
        value: 'false' as 'false' | 'true',
        disabled: this.doc.documentType === 'council_explanatory',
      }),
    });
  }

  private getOptions(): DownloadEConsiliumOptions {
    const val = this.form.getRawValue();
    return {
      title: val.title,
      relevantElements: this.getRelevantElements(),
      isWithAnnotations: val.relevantElements.annotations,
      isCleanVersion: JSON.parse(val.cleanVersion),
    };
  }

  private getRelevantElements(): RelevantElements {
    const { recitals, enactingTerms, annotations, all } =
      this.form.getRawValue().relevantElements;

    if (!recitals && !enactingTerms && !annotations && !all) {
      throw new Error('At least one relevantElement must be selected!');
    }
    if (!all && recitals && !enactingTerms) {
      return RelevantElements.RECITALS;
    }
    if (!all && !recitals && enactingTerms) {
      return RelevantElements.ENACTING_TERMS;
    }
    if (!all && recitals && enactingTerms) {
      return RelevantElements.RECITALS_AND_ENACTING_TERMS;
    }
    return RelevantElements.ALL;
  }
}
