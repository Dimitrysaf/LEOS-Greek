import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Document, Permission, AuthenticLanguage, CoverPageType, ProposalDetailsLists, Metadata, DetailsTabExclusions} from '@leos/shared';
import {ProposalDetailsService} from "@/features/proposal-view/services/proposal-details.service";
import {Subject, takeUntil} from "rxjs";
import {cloneDeep, toNumber} from "lodash-es";
import {EuiGrowlService} from "@eui/core";
import {TranslateService} from "@ngx-translate/core";
import moment from 'moment';

@Component({
  selector: 'app-proposal-details',
  templateUrl: './proposal-details.component.html',
  styleUrls: ['./proposal-details.component.scss'],
})
export class ProposalDetailsComponent implements OnInit, OnDestroy {
  @Input() proposal: Document;
  @Input() proposalDetails: ProposalDetailsLists;
  permissions: Permission[];
  eeaRelevance: boolean;
  isAuthenticLang: boolean;
  isVerticalShift: boolean;
  packageTitle: string;
  authenticLang: string[];
  verticalShift: number;
  proposalLanguage: string;
  isAutonomousAct: boolean;
  enableSave = false;
  adoptionPlace: string;
  adoptionPlaces = [];
  adoptionDate: any;
  institutionalRefYear: number | null;
  institutionalRefActingEntities = [];
  institutionalRefActingEntity: string | null;
  institutionalRefVersions = [];
  institutionalRefNumber: number | null;
  institutionalReferenceFinalVersion: Boolean;
  interInstitutionalRef: boolean;
  interInstitutionalRefYear: number | null;
  interInstitutionalRefNumber: number | null;
  interInstitutionalRefType: string | null;
  interInstitutionalRefTypes = [];
  specialMention: string | null;
  specialMentions = [];
  signingCommissioner: string | null;
  signingCommissioners: [];
  commissionerTitle: string | null;
  stamp: boolean = false;
  institutionalRefRegEx = /([A-Za-z0-9]+)\(([0-9]{4})\)\s{0,1}([0-9]+)\s{0,1}/;
  interInstitutionalRefRegEx = /([0-9]{4})\/([0-9]+) \(([A-Za-z0-9]+)\)/;

  years: number[] = [];
  coverPageType: CoverPageType | null;

  proposalMetadata: Metadata;

  destroy$: Subject<any> = new Subject();

  allSelected = false;

  proposalType: string | null;
  isTargetLang: boolean;
  proposalTargetLang: string[];
  showCorrigendumAddendum: boolean;
  targetProposalReference: string;
  targetProposalDate: Date | null;
  correctionInformation: string;
  finalVersion: boolean;
  detailsTabExclusions: DetailsTabExclusions;

  //TODO To be moved to the backend configuration
  languages = [];

  selectedLanguages: { [key: string]: boolean } = {};

  allTargetLangSelected = false;
  selectedTargetLanguages: { [key: string]: boolean } = {};

  proposalRefTypeList = [];
  selectedProposalRefType: string = this.proposalRefTypeList[0];
  selectedYear: number = new Date().getFullYear();
  crossReferenceProposalNumber: string;
  crossReferenceProposalText: string;
  crossReferenceProposalListing: string[] = [];
  selectedIndex: number | null = null;
  invalidCrossRefNumberInput: boolean;
  invalidInstitutionalNumberInput: boolean;
  invalidInterInstitutionalNumberInput: boolean;

  constructor(
    protected detailsService: ProposalDetailsService,
    private growlService: EuiGrowlService,
    private translateService: TranslateService,
    ) {
    this.years = this.getYearsSince(1980);
    this.detailsService.permissions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((perms) => (this.permissions = perms));
    this.languages.forEach(lang => this.selectedLanguages[lang] = false);
    this.languages.forEach(lang => this.selectedTargetLanguages[lang] = false);
  }

  isChanged(): boolean {
    return (this.isEeaRelevanceChanged()
      || this.isPackageTitleChanged()
      || this.isCoverPageTypeChanged()
      || this.isAuthenticLangChanged()
      || this.isInstitutionalReferenceChanged()
      || this.isInterInstitutionalReferenceChanged()
      || this.isCrossReferencesChanged()
      || this.isStampChanged()
      || this.isCommissionerChanged()
      || this.isAdoptionPlaceChanged()
      || this.isAdoptionDateChanged());
  }

  isValid(): boolean {
    return (this.isAuthenticLangValid()
      && this.isInstitutionalRefValid()
      && this.isInterInstitutionalRefValid());
  }

  isEeaRelevanceChanged() {
    return this.proposalMetadata.eeaRelevance !== this.eeaRelevance;
  }

  isPackageTitleChanged() {
    return this.packageTitle !== this.proposalMetadata.packageTitle;
  }

  isStampChanged() {
    return this.proposalMetadata.stamp !== this.stamp;
  }

  isCommissionerChanged() {
    return this.specialMention !== this.proposalMetadata.specialMention
      || this.signingCommissioner !== this.proposalMetadata.signingCommissioner
      || this.commissionerTitle !== this.proposalMetadata.commissionerTitle;
  }

  isCoverPageTypeChanged() {
    return this.coverPageType !== this.proposalMetadata.coverPageType
      || this.verticalShift.toString() !== this.proposalMetadata.verticalShift;
  }

  isAuthenticLangChanged() : boolean {
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

    return (this.proposalMetadata.isAuthenticLang !== isMetadataAuthenticLang
      || JSON.stringify(this.proposalMetadata.authenticLang) !== JSON.stringify(this.authenticLang));
  }

  isCrossReferencesChanged(): boolean {
    return (JSON.stringify(this.crossReferenceProposalListing) !== JSON.stringify(this.proposalMetadata.crossReferences));
  }

  isAdoptionPlaceChanged(): boolean {
    return this.adoptionPlace !== this.proposalMetadata.adoptionPlace;
  }

  isAdoptionDateChanged(): boolean {
    return this.adoptionDate.toDate() !== this.proposalMetadata.adoptionDate;
  }

  isInstitutionalReferenceChanged(): boolean {
    return this.getInstitutionalReference() !== this.proposalMetadata.institutionalReference
      || this.institutionalReferenceFinalVersion !== this.proposalMetadata.institutionalReferenceFinalVersion;
  }

  isInterInstitutionalReferenceChanged(): boolean {
    return  this.getInterInstitutionalReference() !== this.proposalMetadata.interInstitutionalReference;
  }

  initializeLists(): void {
    this.proposalRefTypeList = this.proposalDetails.proposalRefTypes;
    this.adoptionPlaces = this.proposalDetails.adoptionPlaces;
    this.languages = [];
    for (const lang of this.proposalDetails.languages) {
      this.languages.push(lang.toUpperCase());
    }
    this.institutionalRefActingEntities = this.proposalDetails.institionalRefsTypes;
    this.interInstitutionalRefTypes = this.proposalDetails.interInstitionalRefsTypes;
    this.specialMentions = this.proposalDetails.specialMentions;
    this.proposalMetadata = cloneDeep(this.proposal.metadata);
  }

  initializeGeneral() {
    this.languages.forEach(lang => {
      this.selectedLanguages[lang] = false;
    });

    this.eeaRelevance = this.proposal.metadata.eeaRelevance;
    this.packageTitle = this.proposal.metadata.packageTitle;
    this.authenticLang = cloneDeep(this.proposal.metadata.authenticLang);

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

  initializeCoverPageType() {
    this.coverPageType = this.proposal.metadata.coverPageType;
    if (this.coverPageType == null) {
      this.coverPageType = 'STANDARD';
    }
    this.isVerticalShift = this.coverPageType !== 'STANDARD';
    this.verticalShift = this.proposal.metadata.verticalShift != null ? toNumber(this.proposal.metadata.verticalShift) : 6.0;
  }

  getInstitutionalReference(): string {
    if (!!this.institutionalRefActingEntity) {
      const institutionalRef = this.institutionalRefActingEntity + '(' + this.institutionalRefYear + ')' + this.institutionalRefNumber;
      if (this.institutionalRefRegEx.test(institutionalRef) && !isNaN(Number(this.institutionalRefNumber))) {
        return institutionalRef;
      }
    }
    return null;
  }

  isInstitutionalRefValid(): boolean {
    const institutionalRef = this.getInstitutionalReference();
    if (institutionalRef != null) {
      return true;
    } else if (!this.institutionalRefActingEntity && !this.institutionalRefYear && !this.institutionalRefNumber) {
      return true;
    }
    return false;
  }

  getInterInstitutionalReference(): string {
    let interInstitutionalRef = null;
    if (this.interInstitutionalRef && this.isInterInstitutionalRefValid()) {
      interInstitutionalRef = this.interInstitutionalRefYear + '/' + this.interInstitutionalRefNumber + ' (' + this.interInstitutionalRefType + ')';
    }
    if (!this.interInstitutionalRef && this.isInterInstitutionalRefValid()) {
      interInstitutionalRef = '';
    }

    return interInstitutionalRef;
  }

  isInterInstitutionalRefValid(): boolean {
    if (!!this.interInstitutionalRef && !!this.interInstitutionalRefYear
      && !!this.interInstitutionalRefNumber
      && !!this.interInstitutionalRefType) {
      const interInstitutionalRef = this.interInstitutionalRefYear + '/' + this.interInstitutionalRefNumber + ' (' + this.interInstitutionalRefType + ')';
      return this.interInstitutionalRefRegEx.test(interInstitutionalRef);
    }
    return !this.interInstitutionalRef;
  }

  isAuthenticLangValid(): boolean {
    return !this.isAuthenticLang || this.isThereSelectedLanguage();
  }

  initializeAdoptionInfo() {
    this.adoptionPlace = this.proposal.metadata.adoptionPlace;
    this.adoptionDate = this.proposal.metadata.adoptionDate != null ? moment(this.proposal.metadata.adoptionDate) : null;
    let institutionalRef = this.proposal.metadata.institutionalReference;
    if (institutionalRef != null && this.institutionalRefRegEx.test(institutionalRef)) {
      let myArray = institutionalRef.match(this.institutionalRefRegEx);
      this.institutionalRefActingEntity = myArray[1];
      this.institutionalRefYear = parseInt(myArray[2]);
      this.institutionalRefNumber = parseInt(myArray[3]);
    }
    this.institutionalReferenceFinalVersion = this.proposal.metadata.institutionalReferenceFinalVersion;

    let interInstitutionalRef = this.proposal.metadata.interInstitutionalReference;
    if (interInstitutionalRef != null && this.interInstitutionalRefRegEx.test(interInstitutionalRef)) {
      let myArray = interInstitutionalRef.match(this.interInstitutionalRefRegEx);
      this.interInstitutionalRef = true;
      this.interInstitutionalRefYear = parseInt(myArray[1]);
      this.interInstitutionalRefNumber = parseInt(myArray[2]);
      this.interInstitutionalRefType = myArray[3];
    }
    this.specialMention = this.proposal.metadata.specialMention;
    this.signingCommissioner = this.proposal.metadata.signingCommissioner;
    this.commissionerTitle = this.proposal.metadata.commissionerTitle;
    this.stamp = this.proposal.metadata.stamp;
  }

  ngOnInit(): void {
    this.detailsService.proposalDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (proposalDetails) => {
          this.detailsTabExclusions = proposalDetails.document.detailsTabExclusions;
        },
        error: (error) => console.log('error'),
      });
    this.initializeLists();
    this.isAutonomousAct = this.proposal.metadata.documentCollectionName == 'ACT_AUTO_COM';
    this.initializeGeneral();
    this.initializeCoverPageType();
    this.initializeAdoptionInfo();
    this.initializeCorrigendumAddendumFields();
    this.initializeCrossReferences();
  }

  private getYearsSince(firstYear: number): number[] {
    const currentYear = new Date().getFullYear();
    return Array.from(
      { length: currentYear - firstYear + 1 },
      (_, i) => currentYear - i,
    );
  }

  handleChange() {
    this.enableSave = this.isChanged() && this.isValid();
    if (!this.isInterInstitutionalRefValid()) {
      this.invalidInterInstitutionalNumberInput = true;
    } else {
      this.invalidInterInstitutionalNumberInput = false;
    }
    if (!this.isInstitutionalRefValid()) {
      this.invalidInstitutionalNumberInput = true;
    } else {
      this.invalidInstitutionalNumberInput = false;
    }
  }

  handleEEAChange(e: boolean) {
    this.eeaRelevance = e;
    this.handleChange();
  }

  handleAuthLangChange(e: boolean) {
    this.handleChange();
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
    this.handleChange();
    this.isVerticalShift = covertype != 'STANDARD';
    if (!this.isVerticalShift) this.verticalShift = 6.0;
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

    if(this.showCorrigendumAddendum) {
      if (!this.targetProposalReference || this.targetProposalReference.trim() === '') {
        alert('Proposal reference is required.');
        return;
      }

      if (!this.correctionInformation || this.correctionInformation.trim() === '') {
        alert('Correction information is required.');
        return;
      }

      if (!this.targetProposalDate) {
        alert('Target proposal date is required.');
        return;
      }

      if (this.isTargetLang) {
        const targetLangs = this.getTargetLanguages();
        if ((targetLangs && targetLangs.length == 0) || (targetLangs[0] === 'NONE')) {
          alert('Target proposal language is checked, select any languages(s)');
          return;
        }
      }
    }

    this.detailsService.updateProposalMetadata(
      null,
      this.isEeaRelevanceChanged() ? this.eeaRelevance : null,
      this.isPackageTitleChanged() ? this.packageTitle : null,
      this.isAuthenticLangChanged() ? isMetadataAuthenticLang : null,
      this.isAuthenticLangChanged() ? this.authenticLang : null,
      this.isCoverPageTypeChanged() ? this.coverPageType : null,
      this.isCoverPageTypeChanged() ? verticalShiftMetadata : null,
      this.showCorrigendumAddendum,
      this.proposalType,
      this.targetProposalReference,
      this.targetProposalDate != null ? this.formatTargetProposalDate() : null,
      this.getTargetLanguages(),
      this.correctionInformation,
      this.finalVersion,
      this.isCrossReferencesChanged() ? this.crossReferenceProposalListing : null,
      this.isAdoptionPlaceChanged() ? this.adoptionPlace : null,
      this.isAdoptionDateChanged() ? this.adoptionDate.toDate() : null,
      this.isInstitutionalReferenceChanged() ? this.getInstitutionalReference() : null,
      this.isInstitutionalReferenceChanged() ? this.institutionalReferenceFinalVersion : null,
      this.isInterInstitutionalReferenceChanged() ? this.getInterInstitutionalReference() : null
    ).subscribe({
      next: () => {
        this.detailsService.setProposalRef(this.proposal.ref);
        if (!this.showCorrigendumAddendum) {
          this.resetCorrigendumAddendumFields();
        }
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
    this.handleChange();
  }

  increase() {
    this.verticalShift = Math.round((this.verticalShift + 0.1) * 10) / 10;
    this.handleChange();
  }

  decrease() {
    if (this.verticalShift > 0) {
      this.verticalShift = Math.round((this.verticalShift - 0.1) * 10) / 10;
      this.handleChange();
    }
  }

  onToggleCorrigendumAddendum(event: Event): void {
    this.enableSave = true;
    if (this.showCorrigendumAddendum) {
      this.proposalType = 'corrigendum';
    } else {
      this.proposalType = '';
    }
  }

  formatTargetProposalDate(): string {
    return moment(this.targetProposalDate).format('DD-MM-YYYY');
  }

  handleTargetLangChange(e: boolean) {
    if (!e) {
      this.languages.forEach(lang => {
        this.selectedTargetLanguages[lang] = false;
      });
    }
    this.enableSave = true;
  }

  onTargetLanguageChange() {
    const allTargetLangSelected = this.languages.every(lang => this.selectedTargetLanguages[lang]);
    this.allTargetLangSelected = allTargetLangSelected;
    this.enableSave = true;
  }

  toggleAllTargetLanguages() {
    this.languages.forEach(lang => {
      this.selectedTargetLanguages[lang] = this.allTargetLangSelected;
    });
    this.enableSave = true;
  }

  handleProposalFinalVersion(inputChangeEvent: Event) {
    this.enableSave = true;
    this.finalVersion = (inputChangeEvent.target as HTMLInputElement).checked ? true : false;
  }

  getTargetLanguages() {
    this.proposalTargetLang = Object.keys(this.selectedTargetLanguages)
      .filter(lang => this.selectedTargetLanguages[lang]).map(lang => lang.toLowerCase());
    if (this.proposalTargetLang.length == this.languages.length) {
      this.proposalTargetLang = ['ALL'];
    } else if (this.proposalTargetLang.length == 0) {
      this.proposalTargetLang = ['NONE'];
    }
    return this.proposalTargetLang;
  }

  private initializeCorrigendumAddendumFields(): void {
    if (this.proposal.showCorrigendumAddendum) {
      const proposal = this.proposal;
      this.showCorrigendumAddendum = proposal.showCorrigendumAddendum;
      this.proposalType = proposal.proposalType;
      this.targetProposalReference = proposal.targetProposalReference;
      this.finalVersion = proposal.finalVersion;
      this.targetProposalDate = this.proposal.targetProposalDate != null ? moment(this.proposal.targetProposalDate, 'DD-MM-YYYY').toDate() : null;
      this.allTargetLangSelected = proposal.allTargetLangSelected;
      this.proposalTargetLang = proposal.proposalTargetLang;
      this.correctionInformation = proposal.correctionInformation;
      this.proposalTargetLang && this.proposalTargetLang.forEach(lang => {
        this.selectedTargetLanguages[lang.toUpperCase()] = true;
      });
      this.allTargetLangSelected && this.languages.forEach(lang => {
        this.selectedTargetLanguages[lang.toUpperCase()] = true;
      });
      this.isTargetLang = proposal.allTargetLangSelected || this.proposalTargetLang[0].toUpperCase()  != 'NONE';
    }
  }

  private resetCorrigendumAddendumFields(): void {
    this.proposalType = null;
    this.targetProposalReference = '';
    this.targetProposalDate = null;
    this.correctionInformation = '';
    this.finalVersion = false;
    this.isTargetLang = false;
    this.allTargetLangSelected = false;
    this.proposalTargetLang = [];
    this.selectedTargetLanguages = {};
  }

  onAnyInputChange() {
    this.enableSave = true;
  }

  private initializeCrossReferences(): void {
    this.crossReferenceProposalListing = cloneDeep(this.proposal.metadata.crossReferences);
    const currentYear = new Date().getFullYear();
    const startYear = 1960;
    this.years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i).reverse();
    this.selectedProposalRefType = this.proposalRefTypeList[0];
    this.selectedYear = this.years[0];
  }


  addCrossRef() {
    const ref = `${this.selectedProposalRefType}(${this.selectedYear}) ${this.crossReferenceProposalNumber}` +
      (this.crossReferenceProposalText ? ` ${this.crossReferenceProposalText}` : '');
    if (ref.trim()) {
      this.crossReferenceProposalListing.push(ref);
      this.crossReferenceProposalNumber = '';
      this.crossReferenceProposalText = '';
    }
    this.enableSave = true;
  }

  selectItem(index: number) {
    this.selectedIndex = index;
  }

  deleteItem() {
    if (this.selectedIndex !== null) {
      this.crossReferenceProposalListing.splice(this.selectedIndex, 1);
      this.selectedIndex = null; // reset selection or adjust as needed
    }
    this.enableSave = true;
  }

  moveUp() {
    if (this.selectedIndex > 0) {
      const temp = this.crossReferenceProposalListing[this.selectedIndex];
      this.crossReferenceProposalListing[this.selectedIndex] = this.crossReferenceProposalListing[this.selectedIndex - 1];
      this.crossReferenceProposalListing[this.selectedIndex - 1] = temp;
      this.selectedIndex--;
    }
    this.enableSave = true;
  }

  moveDown() {
    if (this.selectedIndex !== null && this.selectedIndex < this.crossReferenceProposalListing.length - 1) {
      const temp = this.crossReferenceProposalListing[this.selectedIndex];
      this.crossReferenceProposalListing[this.selectedIndex] = this.crossReferenceProposalListing[this.selectedIndex + 1];
      this.crossReferenceProposalListing[this.selectedIndex + 1] = temp;
      this.selectedIndex++;
    }
    this.enableSave = true;
  }

  checkCrossRefNumberInput(event: KeyboardEvent) {
    if (this.checkNumberInput(event)) {
      this.invalidCrossRefNumberInput = true;
      setTimeout(() => {
        this.invalidCrossRefNumberInput = false;
      }, 1500)
    }
  }

  checkNumberInput(event: KeyboardEvent): boolean {
    const char = event.key;
    if (!/^\d$/.test(char)) {
      event.preventDefault();
      return true;
    }
    return false;
  }

  enableAddCrossRef() {
    if (
      !this.selectedProposalRefType ||
      !this.crossReferenceProposalNumber ||
      !this.selectedYear
    ) {
      return false;
    }
    return true;
  }

}

