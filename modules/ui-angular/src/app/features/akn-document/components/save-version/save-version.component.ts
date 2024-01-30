import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ɵElement } from '@angular/forms';
import {
  DIALOG_COMPONENT_CONFIG,
  EuiDialogService,
} from '@eui/components/eui-dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-save-version',
  templateUrl: './save-version.component.html',
  styleUrls: ['./save-version.component.css'],
})
export class SaveVersionComponent implements OnInit, OnDestroy {
  protected form: FormGroup<{
    [K in keyof {
      description: FormControl<string | null>;
      title: FormControl<string | null>;
    }]: ɵElement<
      {
        description: FormControl<string | null>;
        title: FormControl<string | null>;
      }[K],
      null
    >;
  }>;
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(DIALOG_COMPONENT_CONFIG) private config,
    private dialogService: EuiDialogService,
  ) {
    this.form = config.saveForm;
    if (this.form.invalid) {
      this.dialogService.disableAcceptButton();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(() => {
      if (this.form.invalid) this.dialogService.disableAcceptButton();
      else this.dialogService.enableAcceptButton();
    });
  }
}
