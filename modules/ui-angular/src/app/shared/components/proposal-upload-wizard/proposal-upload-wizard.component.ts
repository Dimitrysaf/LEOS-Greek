import { HttpEventType } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  Inject,
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
import { Router } from '@angular/router';
import { DIALOG_COMPONENT_CONFIG } from '@eui/components/eui-dialog';
import { EuiFileUploadComponent } from '@eui/components/eui-file-upload';
import { UxWizardStep } from '@eui/components/legacy/ux-wizard-step';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import {
  CatalogItem,
  CreateProposalBody,
  ErrorVO,
  UpdateProposalMetadataModel,
} from '@/shared/models';
import { EnvironmentService } from '@/shared/services/enviroment.service';
import { ProposalService } from '@/shared/services/proposal.service';
import { cleanDelInsert } from '@/shared/utils/string.utils';
import { noWhitespaceValidator } from '@/shared/utils/validators';

import { GLOBAL } from '../../../../config/global';

@Component({
  selector: 'app-proposal-upload-wizard',
  templateUrl: './proposal-upload-wizard.component.html',
  styleUrls: ['./proposal-upload-wizard.component.scss'],
})
export class ProposalUploadWizardComponent implements OnInit, OnDestroy {
  stepSelected: any;
  isNavigationAllowed = false;
  currentStepIndex = 1;
  stepsCount = 2;

  uploadForm: FormGroup;
  selectedTemplate: CatalogItem | null;
  selectedLanguage: string;
  errorsVO: ErrorVO[];
  step1Complete = false;
  fileName = '';
  @ViewChild('uploadFile') uploadEuiFile: EuiFileUploadComponent;
  public progress = 0;

  private destroy$ = new Subject();

  constructor(
    @Inject(DIALOG_COMPONENT_CONFIG) private config,
    private fb: FormBuilder,
    private proposalService: ProposalService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public translateService: TranslateService,
    public environmentService: EnvironmentService,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.initCreateForm();
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
      this.uploadForm.patchValue({
        templateId: template.id,
        templateName,
        langCode,
        documentLanguage,
      });
    } else {
      this.uploadForm.patchValue({
        templateId: '',
        templateName: '',
        langCode: '',
        documentLanguage: '',
      });
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
    const legFile = this.uploadForm.get('legFile').value[0];
    this.proposalService.uploadProposal(legFile).subscribe((e) => {
      if (e.type === HttpEventType.UploadProgress) {
        this.progress = Math.round((100 * e.loaded) / e.total);
      }
      if (e.type === HttpEventType.Response) {
        if (e.ok) {
          const docPurpose = this.uploadForm.get('docPurpose').value.trim();
          const eeaRelevance = this.uploadForm.get('eeaRelevance').value;
          const requestData: UpdateProposalMetadataModel = {
            docPurpose,
            eeaRelevance,
          };

          this.proposalService
            .updateProposalMetadata(e.body.proposalId, requestData)
            .subscribe((response) => {
              this.router.navigate([`collection/${e.body.proposalId}`]);
              this.resetInitials();
              this.closeDialog();
            });
        }
      }
    });
  }

  closeDialog() {
    this.config?.closeDialog();
    this.resetInitials();
  }

  isFormValid(): boolean {
    return this.uploadForm.valid;
  }

  showCreateHideNext() {
    return this.currentStepIndex === 2;
  }

  onDrop() {
    if (this.uploadEuiFile.files.length > 1) {
      this.uploadEuiFile.files.shift();
      this.errorsVO = null;
      this.stepSelected = null;
      this.currentStepIndex = 1;
    }
    this.validateLegFile();
  }

  initCreateForm() {
    this.uploadForm = this.fb.group({
      legFile: new FormControl(null, Validators.required),
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
      eeaRelevance: new FormControl(
        { value: false, disabled: true },
        { validators: Validators.required },
      ),
      eeaRelevanceText: new FormControl({ value: '', disabled: true }),
    });
  }

  resetInitials() {
    this.uploadForm.reset();
    this.errorsVO = null;
    this.stepSelected = null;
    this.currentStepIndex = 1;
    this.isNavigationAllowed = false;
    this.initCreateForm();
  }

  showResetButton() {
    return this.uploadEuiFile && this.uploadEuiFile.files?.length > 0;
  }

  private getDataForCreate(): CreateProposalBody {
    const { templateId, templateName, langCode, docPurpose, eeaRelevance } =
      this.uploadForm.getRawValue();
    return { templateId, templateName, langCode, docPurpose, eeaRelevance };
  }

  private validateLegFile() {
    const legFile = this.uploadEuiFile.files[0];

    if (legFile === undefined) return;
    this.proposalService
      .validateLegFile(legFile)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.fileName = (legFile as File).name;
        if (res.errors) {
          this.errorsVO = res.errors;
          this.uploadForm.get('legFile').setValue(null);
          this.isNavigationAllowed = false;
          this.cdr.markForCheck();
        }
        if (res.errors === null && res.documentToBeCreated) {
          this.errorsVO = null;
          this.isNavigationAllowed = true;
          this.step1Complete = true;
          this.currentStepIndex = 2;
          this.uploadForm.patchValue({
            templateName: res.documentToBeCreated.metadata.templateName,
            docPurpose: cleanDelInsert(
              res.documentToBeCreated.metadata.docPurpose,
            ),
            eeaRelevance: res.documentToBeCreated.metadata.eeaRelevance,
            packageTitle: res.documentToBeCreated.metadata.packageTitle,
            internalReference: res.documentToBeCreated.metadata.internalRef,
            documentLanguage: this.getLanguage(
              res.documentToBeCreated.metadata.language,
            ),
          });
        }
      });
  }

  private getLanguage(languageCode: string): string {
    if (GLOBAL.i18n.i18nService.languages.includes(languageCode)) {
      return this.translateService.instant(`global.language.${languageCode}`);
    }
    return '';
  }
}
