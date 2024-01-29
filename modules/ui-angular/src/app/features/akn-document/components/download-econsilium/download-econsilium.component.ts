import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ɵElement,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  DIALOG_COMPONENT_CONFIG,
  EuiDialogService,
} from '@eui/components/eui-dialog';
import { Subject, takeUntil } from 'rxjs';

import {
  DocumentService,
  DownloadEConsiliumOptions,
  RelevantElements,
} from '@/shared/services/document.service';

import { DocumentActionsService } from '../../services/document-actions.service';

@Component({
  selector: 'app-download-econsilium',
  templateUrl: './download-econsilium.component.html',
  styleUrls: ['./download-econsilium.component.scss'],
})
export class DownloadEconsiliumComponent implements OnInit, OnDestroy {
  includeRecitals: boolean;
  includeEnactingTerms: boolean;
  form: FormGroup<{
    [K in keyof {
      relevantElements: FormGroup<{
        all: FormControl<boolean | null>;
        recitals: FormControl<boolean | null>;
        annotations: FormControl<boolean | null>;
        enactingTerms: FormControl<boolean | null>;
      }>;
      cleanVersion: FormControl<'false' | 'true' | null>;
      title: FormControl<string | null>;
    }]: ɵElement<
      {
        relevantElements: FormGroup<{
          all: FormControl<boolean | null>;
          recitals: FormControl<boolean | null>;
          annotations: FormControl<boolean | null>;
          enactingTerms: FormControl<boolean | null>;
        }>;
        cleanVersion: FormControl<'false' | 'true' | null>;
        title: FormControl<string | null>;
      }[K],
      null
    >;
  }>;
  dialogOpen = false;

  private versionsData: any;
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(DIALOG_COMPONENT_CONFIG) private config,
    private formBuilder: FormBuilder,
    public documentService: DocumentService,
    private dialogService: EuiDialogService,
  ) {
    this.includeRecitals = this.documentService.documentType === 'bill';
    this.includeEnactingTerms = this.documentService.documentType === 'bill';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.form = this.createFormGroup();
    this.dialogService.disableAcceptButton();
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.form.valid) {
        this.config.setExportOptionsCallback(this.getOptions());
        this.dialogService.enableAcceptButton();
      } else this.dialogService.disableAcceptButton();
    });

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

  close() {
    this.form = this.createFormGroup();
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
        disabled: this.documentService.documentType === 'council_explanatory',
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
      currentVersion: null,
      originalVersion: null,
      intermediateVersion: null,
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
