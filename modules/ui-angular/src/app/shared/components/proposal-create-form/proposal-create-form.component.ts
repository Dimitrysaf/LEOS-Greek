import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges,} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AppConfigService} from "@/core/services/app-config.service";

@Component({
  selector: 'app-proposal-create-form',
  templateUrl: './proposal-create-form.component.html',
  styleUrls: ['./proposal-create-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalCreateFormComponent implements OnInit, OnChanges {
  @Input() createForm: FormGroup;
  @Input() isCustomTemplate!: boolean;
  @Input() translationKey: 'document' | 'draft' = 'document';
  canCreateTemplate = false;
  languages = [];
  proposalLanguage: string;

  constructor(private appConfig: AppConfigService) {
    this.appConfig.config.subscribe((config) => {
      this.canCreateTemplate = config.userAppPermissions.includes('CAN_CREATE_TEMPLATE');
      this.languages = config.languages.map(language => language.toUpperCase());
    });
  }

  ngOnInit() {
    this.addLanguageFormControls();
    this.onProposalLanguageChange();
  }

  private addLanguageFormControls() {
    this.createForm.addControl('allSelected', new FormControl(false));
    this.languages.forEach(lang => {
      this.createForm.addControl(lang, new FormControl(false));
    });
  }

  private onProposalLanguageChange() {
    this.createForm.controls['langCode'].valueChanges.subscribe(proposalLang => {
      this.proposalLanguage = proposalLang;
      const previousProposalLang = this.languages.find(lang => this.createForm.controls[lang].disabled);
      if (previousProposalLang) {
        this.createForm.controls[previousProposalLang].setValue(false);
        this.createForm.controls[previousProposalLang].enable();
      }
      this.createForm.controls[proposalLang].setValue(true);
      this.createForm.controls[proposalLang].disable();
      this.updateSelectedLanguages();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isCustomTemplate?.currentValue) {
      this.createForm.patchValue({
        customTemplateAct: false
      });
    }
  }

  toggleAllLanguages(event: any) {
    const allSelected = event.target.checked;
    this.languages.forEach(lang => {
      if (this.createForm.controls[lang].enabled) {
        this.createForm.controls[lang].patchValue(allSelected);
      }
    });
    this.createForm.patchValue({
      linguisticVersions: allSelected ? this.languages.filter(lang => lang != this.proposalLanguage) : [],
    });
  }

  updateSelectedLanguages() {
    this.createForm.patchValue({
      linguisticVersions: this.languages.filter(lang => this.createForm.controls[lang].value && lang !== this.proposalLanguage),
      allSelected: this.languages.every(lang => this.createForm.controls[lang].value)
    });
  }
}
