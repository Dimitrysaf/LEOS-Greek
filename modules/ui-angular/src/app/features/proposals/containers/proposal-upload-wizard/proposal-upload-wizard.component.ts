import { HttpEventType } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { EuiDialogComponent } from '@eui/components/eui-dialog';
import { EuiFileUploadComponent } from '@eui/components/eui-file-upload';
import { UxWizardStep } from '@eui/components/legacy/ux-wizard-step';
import { TranslateService } from '@ngx-translate/core';
import { debounce, debounceTime, filter, Subject, takeUntil, tap } from 'rxjs';

import { EnvironmentService } from '@/shared/services/enviroment.service';

import {
  CatalogItem,
  CreateProposalBody,
  UpdateProposalMetadataModel,
} from '../../models';
import { ErrorVO } from '../../models/upload-response.model';
import { ProposalService } from '../../services/proposal.service';

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
  @ViewChild('uploadWizard') uploadWizard: EuiDialogComponent;
  @ViewChild('uploadFile') uploadEuiFile: EuiFileUploadComponent;
  public progress = 0;

  private destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private proposalService: ProposalService,
    private router: Router,
    public tranlsateService: TranslateService,
    public enviromentService: EnvironmentService,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.uploadForm = this.fb.group({
      legFile: new FormControl(null, Validators.required),
      templateName: new FormControl(
        { value: '', disabled: true },
        { validators: Validators.required },
      ),
      documentLanguage: new FormControl({ value: '', disabled: true }),
      confidentialityLevel: new FormControl({ value: '', disabled: true }),
      docPurpose: new FormControl('', { validators: Validators.required }),
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

  openUploadWizard() {
    this.uploadWizard.openDialog();
  }

  onCreate() {
    const legFile = this.uploadForm.get('legFile').value[0];
    this.proposalService.uploadProposal(legFile).subscribe((e) => {
      if (e.type === HttpEventType.UploadProgress) {
        this.progress = Math.round((100 * e.loaded) / e.total);
      }
      if (e.type === HttpEventType.Response) {
        if (e.ok) {
          const docPurpose = this.uploadForm.get('docPurpose').value;
          const eeaRelevance = this.uploadForm.get('eeaRelevance').value;
          const requestData: UpdateProposalMetadataModel = {
            docPurpose,
            eeaRelevance,
          };

          this.proposalService
            .updateProposalMetadata(e.body.proposalId, requestData)
            .subscribe((response) => {
              console.log(
                'this.proposalService.updateProposalMetadata:',
                response,
              );
              this.router.navigate([`collection/${e.body.proposalId}`]);
              this.resetInitials();
              this.closeDialog();
            });
        }
      }
    });
  }

  onClose() {}

  closeDialog() {
    this.uploadWizard.closeDialog();
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

  resetInitials() {
    this.uploadForm.reset();
    this.errorsVO = null;
    this.stepSelected = null;
    this.currentStepIndex = 1;
    this.isNavigationAllowed = false;
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
        if (res.errors) {
          this.errorsVO = res.errors;
          this.fileName = (legFile as File).name;
          this.uploadForm.get('legFile').setValue(null);
          this.isNavigationAllowed = false;
        }
        if (res.errors === null && res.documentToBeCreated) {
          this.errorsVO = null;
          this.isNavigationAllowed = true;
          this.step1Complete = true;
          this.currentStepIndex = 2;
          this.uploadForm.patchValue({
            templateName: res.documentToBeCreated.metadata.templateName,
            documentLanguage: res.documentToBeCreated.metadata.language,
            docPurpose: res.documentToBeCreated.metadata.docPurpose,
            eeaRelevance: res.documentToBeCreated.metadata.eeaRelevance,
            confidentialityLevel:
              res.documentToBeCreated.metadata.securityLevel,
            packageTitle: res.documentToBeCreated.metadata.packageTitle,
            internalReference: res.documentToBeCreated.metadata.internalRef,
          });
        }
      });
  }
}
