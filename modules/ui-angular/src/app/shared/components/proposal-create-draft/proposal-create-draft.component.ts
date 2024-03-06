import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DIALOG_COMPONENT_CONFIG } from '@eui/components/eui-dialog';
import { UxWizardStep } from '@eui/components/legacy/ux-wizard-step';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { ProposalDetailsService } from '@/features/proposal-view/services/proposal-details.service';
import {
  CatalogItem,
  CreateDraftBody,
  CreateExplanatoryDocument,
} from '@/shared';
import { ProposalService } from '@/shared/services/proposal.service';
import { noWhitespaceValidator } from '@/shared/utils/validators';

import { ProposalCreateTemplateSelectorComponent } from '../proposal-create-template-selector/proposal-create-template-selector.component';

@Component({
  selector: 'app-proposal-create-draft',
  templateUrl: './proposal-create-draft.component.html',
})
export class ProposalCreateDraftComponent implements OnInit, OnDestroy {
  stepSelected: any;
  isNavigationAllowed = false;
  currentStepIndex = 1;
  stepsCount = 2;

  createForm: FormGroup;
  selectedTemplate: CatalogItem | null;
  selectedLanguage: string;
  @ViewChild('templateSelector')
  templateSelector: ProposalCreateTemplateSelectorComponent;

  fromProposal = true;
  private destroy$ = new Subject();

  constructor(
    @Inject(DIALOG_COMPONENT_CONFIG) private config,
    private fb: FormBuilder,
    private proposalService: ProposalService,
    private proposalDetailsService: ProposalDetailsService,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
  ) {
    this.fromProposal = config?.fromProposal;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    if (this.fromProposal) {
      this.createForm = this.fb.group({
        templateId: new FormControl('', { validators: Validators.required }),
        templateName: new FormControl('', {}),
      });
    }
    if (!this.fromProposal) {
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
        docPurpose: new FormControl('', {
          validators: [Validators.required, noWhitespaceValidator],
        }),
        templateId: new FormControl(
          { value: '', disabled: true },
          { validators: Validators.required },
        ),
        langCode: new FormControl({ value: '', disabled: true }, {}),
        internalReference: new FormControl({ value: '', disabled: true }),
        interInstitutionalReference: new FormControl({
          value: '',
          disabled: true,
        }),
        packageTitleCheck: new FormControl({ value: false, disabled: true }),
        packageTitle: new FormControl({ value: '', disabled: true }),
        eeaRelevance: new FormControl(false, {
          validators: Validators.required,
        }),
        eeaRelevanceText: new FormControl({ value: '', disabled: true }),
      });
    }
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

    if (template) {
      const templateName = this.proposalService.getTranslation(template.names);
      const documentLanguage = this.proposalService.getTranslation(
        template.languages,
        langCode,
      );
      this.createForm.patchValue({
        templateId: template.id,
        templateName,
        documentLanguage,
        langCode,
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

  onCreate() {
    if (!this.fromProposal) {
      this.proposalService
        .createExplanatoryDocument(this.getDataForCreateDraftProposal())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: async (res) => {
            this.proposalService.setPage(-1);
            this.closeDialog();
            if (res.ref) {
              await this.router.navigate([`collection/${res.ref}`]);
            }
          },
          error: (err) => console.log(err),
        });
    }
    if (this.fromProposal) {
      this.proposalDetailsService
        .createExplanatory(this.getDataForCreateExplanatory())
        .subscribe({
          next: async (response) => {
            this.closeDialog();
            this.resetInitials();
            if (this.fromProposal)
              this.route.params
                .pipe(takeUntil(this.destroy$))
                .subscribe(({ proposalId }) => {
                  this.proposalDetailsService.setProposalRef(proposalId);
                });
            if (!this.fromProposal)
              await this.router.navigate([`collection/${response.proposalId}`]);
          },
          error: (err) => {},
        });
    }
  }

  closeDialog() {
    this.config?.closeDialog();
    this.resetInitials();
  }

  isFormValid(): boolean {
    return this.createForm.valid;
  }

  showCreateHideNext() {
    if (this.fromProposal) return true;
    return this.currentStepIndex === 2;
  }

  private getDataForCreateExplanatory(): CreateDraftBody {
    const proposalRef = this.proposalDetailsService.proposalRef;
    const { templateId } = this.createForm.getRawValue();
    return {
      template: templateId.split(';')[1],
      proposalRef: proposalRef ?? null,
    };
  }

  private getDataForCreateDraftProposal(): CreateExplanatoryDocument {
    const { templateId, docPurpose, eeaRelevance } =
      this.createForm.getRawValue();
    return {
      templateId,
      docPurpose: docPurpose.trim(),
      eeaRelevance,
    };
  }

  private resetInitials() {
    this.templateSelector.reset();
    this.createForm.reset();
    this.stepSelected = null;
    this.currentStepIndex = 1;
    this.initForm();
    this.isNavigationAllowed = false;
  }
}
