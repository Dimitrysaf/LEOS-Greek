import {Component, EventEmitter, Input, OnChanges, Output, ViewChild} from "@angular/core";
import {EuiDialogComponent} from "@eui/components/eui-dialog";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ProposalDetailsService} from "@/features/proposal-view/services/proposal-details.service";
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
  @Input() allAvailableLanguages: string[] = [];
  @Input() milestone: MilestoneDescriptor;
  @Output() closed = new EventEmitter();

  @ViewChild('addLinguisticVersionsDialog') addLinguisticVersionsDialog: EuiDialogComponent;
  linguisticVersionsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private proposalDetailsService: ProposalDetailsService,
  ) {}

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
    this.allAvailableLanguages.forEach(lang => {
      if (this.linguisticVersionsForm.controls[lang].enabled) {
        this.linguisticVersionsForm.controls[lang].patchValue(allSelected);
      }
    });
    this.linguisticVersionsForm.patchValue({
      newLinguisticVersions: allSelected ? this.allAvailableLanguages.filter(lang => !this.isLanguageInProposal(lang)) : [],
    });
  }

  updateSelectedLanguages() {
    this.linguisticVersionsForm.patchValue({
      newLinguisticVersions: this.allAvailableLanguages.filter(lang => this.linguisticVersionsForm.controls[lang].value && !this.isLanguageInProposal(lang)),
      allSelected: this.allAvailableLanguages.every(lang => this.linguisticVersionsForm.controls[lang].value)
    });
  }

  private initLinguisticVersionsForm() {
    const isEveryLanguageInProposal = this.allAvailableLanguages.every(lang => this.isLanguageInProposal(lang));
    if (!this.linguisticVersionsForm) {
      this.linguisticVersionsForm = this.fb.group({
        newLinguisticVersions: new FormControl({ value: [], disabled: true }),
        allSelected: new FormControl({ value: isEveryLanguageInProposal, disabled: isEveryLanguageInProposal }),
      });
    } else {
      this.linguisticVersionsForm.reset({ newLinguisticVersions: [], allSelected: { value: isEveryLanguageInProposal, disabled: isEveryLanguageInProposal } });
    }

    this.allAvailableLanguages.forEach(lang => {
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
