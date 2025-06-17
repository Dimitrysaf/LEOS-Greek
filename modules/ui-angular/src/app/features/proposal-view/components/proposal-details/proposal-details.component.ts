import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Document, Permission} from '@leos/shared';
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
  destroy$: Subject<any> = new Subject();


  allSelected = false;

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
    this.eeaRelevance = this.proposal.metadata.eeaRelevance;
    this.languages.forEach(lang => {
      this.selectedLanguages[lang] = false;
    });
  }

  handleEEAChange(e: boolean) {
    this.eeaRelevanceChanged.emit(e);
  }

  handleAuthLangChange(e: boolean) {
    //this.eeaRelevanceChanged.emit(e);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  saveGeneralDetails() {

    if(this.isAuthenticLang) {
      this.authenticLang = Object.keys(this.selectedLanguages)
        .filter(lang => this.selectedLanguages[lang]);
    }

    this.detailsService.updateProposalMetadata(
      this.proposal.metadata.docPurpose,
      this.eeaRelevance,
      this.packageTitle,
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
