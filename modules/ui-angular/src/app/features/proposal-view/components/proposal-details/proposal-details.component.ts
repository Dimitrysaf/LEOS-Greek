import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Document, ProcedureType, Permission, AuthenticLanguage} from '@leos/shared';
import {ProposalDetailsService} from "@/features/proposal-view/services/proposal-details.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-proposal-details',
  templateUrl: './proposal-details.component.html',
  styleUrls: ['./proposal-details.component.scss'],
})
export class ProposalDetailsComponent implements OnInit, OnDestroy {
  @Input() proposal: Document;
  permissions: Permission[];
  @Output() eeaRelevanceChanged: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  eeaRelevance: boolean;
  isAuthenticLang: boolean;
  packageTitle: string;
  authenticLang: string[];
  proposal_language: string;
  isAutononousAct: boolean;
  destroy$: Subject<any> = new Subject();

  allSelected = false;

  //TODO To be moved to the backend configuration
  languages = ['BG', 'CS', 'DA', 'DE', 'EL', 'EN', 'ES', 'ET', 'FI', 'FR','GA', 'HR', 'HU', 'IT', 'LT', 'LV',
    'MT', 'NL', 'PL', 'PT','RO', 'SK', 'SL', 'SV'];

  selectedLanguages: { [key: string]: boolean } = {};

  constructor(protected detailsService: ProposalDetailsService,) {
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
    this.isAutononousAct = this.proposal.metadata.documentCollectionName == 'ACT_AUTO_COM';

    this.proposal_language = this.proposal.metadata.language;
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
          || this.proposal_language.toUpperCase() != lang.toUpperCase()) {
          this.selectedLanguages[lang.toUpperCase()] = true
        }
      });
    }
  }

  handleEEAChange(e: boolean) {
    this.eeaRelevanceChanged.emit(e);
  }

  handleAuthLangChange(e: boolean) {
    if (!e) {
      this.languages.forEach(lang => {
        this.selectedLanguages[lang] = false;
      });
    }
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

      if (this.authenticLang.includes(this.proposal_language.toLowerCase())) {
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
    }

    this.detailsService.updateProposalMetadata(
      this.proposal.metadata.docPurpose,
      this.eeaRelevance,
      this.packageTitle,
      isMetadataAuthenticLang,
      this.authenticLang,
    );
  }


  toggleAllLanguages() {
    this.languages.forEach(lang => {
      this.selectedLanguages[lang] = this.allSelected;
    });
  }

  onLanguageChange() {
    const allChecked = this.languages.every(lang => this.selectedLanguages[lang]);
    this.allSelected = allChecked;
  }

  quantity: number = 1.0;

  increase() {
    this.quantity = Math.round((this.quantity + 0.1) * 10) / 10;
  }

  decrease() {
    this.quantity = Math.round((this.quantity - 0.1) * 10) / 10;
  }
}
