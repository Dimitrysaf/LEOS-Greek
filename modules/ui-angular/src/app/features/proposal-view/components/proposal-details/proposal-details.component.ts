import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Document, Permission, AuthenticLanguage, CoverPageType} from '@leos/shared';
import {ProposalDetailsService} from "@/features/proposal-view/services/proposal-details.service";
import {Subject, takeUntil} from "rxjs";
import {toNumber} from "lodash-es";
import {EuiGrowlService} from "@eui/core";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-proposal-details',
  templateUrl: './proposal-details.component.html',
  styleUrls: ['./proposal-details.component.scss'],
})
export class ProposalDetailsComponent implements OnInit, OnDestroy {
  @Input() proposal: Document;
  permissions: Permission[];
  eeaRelevance: boolean;
  isAuthenticLang: boolean;
  isVerticalShift: boolean;
  packageTitle: string;
  authenticLang: string[];
  verticalShift: number;
  proposalLanguage: string;
  isAutononousAct: boolean;
  enableSave = false;
  coverPageType: CoverPageType | null;
  destroy$: Subject<any> = new Subject();

  allSelected = false;

  //TODO To be moved to the backend configuration
  languages = ['BG', 'CS', 'DA', 'DE', 'EL', 'EN', 'ES', 'ET', 'FI', 'FR','GA', 'HR', 'HU', 'IT', 'LT', 'LV',
    'MT', 'NL', 'PL', 'PT','RO', 'SK', 'SL', 'SV'];

  selectedLanguages: { [key: string]: boolean } = {};
  metadataChanged: { [key: string]: boolean } = {
    ['eeaRelevance']: false,
    ['packageTitle']: false,
    ['isAuthentigLang']: false,
    ['authenticLang']: false,
    ['coverPageType']: false,
    ['verticalShift']: false,
    ['crossReferences']: false,
  };

  constructor(
    protected detailsService: ProposalDetailsService,
    private growlService: EuiGrowlService,
    private translateService: TranslateService,
    ) {
    this.detailsService.permissions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((perms) => (this.permissions = perms));
    this.languages.forEach(lang => this.selectedLanguages[lang] = false);
  }

  ngOnInit(): void {
    this.languages.forEach(lang => {
      this.selectedLanguages[lang] = false;
    });

    this.eeaRelevance = this.proposal.metadata.eeaRelevance;
    this.packageTitle = this.proposal.metadata.packageTitle;
    this.authenticLang = this.proposal.metadata.authenticLang;

    this.coverPageType = this.proposal.metadata.coverPageType;
    if (this.coverPageType == null) {
      this.coverPageType = 'STANDARD';
    }
    this.isVerticalShift = this.coverPageType !== 'STANDARD';
    this.verticalShift = this.proposal.metadata.verticalShift != null ? toNumber(this.proposal.metadata.verticalShift) : 6.0;
    this.isAutononousAct = this.proposal.metadata.documentCollectionName == 'ACT_AUTO_COM';

    this.proposalLanguage = this.proposal.metadata.language;
    if (this.proposal.metadata.isAuthenticLang != null) {
      if (this.proposal.metadata.isAuthenticLang.includes("PROPOSAL_LANGUAGE")) {
        this.isAuthenticLang = true;
      } else if (this.proposal.metadata.isAuthenticLang == 'ALL') {
        this.isAuthenticLang = true;
        this.allSelected = true;
        this.languages.forEach(lang => {
          this.selectedLanguages[lang] = true;
        });
      }
    }

    if (this.isAuthenticLang) {
      this.authenticLang.forEach(lang => {
        if (this.proposal.metadata.isAuthenticLang == "PROPOSAL_LANGUAGE"
          || this.proposalLanguage.toUpperCase() != lang.toUpperCase()) {
          this.selectedLanguages[lang.toUpperCase()] = true
        }
      });
    }
  }

  handleChange(metadata: string) {
    this.enableSave = true;
    if (this.isAuthenticLang && !this.isThereSelectedLanguage()) {
      this.enableSave = false;
    }
    this.metadataChanged[metadata] = true;
  }

  handleEEAChange(e: boolean) {
    this.eeaRelevance = e;
    this.handleChange('eeaRelevance');
  }

  handleAuthLangChange(e: boolean) {
    this.handleChange('isAuthenticLang');
    if (!e) {
      this.languages.forEach(lang => {
        this.selectedLanguages[lang] = false;
      });
    }
  }

  isThereSelectedLanguage(): boolean {
    for (let lang of this.languages) {
      if (this.selectedLanguages[lang]) {
        return true;
      }
    }
    return this.allSelected;
  }

  handleCoverPageTypeChange(covertype: string) {
    this.handleChange('coverPageType');
    this.isVerticalShift = covertype != 'STANDARD';
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  saveGeneralDetails() {
    let isMetadataAuthenticLang : AuthenticLanguage;
    if (this.isAuthenticLang) {
      this.authenticLang = Object.keys(this.selectedLanguages)
        .filter(lang => this.selectedLanguages[lang]).map(lang => lang.toLowerCase());

      if (this.authenticLang.includes(this.proposalLanguage.toLowerCase())) {
        isMetadataAuthenticLang = 'PROPOSAL_LANGUAGE';
      } else {
        isMetadataAuthenticLang = 'NON_PROPOSAL_LANGUAGE';
      }

      if (this.authenticLang.length == this.languages.length) {
        this.authenticLang = [];
        isMetadataAuthenticLang = 'ALL';
      }
    } else {
      isMetadataAuthenticLang = 'FALSE';
      this.authenticLang = [];
    }

    let verticalShiftMetadata: string = null;
    if (this.isVerticalShift) {
      verticalShiftMetadata = this.verticalShift.toString();
    }
    this.detailsService.updateProposalMetadata(
      null,
      this.metadataChanged['eeaRelevance'] ? this.eeaRelevance : null,
      this.metadataChanged['packageTitle'] ? this.packageTitle : null,
      (this.metadataChanged['isAuthenticLang'] || this.metadataChanged['authenticLang']) ? isMetadataAuthenticLang : null,
      (this.metadataChanged['authenticLang'] || this.metadataChanged['isAuthenticLang']) ? this.authenticLang : null,
      (this.metadataChanged['coverPageType'] || this.metadataChanged['verticalShift']) ? this.coverPageType : null,
      (this.metadataChanged['coverPageType'] || this.metadataChanged['verticalShift']) ? verticalShiftMetadata : null
    ).subscribe({
      next: () => {
        this.detailsService.setProposalRef(this.proposal.ref);
        this.enableSave = false;
        this.growlService.growl({
          severity: 'success',
          summary: this.translateService.instant(
            'page.collection.details.message.success',
          ),
          life: 3000,
          isGrowlSticky: false,
          position: 'bottom-right',
        });
      },
      error: (err) => {
        this.growlService.growlError(this.translateService.instant(
          'page.collection.default-error',
        ),);
      },
    });
  }

  toggleAllLanguages() {
    this.languages.forEach(lang => {
      this.selectedLanguages[lang] = this.allSelected;
    });
  }

  onLanguageChange() {
    const allChecked = this.languages.every(lang => this.selectedLanguages[lang]);
    this.allSelected = allChecked;
    this.handleChange('authenticLang');
  }

  increase() {
    this.verticalShift = Math.round((this.verticalShift + 0.1) * 10) / 10;
    this.handleChange('verticalShift');
  }

  decrease() {
    if (this.verticalShift > 0) {
      this.verticalShift = Math.round((this.verticalShift - 0.1) * 10) / 10;
      this.handleChange('verticalShift');
    }
  }
}
