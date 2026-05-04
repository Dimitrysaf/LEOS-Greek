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
import {Subject, takeUntil} from 'rxjs';

import {
  ApplicationRole,
  CatalogItem,
  CreateProposalBody,
  CreateProposalCopy,
  CreateProposalResponse,
} from '@/shared/models';
import { ProposalService } from '@/shared/services/proposal.service';
import { createPromise } from '@/shared/utils';
import { noWhitespaceValidator } from '@/shared/utils/validators';
import { EuiWizardStep } from '@eui/components/eui-wizard';
import {
  ProposalCreateTemplateSelectorComponent
} from "@/shared/components/proposal-create-template-selector/proposal-create-template-selector.component";
import {appConfig} from "../../../../config";
import {AppConfigService} from "@/core/services/app-config.service";
import {ProposalDetailsService} from "@/features/proposal-view/services/proposal-details.service";
const defaultLanguage =
  appConfig.global.i18n.i18nService.defaultLanguage.toUpperCase();
@Component({
  selector: 'app-proposal-create-wizard',
  templateUrl: './proposal-create-wizard.component.html',
  styleUrls: ['./proposal-create-wizard.component.scss'],
})
export class ProposalCreateWizardComponent implements OnInit, OnDestroy {
  @ViewChild('templateSelector') templateSelector: ProposalCreateTemplateSelectorComponent;
  stepSelected: any;
  isNavigationAllowed = false;
  currentStepIndex = 1;
  stepsCount = 3;
  isGuidanceApproved = false;

  createForm: FormGroup;
  selectedTemplate: CatalogItem | null;
  selectedLanguage: string;
  isCopyChangeAct = false;
  nonEditablePartOfTitle: string;
  editableTitle: string;
  isKeepAct = false;
  proposalTemplate: string;
  userRoles: ApplicationRole[];
  isStepOneCompleted = false;
  isStepTwoCompleted = false;
  private proposalRef:string;
  private proposalLanguage: string;
  documentCollectionName: string;
  private destroy$ = new Subject();
  dgList: string[] = [];
  selectedDg: string;

  public activeTabIndex = 0;

  constructor(
    @Inject(DIALOG_COMPONENT_CONFIG) private config,
    private fb: FormBuilder,
    private proposalService: ProposalService,
    private router: Router,
    private translateService: TranslateService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private appConfig: AppConfigService,
    private detailsService: ProposalDetailsService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.isCopyChangeAct = this.config.isCopyChangeAct;
    this.isKeepAct = this.isCopyChangeAct;
    this.isNavigationAllowed = this.isKeepAct;
    this.nonEditablePartOfTitle =  this.config.nonEditablePartOfTitle;
    this.editableTitle =  this.config.editableTitle;
    this.proposalTemplate =  this.config.proposalTemplate;
    this.proposalRef =  this.config.proposalRef;
    this.proposalLanguage =  this.config.proposalLanguage;
    this.documentCollectionName =  this.config.documentCollectionName;
    this.userRoles =  this.config.userRoles;
    this.initCreateForm();
    if(this.isKeepAct){
      this.createForm.get('docPurpose').setValue(this.editableTitle + '-copy');
    }
    if (!this.isCopyChangeAct) {
      this.appConfig.config.subscribe((config) => {
        this.proposalService.loadCustomTemplateCatalog(config.user.defaultEntity.organizationName);
        this.getDgList(config);
        //this.proposalService.loadCustomTemplateCatalog(this.appConfig.user.defaultEntity.organizationName);
      });
      ``}
  }

  getDgList(config) {
    let isSupportRole :boolean =config.user.roles?.includes('SUPPORT');
    if (isSupportRole) {
      this.detailsService.getAllOrganizations()
        .pipe(takeUntil(this.destroy$))
        .subscribe(organizations => {
          this.dgList = organizations;
          this.selectedDg = this.dgList.find(dg => dg === config.user.defaultEntity.organizationName);
        });
    } else {
      this.dgList = config.user.entities.map(entity => entity.organizationName);
      this.selectedDg = this.dgList.find(dg => dg === config.user.defaultEntity.organizationName);
    }
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

  onTabSelected({index}: { index: number }) {
    this.activeTabIndex = index;
    this.selectedTemplate = null;
    this.selectedLanguage = null;
    this.isNavigationAllowed = false;
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
        key,
        fromCustomTemplate: !!(template.customName)
      });
      this.isNavigationAllowed = true;
    } else {
      this.createForm.patchValue({
        templateId: '',
        templateName: '',
        langCode: '',
        documentLanguage: '',
        key: '',
        fromCustomTemplate: false,
      });
      this.isNavigationAllowed = false;
    }
  }

  onNavigation(increment: number) {
    const newIndex: number = this.currentStepIndex + increment;
    if (newIndex >= 1 && newIndex <= this.stepsCount) {
      this.currentStepIndex = newIndex;
      // Update completion flags based on current step
      this.isStepOneCompleted = this.currentStepIndex >= 2;
      this.isStepTwoCompleted = this.currentStepIndex >= 3;
    }
    if(this.isStepTwoCompleted){
      this.createForm.get('changeCopyAct').disable();
      if (this.isCopyChangeAct && this.isKeepAct){
        let catalogTemplates = this.templateSelector.catalogTemplates;
        let template = catalogTemplates.get(this.proposalTemplate);
        const templateName = this.proposalService.getTranslation(
          template.names,
          defaultLanguage,
        );
        const documentLanguage = this.proposalService.getTranslation(
          template.languages,
          defaultLanguage,
        );
        this.createForm.patchValue({
          templateId: template.id,
          templateName,
          langCode: defaultLanguage,
          documentLanguage,
          key: template.key,
        });
      }


    }
    else if (this.isStepOneCompleted){
      this.createForm.get('changeCopyAct').disable();
    }
    else{
      this.createForm.get('changeCopyAct').enable();
    }


  }

  onSelectStepRemoteNav(event: any) {
    if (this.currentStepIndex > event.index) {
      this.isStepOneCompleted = event.index >= 2;
      this.isStepTwoCompleted = event.index >= 3;
    } else if (this.currentStepIndex < event.index) {
      this.isStepOneCompleted = event.index >= 2;
      this.isStepTwoCompleted = event.index >= 3;
    }
    this.currentStepIndex = event.index;
  }

  onSelectStep(event: EuiWizardStep) {
    this.stepSelected = event;
  }

  async onCreate() {
    const { resolve, reject, promise } =
      createPromise<CreateProposalResponse>();
    if (this.isCopyChangeAct) {
        this.proposalService.copyProposal(this.getDataForCopyChange()).subscribe({
          next: async (response) => {
            this.config.closeDialog();
            this.resetInitials();
            await this.router.navigate([`collection/${response.proposalId}`]);
            resolve(response);
          },
          error: reject,
        });
    } else {
      this.proposalService.createProposal(this.getDataForCreate()).subscribe({
        next: async (response) => {
          this.config.closeDialog();
          this.resetInitials();
          await this.router.navigate([`collection/${response.proposalId}`]);
          resolve(response);
        },
        error: reject,
      });
    }

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
    return this.currentStepIndex === 3;
  }

  onGuidanceApprovalChange(isApproved: boolean) {
    this.isGuidanceApproved = isApproved;
  }

  handleKeepCopyRadioChange(event: any) {
    const { value } = event.target;
    this.isKeepAct = (value === 'true');
    // Reset or reload the template selector component
    if (this.templateSelector) {
      // Option 1: Reset internal state of the component
      this.templateSelector.resetInit(this.isCopyChangeAct && this.isKeepAct); // Implement this method in ProposalCreateTemplateSelectorComponent
      // Option 2: Reset selected template/language to force reload
      this.selectedTemplate = null;
      this.selectedLanguage = null;
    }

    if(this.isKeepAct){
      this.createForm.get('docPurpose').setValue(this.editableTitle + '-copy');
      this.selectedTemplate=null;
      this.selectedLanguage=null;
      this.updateTemplateAndLanguage();
      this.isNavigationAllowed = true;
    }else{
      this.createForm.get('docPurpose').setValue(this.editableTitle + '-copy');
      this.isNavigationAllowed = false;
    }
  }

  private getDataForCreate(): CreateProposalBody {
    const { templateId, templateName, langCode, docPurpose, eeaRelevance, customTemplateAct, fromCustomTemplate, key } =
      this.createForm.getRawValue();
    return {
      templateId,
      templateName,
      langCode,
      docPurpose: docPurpose.trim(),
      eeaRelevance,
      customTemplateAct,
      fromCustomTemplate,
      key
    };
  }

  private getDataForCopyChange(): CreateProposalCopy {
    let { templateId, templateName, langCode, docPurpose, eeaRelevance, customTemplateAct, fromCustomTemplate, key } = this.createForm.getRawValue();
    if(this.isKeepAct){
      return {
        templateId,
        templateName: this.proposalTemplate,
        langCode: this.proposalLanguage,
        docPurpose: docPurpose.trim(),
        eeaRelevance,
        customTemplateAct,
        fromCustomTemplate,
        key: this.proposalTemplate,
        proposalRef: this.proposalRef,
      };
    }else{
      return {
        templateId,
        templateName,
        langCode,
        docPurpose: docPurpose.trim(),
        eeaRelevance,
        customTemplateAct,
        fromCustomTemplate,
        key,
        proposalRef: this.proposalRef,
      };
    }
  }
  private initCreateForm() {
    this.createForm = this.fb.group({
      templateName: new FormControl(
        { value: '', disabled: true },
        { validators: Validators.required },
      ),
      documentLanguage: new FormControl({ value: '', disabled: true }),
      linguisticVersions: new FormControl({ value: [], disabled: true }),
      confidentialityLevel: new FormControl({
        value: this.translateService.instant(
          'page.workspace.create-form.document.confidentiality-level-predefined-value',
        ),
        disabled: true,
      }),
      docPurpose: new FormControl(  this.isCopyChangeAct ? this.editableTitle :
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
      customTemplateAct: new FormControl(false, { validators: Validators.required }),
      fromCustomTemplate: new FormControl(false, { validators: Validators.required }),
      changeCopyAct:  new FormControl({value: 'true' as 'true' | 'false', disabled: false, }),
      guidanceApproval: new FormControl(false, { validators: Validators.required }),
    });
  }

  private resetInitials() {
    this.createForm.reset();
    this.stepSelected = null;
    this.currentStepIndex = 1;
    this.initCreateForm();
    this.isNavigationAllowed = false;
    this.isGuidanceApproved = false;
    this.isStepTwoCompleted = false;
    if(this.isCopyChangeAct){
      this.isKeepAct = true;
      this.createForm.get('changeCopyAct').setValue('true');
    }
  }
}
