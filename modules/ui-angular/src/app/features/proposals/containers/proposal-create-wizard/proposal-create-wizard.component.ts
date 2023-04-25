import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { EuiDialogComponent } from '@eui/components/eui-dialog';
import { UxWizardStep } from '@eui/components/legacy/ux-wizard-step';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

import { ProposalCreateTemplateSelectorComponent } from '@/shared/components/proposal-create-template-selector/proposal-create-template-selector.component';
import { createPromise } from '@/shared/utils';
import { noWhitespaceValidator } from '@/shared/utils/validators';

import {
  CatalogItem,
  CreateProposalBody,
  CreateProposalResponse,
} from '../../models';
import { ProposalService } from '../../services/proposal.service';

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
  @ViewChild('createWizardDialog') createWizard: EuiDialogComponent;
  @ViewChild('templateSelector')
  templateSelector: ProposalCreateTemplateSelectorComponent;

  private destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private proposalService: ProposalService,
    private router: Router,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.createForm = this.fb.group({
      templateName: new FormControl(
        { value: '', disabled: true },
        { validators: Validators.required },
      ),
      documentLanguage: new FormControl({ value: '', disabled: true }),
      confidentialityLevel: new FormControl({ value: '', disabled: true }),
      docPurpose: new FormControl('', {
        validators: [Validators.required, noWhitespaceValidator],
      }),
      templateId: new FormControl(
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
      });
      this.isNavigationAllowed = true;
    } else {
      this.createForm.patchValue({
        templateId: '',
        templateName: '',
        langCode: '',
        documentLanguage: '',
      });
      this.isNavigationAllowed = false;
    }
  }

  onNavigation(increment: number) {
    const newIndex: number = this.currentStepIndex + increment;
    if (newIndex >= 1 && newIndex <= this.stepsCount) {
      this.currentStepIndex = newIndex;
    }
  }

  onSelectStepRemoteNav(event: any) {
    this.currentStepIndex = event.index;
  }

  onSelectStep(event: UxWizardStep) {
    this.stepSelected = event;
  }

  openCreateWizard() {
    this.createWizard.openDialog();
  }

  async onCreate() {
    const { resolve, reject, promise } =
      createPromise<CreateProposalResponse>();

    this.proposalService.createProposal(this.getDataForCreate()).subscribe({
      next: async (response) => {
        this.createWizard.closeDialog();
        this.resetInitials();
        await this.router.navigate([`collection/${response.proposalId}`]);
        resolve(response);
      },
      error: reject,
    });

    return await promise;
  }

  onClose() {}

  closeDialog() {
    this.createWizard.closeDialog();
    this.resetInitials();
  }

  isFormValid(): boolean {
    return this.createForm.valid;
  }

  showCreateHideNext() {
    return this.currentStepIndex === 2;
  }

  private getDataForCreate(): CreateProposalBody {
    const { templateId, templateName, langCode, docPurpose, eeaRelevance } =
      this.createForm.getRawValue();
    return {
      templateId,
      templateName,
      langCode,
      docPurpose: docPurpose.trim(),
      eeaRelevance,
    };
  }

  private resetInitials() {
    this.templateSelector.reset();
    this.createForm.reset();
    this.stepSelected = null;
    this.currentStepIndex = 1;
  }
}
