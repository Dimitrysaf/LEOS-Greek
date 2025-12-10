import {Component, EventEmitter, Input, OnChanges, Output, ViewChild} from "@angular/core";
import {EuiDialogComponent} from "@eui/components/eui-dialog";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ProposalDetailsService} from "@/features/proposal-view/services/proposal-details.service";
import {AppConfigService} from "@/core/services/app-config.service";
import {MilestoneDescriptor} from "@/shared/components/proposal-milestone-view/proposal-milestone-view.component";

@Component({
  selector: 'app-proposal-linguistic-versions-dialog',
  templateUrl: './proposal-linguistic-versions-dialog.component.html',
  styleUrls: ['./proposal-linguistic-versions-dialog.component.scss']
})
export class ProposalLinguisticVersionsDialogComponent implements OnChanges {
  @Input() proposalRef: string;
  @Input() proposalLanguage: string;
  @Input() translatedLanguages: string[] = [];
  @Input() milestone: MilestoneDescriptor;
  @Output() closed = new EventEmitter();
  languages: string[];

  @ViewChild('addLinguisticVersionsDialog') addLinguisticVersionsDialog: EuiDialogComponent;
  linguisticVersionsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private proposalDetailsService: ProposalDetailsService,
    private appConfig: AppConfigService
  ) {
    this.appConfig.config.subscribe((config) => {
      this.languages = config.languages.map(language => language.toUpperCase());
    });}

  ngOnChanges() {
    this.initLinguisticVersionsForm();
  }

  open() {
    this.addLinguisticVersionsDialog.openDialog();
  }

  close() {
    this.addLinguisticVersionsDialog.closeDialog();
    this.closed.emit();
  }

  addLinguisticVersions() {
    this.proposalDetailsService.createLinguisticVersions(this.milestone, this.getNewLinguisticVersions(), this.proposalRef);
    this.close();
  }

  toggleAllLanguages(event: any) {
    const allSelected = event.target.checked;
    this.languages.forEach(lang => {
      if (this.linguisticVersionsForm.controls[lang].enabled) {
        this.linguisticVersionsForm.controls[lang].patchValue(allSelected);
      }
    });
    this.linguisticVersionsForm.patchValue({
      newLinguisticVersions: allSelected ? this.languages.filter(lang => !this.isLanguageInProposal(lang)) : [],
    });
  }

  updateSelectedLanguages() {
    this.linguisticVersionsForm.patchValue({
      newLinguisticVersions: this.languages.filter(lang => this.linguisticVersionsForm.controls[lang].value && !this.isLanguageInProposal(lang)),
      allSelected: this.languages.every(lang => this.linguisticVersionsForm.controls[lang].value)
    });
  }

  private initLinguisticVersionsForm() {
    if (!this.linguisticVersionsForm) {
      this.linguisticVersionsForm = this.fb.group({
        newLinguisticVersions: new FormControl({ value: [], disabled: true }),
        allSelected: new FormControl(this.languages.every(lang => this.isLanguageInProposal(lang)))
      });
    } else {
      this.linguisticVersionsForm.reset({newLinguisticVersions: [], allSelected: this.languages.every(lang => this.isLanguageInProposal(lang))});
    }

    this.languages.forEach(lang => {
      const isLanguageInProposal = this.isLanguageInProposal(lang);
      this.linguisticVersionsForm.setControl(lang, new FormControl({ value: isLanguageInProposal, disabled: isLanguageInProposal }));
    });
  }

  private isLanguageInProposal(lang: string) {
    return this.proposalLanguage?.toLowerCase() === lang.toLowerCase() ||
      this.translatedLanguages?.some(translated => translated.toLowerCase() === lang.toLowerCase());
  }

  /** Valid when the user has checked at least one new language */
  get isFormValid(): boolean {
    return this.linguisticVersionsForm.controls['newLinguisticVersions'].value.length > 0;
  }

  private getNewLinguisticVersions(): string[] {
    return this.linguisticVersionsForm.controls['newLinguisticVersions'].value;
  }
}
