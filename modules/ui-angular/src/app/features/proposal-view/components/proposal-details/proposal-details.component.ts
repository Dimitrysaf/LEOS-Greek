import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  Document,
  Permission,
  AuthenticLanguage,
  CoverPageType,
  ProposalDetailsLists,
  Metadata,
  DetailsTabExclusions,
  LeosConfig,
  User, SignatureMetadata
} from '@leos/shared';
import {ProposalDetailsService} from "@/features/proposal-view/services/proposal-details.service";
import {Subject, takeUntil} from "rxjs";
import {cloneDeep, toNumber} from "lodash-es";
import {EuiGrowlService} from "@eui/core";
import {TranslateService} from "@ngx-translate/core";
import moment from 'moment';
import { AppConfigService } from '@/core/services/app-config.service';
import {EuiDialogComponent} from "@eui/components/eui-dialog";

@Component({
  selector: 'app-proposal-details',
  templateUrl: './proposal-details.component.html',
  styleUrls: ['./proposal-details.component.scss'],
})
export class ProposalDetailsComponent implements OnInit, OnDestroy {
  @Input() proposal: Document;
  @Input() proposalDetails: ProposalDetailsLists;
  @Input() detailsTabExclusions: DetailsTabExclusions
  @ViewChild('resetConfirmation') resetConfirmation: EuiDialogComponent;
  leosConfig: LeosConfig;
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
  institutionalRef: boolean;
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
  signatures: SignatureMetadata[] | null;
  specialMentions = [];
  commissionerTitles = [];
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
  targetProposalReferenceYear: number | null;
  targetProposalReferenceActingEntity: string | null;
  targetProposalReferenceNumber: number | null;
  targetProposalDate: any;
  correctionInformation: string;
  finalVersion: boolean;

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
  invalidTargetProposalReferenceInput: boolean;
  invalidTargetProposalDateInput: boolean;
  invalidCorrectionInfoInput: boolean;
  greffeUser: boolean;
  diffusionVersion: string | null = null;
  diffusionBarOptions: string[] = Array.from(
    { length: 20 },
    (_, i) => `/${i + 1}`
  );

  constructor(
    private appConfigService: AppConfigService,
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
      || this.isCorrigendumChanged()
      || this.isAdoptionPlaceChanged()
      || this.isAdoptionDateChanged()
      || this.isDiffusionVersionChanged());
  }

  isValid(): boolean {
    return (this.isAuthenticLangValid()
      && this.isInstitutionalRefValid()
      && this.isInterInstitutionalRefValid()
      && this.isTargetProposalReferenceValid()
      && this.isTargetProposalDateValid()
      && this.isCorrectionInfoValid()
      && this.isTargetLangValid());
  }

  isEeaRelevanceChanged() {
    return this.proposalMetadata.eeaRelevance != this.eeaRelevance;
  }

  isPackageTitleChanged() {
    return this.packageTitle != this.proposalMetadata.packageTitle;
  }

  isStampChanged() {
    return this.proposalMetadata.stamp != this.stamp;
  }

  isCommissionerChanged() {
    for (let i = 0; i < this.signatures.length; i++) {
      let signature = this.signatures[i];
      if (signature.specialMention != this.proposalMetadata.signatures[i].specialMention
        || signature.signingCommissioner != this.proposalMetadata.signatures[i].signingCommissioner
        || signature.commissionerTitle != this.proposalMetadata.signatures[i].commissionerTitle) {
        return true;
      }
    }
    return false;
  }

  isCoverPageTypeChanged() {
    return this.coverPageType != this.proposalMetadata.coverPageType
      || (this.isVerticalShift && this.verticalShift.toString() != this.proposalMetadata.verticalShift);
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

      if (this.authenticLang.length == this.languages.length || this.allSelected) {
        this.authenticLang = [];
        isMetadataAuthenticLang = 'ALL';
      }
    } else {
      isMetadataAuthenticLang = 'FALSE';
      this.authenticLang = [];
    }

    return (this.proposalMetadata.isAuthenticLang != isMetadataAuthenticLang
      || JSON.stringify(this.proposalMetadata.authenticLang.sort()) != JSON.stringify(this.authenticLang.sort()));
  }

  isTargetLangChanged() : boolean {
    if (this.isTargetLang) {
      return this.proposal.proposalTargetLang === null
        || JSON.stringify(this.proposal.proposalTargetLang.sort()) != JSON.stringify(this.proposalTargetLang.sort());
    } else {
      return this.proposal.proposalTargetLang != null && this.proposal.proposalTargetLang.length > 0;
    }
  }

  isCrossReferencesChanged(): boolean {
    return (JSON.stringify(this.crossReferenceProposalListing) != JSON.stringify(this.proposalMetadata.crossReferences));
  }

  isAdoptionPlaceChanged(): boolean {
    return this.adoptionPlace != this.proposalMetadata.adoptionPlace;
  }

  isAdoptionDateChanged(): boolean {
    return ((this.adoptionDate == null && this.proposalMetadata.adoptionDate !== null) || (this.adoptionDate !== null && this.proposalMetadata.adoptionDate == null))
      || (this.adoptionDate !== null && this.proposalMetadata.adoptionDate !== null && new Date(this.proposalMetadata.adoptionDate).getTime()/1000 != this.adoptionDate.unix());
  }

  isDiffusionVersionChanged(): boolean {
    return this.diffusionVersion != this.proposalMetadata.diffusionVersion;
  }

  isCorrigendumChanged(): boolean {
    if (this.showCorrigendumAddendum == this.proposal.showCorrigendumAddendum
      && this.proposalType == this.proposal.proposalType
      && this.correctionInformation == this.proposal.correctionInformation
      && this.getTargetProposalReference() == this.proposal.targetProposalReference
      && !this.isTargetLangChanged()) {
      return ((this.targetProposalDate == null && this.proposal.targetProposalDate !== null) || (this.targetProposalDate !== null && this.proposal.targetProposalDate == null))
        || (this.targetProposalDate !== null && this.proposal.targetProposalDate !== null && new Date(this.proposal.targetProposalDate).getTime()/1000 != this.targetProposalDate.unix());
    } else {
      return true;
    }
  }

  isInstitutionalReferenceChanged(): boolean {
    return this.getInstitutionalReference() != this.proposalMetadata.institutionalReference
      || this.institutionalReferenceFinalVersion != this.proposalMetadata.institutionalReferenceFinalVersion;
  }

  isInterInstitutionalReferenceChanged(): boolean {
    return this.getInterInstitutionalReference() != this.proposalMetadata.interInstitutionalReference;
  }

  initializeLists(): void {
    this.proposalRefTypeList = this.proposalDetails.proposalRefTypes;
    this.adoptionPlaces = this.proposalDetails.adoptionPlaces;
    this.proposalLanguage = this.proposal.metadata.language;
    this.languages = [];
    for (const lang of this.proposalDetails.languages) {
      this.languages.push(lang.toUpperCase());
    }
    this.institutionalRefActingEntities = this.proposalDetails.institionalRefsTypes;
    this.interInstitutionalRefTypes = this.proposalDetails.interInstitionalRefsTypes;
    this.specialMentions = this.proposalDetails.specialMentions;
    this.commissionerTitles = this.proposalDetails.commissionerTitles;
    this.proposalMetadata = cloneDeep(this.proposal.metadata);
  }

  initializeGeneral() {
    this.languages.forEach(lang => {
      this.selectedLanguages[lang] = false;
    });

    this.eeaRelevance = this.proposal.metadata.eeaRelevance;
    this.packageTitle = this.proposal.metadata.packageTitle;
    this.authenticLang = cloneDeep(this.proposal.metadata.authenticLang);
    this.allSelected = false;

    if (this.proposal.metadata.isAuthenticLang != null) {
      if (this.proposal.metadata.isAuthenticLang.includes("PROPOSAL_LANGUAGE")) {
        this.isAuthenticLang = true;
        if (this.proposal.metadata.isAuthenticLang == "NON_PROPOSAL_LANGUAGE") {
          this.authenticLang = this.authenticLang.filter((lang => lang.toLowerCase() != this.proposalLanguage.toLowerCase()));
          this.proposalMetadata.authenticLang = this.proposalMetadata.authenticLang.filter((lang => lang.toLowerCase() != this.proposalLanguage.toLowerCase()));
        }
      } else if (this.proposal.metadata.isAuthenticLang == 'ALL') {
        this.isAuthenticLang = true;
        this.allSelected = true;
        this.proposalMetadata.authenticLang = [];
        this.languages.forEach(lang => {
          this.selectedLanguages[lang] = true;
        });
      } else if (this.proposal.metadata.isAuthenticLang == 'FALSE') {
        this.isAuthenticLang = false;
        this.proposalMetadata.authenticLang = [];
      }
    } else {
      this.proposalMetadata.isAuthenticLang = 'FALSE';
      this.proposalMetadata.authenticLang = [];
      this.isAuthenticLang = false;
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
      this.proposalMetadata.coverPageType = 'STANDARD';
    }
    this.isVerticalShift = this.coverPageType != 'STANDARD';
    this.verticalShift = this.proposal.metadata.verticalShift != null ? toNumber(this.proposal.metadata.verticalShift) : 2.0;
  }

  getInstitutionalReference(): string {
    if (this.institutionalRef && !!this.institutionalRefActingEntity && !!this.institutionalRefYear && !!this.institutionalRefNumber) {
      const institutionalRef = this.institutionalRefActingEntity + '(' + this.institutionalRefYear + ')' + this.institutionalRefNumber;
      if (this.institutionalRefRegEx.test(institutionalRef) && !isNaN(Number(this.institutionalRefNumber))) {
        return institutionalRef;
      }
    } else if (!this.institutionalRef) {
      return '';
    }
    return null;
  }

  isInstitutionalRefValid(): boolean {
    const institutionalRef = this.getInstitutionalReference();
    if (this.institutionalRef && !!institutionalRef) {
      return true;
    } else if (!this.institutionalRef) {
      return true;
    }
    return false;
  }

  getInstitutionalRefNonValidMsg(): string {
    if (!this.isInstitutionalRefValid()) {
      if (this.institutionalRefActingEntity == null || this.institutionalRefActingEntity == undefined) {
        return this.translateService.instant("page.collection.details.invalid.institutional.ref.type");
      }
      if (this.institutionalRefYear == null || this.institutionalRefYear == undefined) {
        return this.translateService.instant("page.collection.details.invalid.institutional.ref.year");
      }
      if (this.institutionalRefNumber == null || this.institutionalRefNumber == undefined) {
        return this.translateService.instant("page.collection.details.invalid.institutional.ref.number.empty");
      }
    }
    return null;
  }

  getTargetProposalReference(): string {
    if (this.showCorrigendumAddendum
      && this.targetProposalReferenceActingEntity != null
      && this.targetProposalReferenceActingEntity != undefined && !isNaN(this.targetProposalReferenceNumber) && !isNaN(this.targetProposalReferenceYear)) {
      const targetProposalReference = this.targetProposalReferenceActingEntity + '(' + this.targetProposalReferenceYear + ')' + this.targetProposalReferenceNumber;
      if (this.institutionalRefRegEx.test(targetProposalReference) && !isNaN(Number(this.targetProposalReferenceNumber))) {
        return targetProposalReference;
      }
    }
    return null;
  }

  isTargetProposalReferenceValid(): boolean {
    const targetProposalReference = this.getTargetProposalReference();
    if (targetProposalReference != null) {
      return true;
    } else if (!this.showCorrigendumAddendum) {
      return true;
    }
    return false;
  }

  getTargetProposalRefNonValidMsg(): string {
    if (!this.isTargetProposalReferenceValid() && this.showCorrigendumAddendum) {
      if (this.targetProposalReferenceYear == null || this.targetProposalReferenceYear == undefined) {
        return this.translateService.instant("page.collection.details.invalid.target.proposal.ref.year");
      }
      if (this.targetProposalReferenceNumber == null || this.targetProposalReferenceNumber == undefined) {
        return this.translateService.instant("page.collection.details.invalid.target.proposal.ref.number.empty");
      }
      if (this.targetProposalReferenceActingEntity == null || this.targetProposalReferenceActingEntity == undefined) {
        return this.translateService.instant("page.collection.details.invalid.target.proposal.ref.type");
      }
    }
    return null;
  }

  isTargetProposalDateValid(): boolean {
    if (this.showCorrigendumAddendum) {
      if (this.targetProposalDate == null || this.targetProposalDate == undefined) {
        return false;
      }
    }
    return true;
  }

  getTargetProposalDateNonValidMsg(): string {
    if (this.showCorrigendumAddendum) {
      if (this.targetProposalDate == null || this.targetProposalDate == undefined) {
        return this.translateService.instant("page.collection.details.invalid.proposal.date");
      }
    }
    return null;
  }

  isCorrectionInfoValid(): boolean {
    if (this.showCorrigendumAddendum) {
      if (this.correctionInformation == null || this.correctionInformation == undefined || this.correctionInformation == '') {
        return false;
      }
    }
    return true;
  }

  getCorrectionInfoNonValidMsg(): string {
    if (!this.isCorrectionInfoValid()) {
      return this.translateService.instant("page.collection.details.invalid.correction.info");
    }
    return null;
  }

  getInterInstitutionalReference(): string {
    let interInstitutionalRef = null;
    if (this.interInstitutionalRef && this.isInterInstitutionalRefValid()) {
      interInstitutionalRef = this.interInstitutionalRefYear + '/' + this.interInstitutionalRefNumber + ' (' + this.interInstitutionalRefType + ')';
    }
    if (!this.interInstitutionalRef) {
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

  getInterInstitutionalRefNonValidMsg(): string {
    if (!this.isInterInstitutionalRefValid()) {
      if (this.interInstitutionalRefYear == null || this.interInstitutionalRefYear == undefined) {
        return this.translateService.instant("page.collection.details.invalid.inter.institutional.ref.year");
      }
      if (this.interInstitutionalRefNumber == null || this.interInstitutionalRefNumber == undefined) {
        return this.translateService.instant("page.collection.details.invalid.inter.institutional.ref.number.empty");
      }
      if (this.interInstitutionalRefType == null || this.interInstitutionalRefType == undefined) {
        return this.translateService.instant("page.collection.details.invalid.inter.institutional.ref.type");
      }
    }
    return null;
  }

  isAuthenticLangValid(): boolean {
    return (this.isAuthenticLang && this.isThereSelectedLanguage()) || !this.isAuthenticLang;
  }

  isTargetLangValid(): boolean {
    return !this.isTargetLang || (this.isThereSelectedTargetLanguage() && this.isTargetLang);
  }

  initializeAdoptionInfo() {
    this.adoptionPlace = this.proposal.metadata.adoptionPlace;
    this.adoptionDate = this.proposal.metadata.adoptionDate != null ? moment(this.proposal.metadata.adoptionDate) : null;
    let institutionalRef = this.proposal.metadata.institutionalReference;
    if (institutionalRef != null && this.institutionalRefRegEx.test(institutionalRef)) {
      let myArray = institutionalRef.match(this.institutionalRefRegEx);
      this.institutionalRef = true;
      this.institutionalRefActingEntity = myArray[1];
      this.institutionalRefYear = parseInt(myArray[2]);
      this.institutionalRefNumber = parseInt(myArray[3]);
    }
    this.institutionalReferenceFinalVersion = this.proposal.metadata.institutionalReferenceFinalVersion;
    this.diffusionVersion = this.proposal.metadata.diffusionVersion;

    let interInstitutionalRef = this.proposal.metadata.interInstitutionalReference;
    if (interInstitutionalRef != null && this.interInstitutionalRefRegEx.test(interInstitutionalRef)) {
      let myArray = interInstitutionalRef.match(this.interInstitutionalRefRegEx);
      this.interInstitutionalRef = true;
      this.interInstitutionalRefYear = parseInt(myArray[1]);
      this.interInstitutionalRefNumber = parseInt(myArray[2]);
      this.interInstitutionalRefType = myArray[3];
    }
    this.signatures = cloneDeep(this.proposal.metadata.signatures);
    for (let signature of this.signatures) {
      this.populateSigningCommissioner(signature);
    }
    this.stamp = this.proposal.metadata.stamp;
  }

  ngOnInit(): void {
    this.appConfigService.config
      .pipe(takeUntil(this.destroy$))
      .subscribe((config) => {
        this.leosConfig = config;
      });
    this.greffeUser = this.leosConfig.user.greffeUser;
    this.isAutonomousAct = this.proposal.metadata.documentCollectionName == 'ACT_AUTO_COM';
    this.detailsService.proposalDetailsRefreshedBS.subscribe((proposal) => {
      if (proposal) {
        if (this.detailsService.getTranslated() && proposal.translatedProposals
          && proposal.translatedProposals.length > 0 && this.proposal.ref != proposal.ref) {
          this.proposal = proposal.translatedProposals.find((p) => p.ref == this.proposal.ref);
        } else {
          this.proposal = proposal;
        }
        this.initializeLists();
        this.initializeGeneral();
        this.initializeCoverPageType();
        this.initializeAdoptionInfo();
        this.initializeCorrigendumAddendumFields();
        this.initializeCrossReferences();
      }
    });
  }

  private getYearsSince(firstYear: number): number[] {
    const currentYear = new Date().getFullYear();
    return Array.from(
      { length: currentYear - firstYear + 1 },
      (_, i) => currentYear - i,
    );
  }

  populateSigningCommissioner(signature : SignatureMetadata) {
    if (!signature.commissionerTitle) return;
    signature.signingCommissioners = [];
    this.detailsService.searchUsersByJobTitle(signature.commissionerTitle)
      .subscribe({
        next: (users: string[]) => {
          signature.signingCommissioners.push(signature.signingCommissioner);
          for (let user of users) {
            if (user != signature.signingCommissioner) {
              signature.signingCommissioners.push(user);
            }
          }
        },
        error: (err) => {
          console.error('Error fetching commissioners by job title', err);
          signature.signingCommissioners = [];
          signature.signingCommissioners.push(signature.signingCommissioner);
        }
      });
  }

  onCommissionerTitleSelection(signature: SignatureMetadata, event: Event) {
    const selectedTitle = event.toString();
    signature.commissionerTitle = selectedTitle;
    this.populateSigningCommissioner(signature);
    this.handleChange();
  }

  onInterInstitutionalRefChecked(event: Event) {
    const interInstitutionalRef = ((event.target as HTMLInputElement).checked);
    if (interInstitutionalRef) {
      this.interInstitutionalRefYear = (new Date()).getFullYear();
    }
    this.handleChange();
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
    if (!this.isTargetProposalReferenceValid()) {
      this.invalidTargetProposalReferenceInput = true;
    } else {
      this.invalidTargetProposalReferenceInput = false;
    }
    if (!this.isTargetProposalDateValid()) {
      this.invalidTargetProposalDateInput = true;
    } else {
      this.invalidTargetProposalDateInput = false;
    }
    if (!this.isCorrectionInfoValid()) {
      this.invalidCorrectionInfoInput = true;
    } else {
      this.invalidCorrectionInfoInput = false;
    }
  }

  handleEEAChange(e: boolean) {
    this.eeaRelevance = e;
    this.handleChange();
  }

  handleAuthLangChange(e: boolean) {
    this.handleChange();
    if (!e) {
      this.allSelected = false;
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

  isThereSelectedTargetLanguage(): boolean {
    for (let lang of this.languages) {
      if (this.selectedTargetLanguages[lang]) {
        return true;
      }
    }
    return this.allSelected;
  }

  handleCoverPageTypeChange(covertype: string) {
    this.isVerticalShift = covertype != 'STANDARD';
    if (!this.isVerticalShift) this.verticalShift = 2.0;
    this.handleChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  cancelResetAdoptionInformation() {
    this.resetConfirmation.closeDialog();
  }

  startResetAdoptionInformation() {
    this.resetConfirmation.openDialog();
  }

  resetAdoptionInformation() {
    this.resetConfirmation.closeDialog();
    this.adoptionDate = null;
    this.adoptionPlace = this.adoptionPlaces[0];
    this.institutionalRef = false;
    this.institutionalRefActingEntity = null;
    this.institutionalReferenceFinalVersion = false;
    this.institutionalRefNumber = null;
    this.institutionalRefYear = null;
    this.interInstitutionalRef = false;
    this.interInstitutionalRefNumber = null;
    this.interInstitutionalRefType = null;
    this.interInstitutionalRefYear = null;
    this.stamp = false;
    for (let i = 0; i < this.signatures.length; i++) {
      let signature = this.signatures[i];
      signature.commissionerTitle = this.proposalDetails.templateSignatures[i].commissionerTitle;
      signature.signingCommissioner = this.proposalDetails.templateSignatures[i].signingCommissioner;
      this.populateSigningCommissioner(signature);
      signature.specialMention = this.proposalDetails.templateSignatures[i].specialMention;
    }
    this.saveGeneralDetails();
  }

  couldBeReset(): boolean {
    if (this.adoptionDate == null
      && this.adoptionPlace == this.adoptionPlaces[0]
      && !this.institutionalRef
      && !this.institutionalReferenceFinalVersion
      && !this.interInstitutionalRef
      && !this.stamp) {
      for (let i = 0; i < this.signatures.length; i++) {
        let signature = this.signatures[i];
        if (signature.commissionerTitle != this.proposalDetails.templateSignatures[i].commissionerTitle
            || signature.signingCommissioner != this.proposalDetails.templateSignatures[i].signingCommissioner
            || signature.specialMention != this.proposalDetails.templateSignatures[i].specialMention) {
          return true;
        }
      }
      return false;
    } else {
      return true;
    }
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

    this.targetProposalReference = this.getTargetProposalReference();
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

    this.enableSave = false;
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
      this.targetProposalDate != null ? this.targetProposalDate.toDate() : null,
      this.getTargetLanguages(),
      this.correctionInformation,
      this.finalVersion,
      this.isCrossReferencesChanged() ? this.crossReferenceProposalListing : null,
      this.isAdoptionPlaceChanged() ? this.adoptionPlace : null,
      this.isAdoptionDateChanged() ? this.adoptionDate == null ? new Date(0) : this.adoptionDate.toDate() : null,
      this.isInstitutionalReferenceChanged() ? this.getInstitutionalReference() : null,
      this.isInstitutionalReferenceChanged() ? this.institutionalReferenceFinalVersion : null,
      this.isInterInstitutionalReferenceChanged() ? this.getInterInstitutionalReference() : null,
      this.isStampChanged() ? this.stamp : null,
      this.isCommissionerChanged() ? this.signatures : null,
      this.diffusionVersion.replace("/", "")
    ).subscribe({
      next: () => {
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
        this.detailsService.setProposalRef(this.proposal.ref);
      },
      error: (err) => {
        this.enableSave = true;
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
    this.handleChange();
  }

  onLanguageChange() {
    const allChecked = this.languages.every(lang => this.selectedLanguages[lang]);
    this.allSelected = allChecked;
    this.handleChange();
  }

  increase() {
    if (this.verticalShift < 2.0) {
      this.verticalShift = Math.round((this.verticalShift + 0.1) * 10) / 10;
    }

    this.handleChange();
  }

  decrease() {
    if (this.verticalShift > 0.0) {
      this.verticalShift = Math.round((this.verticalShift - 0.1) * 10) / 10;
      this.handleChange();
    }
  }

  onToggleCorrigendumAddendum(event: Event): void {
    this.showCorrigendumAddendum = (event.target as HTMLInputElement).checked;
    if (this.showCorrigendumAddendum) {
      if (!!this.proposal.proposalType) {
        this.proposalType = this.proposal.proposalType;
      } else {
        this.proposalType = !this.isAutonomousAct ? 'corrigendum' : 'addendum';
      }
    }
    this.handleChange();
  }

  formatTargetProposalDate(): string {
    return moment(this.targetProposalDate).format('DD-MM-YYYY');
  }

  handleTargetLangChange(e: boolean) {
    this.handleChange();
    if (!e) {
      this.languages.forEach(lang => {
        this.selectedTargetLanguages[lang] = false;
      });
    }
  }

  onTargetLanguageChange() {
    const allTargetLangSelected = this.languages.every(lang => this.selectedTargetLanguages[lang]);
    this.allTargetLangSelected = allTargetLangSelected;
    this.proposalTargetLang = Object.keys(this.selectedTargetLanguages)
      .filter(lang => this.selectedTargetLanguages[lang]).map(lang => lang.toLowerCase());
    this.handleChange();
  }

  toggleAllTargetLanguages() {
    this.languages.forEach(lang => {
      this.selectedTargetLanguages[lang] = this.allTargetLangSelected;
    });
    const allTargetLangSelected = this.languages.every(lang => this.selectedTargetLanguages[lang]);
    this.allTargetLangSelected = allTargetLangSelected;
    this.proposalTargetLang = Object.keys(this.selectedTargetLanguages)
      .filter(lang => this.selectedTargetLanguages[lang]).map(lang => lang.toLowerCase());
    this.handleChange();
  }

  handleProposalFinalVersion(inputChangeEvent: Event) {
    this.handleChange();
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
      if (this.targetProposalReference != null && this.institutionalRefRegEx.test(this.targetProposalReference)) {
        let myArray = this.targetProposalReference.match(this.institutionalRefRegEx);
        this.targetProposalReferenceActingEntity = myArray[1];
        this.targetProposalReferenceYear = parseInt(myArray[2]);
        this.targetProposalReferenceNumber = parseInt(myArray[3]);
      }

      this.finalVersion = proposal.finalVersion;
      this.targetProposalDate = this.proposal.targetProposalDate != null ? moment(this.proposal.targetProposalDate) : null;
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
    this.handleChange();
  }

  selectItem(index: number) {
    this.selectedIndex = index;
  }

  deleteItem() {
    if (this.selectedIndex !== null) {
      this.crossReferenceProposalListing.splice(this.selectedIndex, 1);
      this.selectedIndex = null; // reset selection or adjust as needed
    }
    this.handleChange();
  }

  moveUp() {
    if (this.selectedIndex > 0) {
      const temp = this.crossReferenceProposalListing[this.selectedIndex];
      this.crossReferenceProposalListing[this.selectedIndex] = this.crossReferenceProposalListing[this.selectedIndex - 1];
      this.crossReferenceProposalListing[this.selectedIndex - 1] = temp;
      this.selectedIndex--;
    }
    this.handleChange();
  }

  moveDown() {
    if (this.selectedIndex !== null && this.selectedIndex < this.crossReferenceProposalListing.length - 1) {
      const temp = this.crossReferenceProposalListing[this.selectedIndex];
      this.crossReferenceProposalListing[this.selectedIndex] = this.crossReferenceProposalListing[this.selectedIndex + 1];
      this.crossReferenceProposalListing[this.selectedIndex + 1] = temp;
      this.selectedIndex++;
    }
    this.handleChange();
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

