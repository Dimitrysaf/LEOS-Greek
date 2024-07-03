import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
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
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      const targetElement = document.querySelector('.eui-dialog-container');
      if (targetElement) {
        const grandParentElement = targetElement.parentElement;
        if (grandParentElement) {
          this.renderer.addClass(
            grandParentElement,
            'cdk-overlay-panel-upload',
          );
        }
      }
      this.cdr.detectChanges();
    }, 0);
  }
}
