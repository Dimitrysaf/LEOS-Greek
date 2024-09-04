import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DIALOG_COMPONENT_CONFIG } from '@eui/components/eui-dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

import {
  CatalogItem,
  CreateProposalBody,
  CreateProposalResponse,
} from '@/shared/models';
import { ProposalService } from '@/shared/services/proposal.service';
import { createPromise } from '@/shared/utils';
import { noWhitespaceValidator } from '@/shared/utils/validators';
import { EuiWizardStep } from '@eui/components/eui-wizard';

@Component({
  selector: 'app-proposal-create-wizard',
  templateUrl: './proposal-create-wizard.component.html',
  styleUrls: ['./proposal-create-wizard.component.scss'],
})
export class ProposalCreateWizardComponent implements OnInit, OnDestroy {
  stepSelected: any;
  isNavigationAllowed = false;
  currentStepIndex = 1;
  stepsCount = 2;

  createForm: FormGroup;
  selectedTemplate: CatalogItem | null;
  selectedLanguage: string;

  isStepOneCompleted = false;
  private destroy$ = new Subject();

  constructor(
    @Inject(DIALOG_COMPONENT_CONFIG) private config,
    private fb: FormBuilder,
    private proposalService: ProposalService,
    private router: Router,
    private translateService: TranslateService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.initCreateForm();
  }

  ngAfterViewInit() {
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

  handleSelectTemplate(template: CatalogItem | null) {
    this.selectedTemplate = template;
    this.updateTemplateAndLanguage();
  }

  handleSelectLanguage(langCode: string) {
    this.selectedLanguage = langCode;
    this.updateTemplateAndLanguage();
  }

  updateTemplateAndLanguage() {
    const template = this.selectedTemplate;
    const langCode = this.selectedLanguage;
    if (template && langCode) {
      const key = template.key;
      const templateName = this.proposalService.getTranslation(
        template.names,
        langCode,
      );
      const documentLanguage = this.proposalService.getTranslation(
        template.languages,
        langCode,
      );
      this.createForm.patchValue({
        templateId: template.id,
        templateName,
        langCode,
        documentLanguage,
        key
      });
      this.isNavigationAllowed = true;
    } else {
      this.createForm.patchValue({
        templateId: '',
        templateName: '',
        langCode: '',
        documentLanguage: '',
        key: ''
      });
      this.isNavigationAllowed = false;
    }
  }

  onNavigation(increment: number) {
    const newIndex: number = this.currentStepIndex + increment;
    if (newIndex >= 1 && newIndex <= this.stepsCount) {
      this.currentStepIndex = newIndex;
      this.isStepOneCompleted = this.currentStepIndex >= 2;
    }
  }

  onSelectStepRemoteNav(event: any) {
    if (this.currentStepIndex > event.index) {
      this.isStepOneCompleted = false;
    } else if (this.currentStepIndex < event.index) {
      this.isStepOneCompleted = true;
    }
    this.currentStepIndex = event.index;
  }

  onSelectStep(event: EuiWizardStep) {
    this.stepSelected = event;
  }

  async onCreate() {
    const { resolve, reject, promise } =
      createPromise<CreateProposalResponse>();

    this.proposalService.createProposal(this.getDataForCreate()).subscribe({
      next: async (response) => {
        this.config.closeDialog();
        this.resetInitials();
        await this.router.navigate([`collection/${response.proposalId}`]);
        resolve(response);
      },
      error: reject,
    });

    return await promise;
  }

  closeDialog() {
    this.resetInitials();
    this.config.closeDialog();
  }

  isFormValid(): boolean {
    return this.createForm.valid;
  }

  showCreateHideNext() {
    return this.currentStepIndex === 2;
  }

  private getDataForCreate(): CreateProposalBody {
    const { templateId, templateName, langCode, docPurpose, eeaRelevance, key } =
      this.createForm.getRawValue();
    return {
      templateId,
      templateName,
      langCode,
      docPurpose: docPurpose.trim(),
      eeaRelevance,
      key
    };
  }

  private initCreateForm() {
    this.createForm = this.fb.group({
      templateName: new FormControl(
        { value: '', disabled: true },
        { validators: Validators.required },
      ),
      documentLanguage: new FormControl({ value: '', disabled: true }),
      confidentialityLevel: new FormControl({
        value: this.translateService.instant(
          'page.workspace.create-form.document.confidentiality-level-predefined-value',
        ),
        disabled: true,
      }),
      docPurpose: new FormControl(
        this.translateService.instant(
          'page.workspace.create-form.document.document-title-predefined-value',
        ),
        {
          validators: [Validators.required, noWhitespaceValidator],
        },
      ),
      templateId: new FormControl(
        { value: '', disabled: true },
        { validators: Validators.required },
      ),
      key: new FormControl(
        { value: '', disabled: true },
        { validators: Validators.required },
      ),
      langCode: new FormControl(
        { value: '', disabled: true },
        { validators: Validators.required },
      ),
      internalReference: new FormControl({ value: '', disabled: true }),
      interInstitutionalReference: new FormControl({
        value: '',
        disabled: true,
      }),
      packageTitleCheck: new FormControl({ value: false, disabled: true }),
      packageTitle: new FormControl({ value: '', disabled: true }),
      eeaRelevance: new FormControl(false, { validators: Validators.required }),
      eeaRelevanceText: new FormControl({ value: '', disabled: true }),
    });
  }

  private resetInitials() {
    this.createForm.reset();
    this.stepSelected = null;
    this.currentStepIndex = 1;
    this.initCreateForm();
    this.isNavigationAllowed = false;
  }
}
