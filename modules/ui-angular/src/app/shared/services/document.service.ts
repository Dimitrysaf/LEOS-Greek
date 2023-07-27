import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { UxAppShellService } from '@eui/core';
import { TranslateService } from '@ngx-translate/core';
import { parse as parseContentDisposition } from 'content-disposition-attachment';
import { isEqual } from 'lodash-es';
import {
  BehaviorSubject,
  combineLatest,
  combineLatestWith,
  concat,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  mergeMap,
  Observable,
  of,
  share,
  shareReplay,
  skip,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { combineLatestInit } from 'rxjs/internal/observable/combineLatest';

import { AppConfigService } from '@/core/services/app-config.service';
import { DocumentSearchParams } from '@/features/akn-document/models';
import { Version } from '@/features/akn-document/models/versions';
import {
  AnnotateOperationMode,
  Collaborator,
  DocumentConfig,
  LeosAppConfig,
  Permission,
} from '@/shared';
import { ContributionVO } from '@/shared/models/contribution-vo.model';
import { VersionSearchParams } from '@/shared/models/versionSearch';
import { downloadBlob } from '@/shared/utils';

import { apiBaseUrl } from '../../../config';
import {
  DocumentViewResponse,
  FetchElementResponse,
} from '../models/document-view-response.model';
import { NodeValidationResponse } from '../models/drop-response.model';
import { MergeActionVO } from '../models/merge-action-vo.model';
import { SearchMatchVO } from '../models/search.model';
import { CoEditionServiceWS } from './coEdition.websocket.service';
import { LoadingService } from './loading.service';

export enum RelevantElements {
  ALL = 'ALL',
  ENACTING_TERMS = 'ENACTING_TERMS',
  RECITALS = 'RECITALS',
  RECITALS_AND_ENACTING_TERMS = 'RECITALS_AND_ENACTING_TERMS',
  ANNOTATIONS = 'ANNOTATIONS',
}

export type DownloadEConsiliumParams = {
  title: string;
  relevantElements: RelevantElements;
  isWithAnnotations: boolean;
  annotations: string;
  isCleanVersion: boolean;
  currentVersion: string;
  originalVersion: string;
  intermediateVersion: string;
};

export type DownloadEConsiliumOptions = Omit<
  DownloadEConsiliumParams,
  'annotations'
>;

export type DocumentRefAndCategory = { ref: string; category: string };

@Injectable()
export class DocumentService implements OnDestroy {
  compareModeEnabled$: Observable<boolean>;
  documentView$: Observable<DocumentViewResponse | null>;
  didDocumentLoadAndRender$: Observable<boolean>;
  versionView$: Observable<DocumentViewResponse | null>;
  versionCompareView$: Observable<string>;
  searchPaneOpen$: Observable<boolean>;
  searchParams$: Observable<DocumentSearchParams>;
  versions$: Observable<Version[]>;
  versionSearchOpen$: Observable<boolean>;
  recentChanges$: Observable<Version[]>;
  documentConfig$: Observable<DocumentConfig>;
  versionId$: Observable<string | null>;
  versionCompareIds$: Observable<Version[]>;
  searchResultIndexArray: any[];
  focusedSearchResult: any | null;
  currentSearchResults: Array<SearchMatchVO>;
  versionSearchParams$: Observable<VersionSearchParams>;
  versionSearchResults$: Observable<string[]>;
  versionFilter$: Observable<string>;
  searchResultsCounter$: Observable<number>;
  collaborators$: Observable<Collaborator[]>;
  permissions$: Observable<Permission[]>;
  navigationPaneCollapse$: Observable<boolean>;
  userGuidanceVisible$: Observable<boolean>;
  reloadTrigger$: Observable<number>;
  collapseExpandAnnotation$: Observable<boolean>;
  documentRefAndCategory$: Observable<DocumentRefAndCategory | null>;
  replacedTextPresent = false;
  currentIndex: number;
  displayedCurrentIndex: number;
  setAnnotationMode?: (mode: AnnotateOperationMode) => void;
  contributions$: Observable<ContributionVO[]>;
  processed$: Observable<[boolean, ContributionVO]>;
  contributionViewAndMerge$: Observable<[DocumentViewResponse, ContributionVO]>;
  contributionSelections$: Observable<number>;
  contributionViewAndMergeCollapsed$: Observable<boolean>;
  annexDocNumber$: Observable<number>;
  isClonedProposal$: Observable<boolean>;
  isContributionDeclinedOrProcessed$: Observable<boolean>;

  private processedBS = new BehaviorSubject<[boolean, ContributionVO]>([
    false,
    undefined,
  ]);
  private contributionViewAndMergeBS = new BehaviorSubject<
    [DocumentViewResponse, ContributionVO]
  >(null);
  private collapseExpandAnnotationSubj = new Subject<boolean>();
  private compareModeEnabledBS = new BehaviorSubject(false);
  private documentIdBS = new BehaviorSubject<string | null>(null);
  private contributionsBS = new BehaviorSubject<ContributionVO[]>([]);
  private searchPaneOpenBS = new BehaviorSubject(false);
  private searchParamsBS = new BehaviorSubject({
    searchText: '',
    wholeWords: false,
    matchCase: false,
  });
  private versionSearchOpenBS = new BehaviorSubject(false);
  private versionIdBS = new BehaviorSubject<string | null>(null);
  private versionCompareIdsBS = new BehaviorSubject<Version[]>([]);
  private versionSearchParamsBS = new BehaviorSubject({
    type: 'all',
    author: '',
  });
  private versionSearchResultsBS$ = new BehaviorSubject<string[] | null>(null);

  private versionFilterBS = new BehaviorSubject<string>('All');
  private searchAndReplaceTextBS = new BehaviorSubject<string>('');
  private collaboratorsBS = new BehaviorSubject<Collaborator[]>([]);
  private permissionsBS = new BehaviorSubject<Permission[]>([]);
  private navigationPaneCollapseBS = new BehaviorSubject<boolean>(true);
  private userGuidanceVisibleBS = new BehaviorSubject<boolean>(false);
  private reloadTriggerBS = new BehaviorSubject<number>(0);
  private documentRefAndCategoryBS =
    new BehaviorSubject<DocumentRefAndCategory | null>(null);
  private updatedContentToSaveAfterReplace: string = null;
  private isDocumentLoadedBS = new BehaviorSubject<boolean>(false);
  private searchResultsCounterBS = new BehaviorSubject<number>(0);
  private contributionSelectionsBS = new BehaviorSubject<number>(0);
  private contributionViewAndMergeCollapsedBS = new BehaviorSubject<boolean>(
    true,
  );
  private annexDocNumberBS = new BehaviorSubject<number>(-1);
  private isClonedProposalBS = new BehaviorSubject<boolean>(false);
  private isContributionDeclinedOrProcessedBS = new BehaviorSubject<boolean>(
    false,
  );
  private getAnnotations?: () => Promise<string>;

  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
    private appConfig: AppConfigService,
    private appShell: UxAppShellService,
    private translate: TranslateService,
    private coEditionService: CoEditionServiceWS,
    private loadingService: LoadingService,
  ) {
    this.annexDocNumber$ = this.annexDocNumberBS.asObservable();
    this.isClonedProposal$ = this.isClonedProposalBS.asObservable();
    this.isContributionDeclinedOrProcessed$ =
      this.isContributionDeclinedOrProcessedBS.asObservable();
    this.didDocumentLoadAndRender$ = this.isDocumentLoadedBS.asObservable();
    this.documentRefAndCategory$ = this.documentRefAndCategoryBS
      .asObservable()
      .pipe(filter(Boolean), distinctUntilChanged());

    this.documentView$ = this.documentRefAndCategory$.pipe(
      tap((res) => res.category !== 'coverpage' && this.getContributions()),
      filter(Boolean),
      switchMap((option) => this.getDocumentByRef(option.ref, option.category)),
      shareReplay(1),
    );
    this.contributions$ = this.contributionsBS.asObservable();

    this.compareModeEnabled$ = this.compareModeEnabledBS.asObservable();
    this.searchPaneOpen$ = this.searchPaneOpenBS.asObservable();
    this.versionId$ = this.versionIdBS.asObservable();
    this.versionCompareIds$ = this.versionCompareIdsBS.asObservable();
    this.versionFilter$ = this.versionFilterBS.asObservable();
    this.searchParams$ = this.searchParamsBS.pipe(
      distinctUntilChanged(DocumentService.searchStateComparator),
    );
    this.versionSearchParams$ = this.versionSearchParamsBS.pipe(
      distinctUntilChanged(DocumentService.searchStateComparator),
    );
    this.versions$ = this.documentRefAndCategory$.pipe(
      filter(Boolean),
      switchMap((option) =>
        this.getDocumentVersionsData(option.category, option.ref),
      ),
      shareReplay(1),
    );

    this.documentConfig$ = this.documentRefAndCategory$.pipe(
      filter(Boolean),
      switchMap((option) =>
        this.getDocumentConfig(option.ref, option.category),
      ),
      shareReplay(1),
    );

    this.recentChanges$ = this.documentRefAndCategory$.pipe(
      filter(Boolean),
      switchMap((option) =>
        this.getDocumentRecentChangesData(option.category, option.ref),
      ),
      shareReplay(1),
    );

    this.versionSearchOpen$ = this.versionSearchOpenBS.asObservable();

    this.searchPaneOpen$
      .pipe(
        takeUntil(this.destroy$),
        filter((x) => !x),
      )
      .subscribe(() => this.setSearchParams({ searchText: '' }));

    this.searchParams$
      .pipe(takeUntil(this.destroy$), skip(2))
      .subscribe((params) => this.doSearch(params));

    this.versionSearchOpen$
      .pipe(
        takeUntil(this.destroy$),
        filter((x) => !x),
      )
      .subscribe(() => this.setVersionSearchParams({ author: '' }));

    this.versionView$ = this.versionId$.pipe(
      takeUntil(this.destroy$),
      skip(1),
      combineLatestWith(this.documentRefAndCategory$),
      mergeMap(([versionId, option]) =>
        this.getDocumentVersion(option.category, versionId),
      ),
    );

    this.versionCompareView$ = this.versionCompareIds$.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged((a, b) =>
        isEqual(
          a.map((x) => x.documentId),
          b.map((x) => x.documentId),
        ),
      ),
      combineLatestWith(this.documentRefAndCategory$),
      mergeMap(([[oldVersion, newVersion], option]) =>
        oldVersion && newVersion
          ? this.getDocumentVersionsComparison(
              option.category,
              newVersion.documentId,
              oldVersion.documentId,
            )
          : of(''),
      ),
    );

    this.collaborators$ = this.collaboratorsBS.asObservable();
    this.documentView$
      .pipe(
        takeUntil(this.destroy$),
        mergeMap((doc) => this.getCollaborators(doc.proposalRef)),
      )
      .subscribe((collaborators) => this.collaboratorsBS.next(collaborators));
    this.permissions$ = this.permissionsBS.asObservable();
    this.collaborators$
      .pipe(takeUntil(this.destroy$), combineLatestWith(this.appConfig.config))
      .subscribe(([collaborators, config]) => {
        const permissions = this.resolvePermissions(collaborators, config);
        this.permissionsBS.next(permissions);
      });

    this.setVersionFilter('all');

    this.navigationPaneCollapse$ = this.navigationPaneCollapseBS.asObservable();
    this.userGuidanceVisible$ = this.userGuidanceVisibleBS.asObservable();
    this.reloadTrigger$ = this.reloadTriggerBS.asObservable();

    this.versionSearchParams$
      .pipe(
        takeUntil(this.destroy$),
        skip(1),
        combineLatestWith(this.versions$, this.recentChanges$),
      )
      .subscribe(([searchParams, versions, recentChanges]) =>
        this.onVersionSearchParamChange(searchParams, versions, recentChanges),
      );
    this.versionSearchResults$ = this.versionSearchResultsBS$.asObservable();
    this.collapseExpandAnnotation$ =
      this.collapseExpandAnnotationSubj.asObservable();
    this.searchResultsCounter$ = this.searchResultsCounterBS.asObservable();
    this.processed$ = this.processedBS.asObservable();
    this.contributionViewAndMerge$ =
      this.contributionViewAndMergeBS.asObservable();
    this.contributionSelections$ = this.contributionSelectionsBS.asObservable();
    this.contributionViewAndMergeCollapsed$ =
      this.contributionViewAndMergeCollapsedBS.asObservable();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.getAnnotations = null;
    this.setAnnotationMode = null;
  }

  async download(withAnnotations = false) {
    const documentType = this.documentType.toUpperCase();
    const documentRef = this.documentRef;

    const annotations =
      (withAnnotations && (await this.getAnnotations())) || '';
    this.http
      .post(
        `${apiBaseUrl}/secured/document/downloadVersion/${documentType}/${documentRef}`,
        {
          withAnnotations,
          annotations,
        },
        {
          observe: 'response',
          responseType: 'blob',
        },
      )
      .subscribe((resp) => this.handleDownloadResponse(resp));
  }

  downloadCleanVersion() {
    const documentType = this.documentType;
    const documentRef = this.documentRef;

    this.http
      .get(
        `${apiBaseUrl}/secured/${documentType}/${documentRef}/download-clean-version`,
        {
          observe: 'response',
          responseType: 'blob',
        },
      )
      .subscribe((resp) => this.handleDownloadResponse(resp));
  }

  async downloadEConsilium(options: DownloadEConsiliumOptions) {
    const documentType = this.documentType.toUpperCase();
    const documentRef = this.documentRef;

    const annotations =
      (options.isWithAnnotations && (await this.getAnnotations())) || '';
    this.http
      .post<string>(
        `${apiBaseUrl}/secured/document/export-to-econsilium/${documentType}/${documentRef}`,
        {
          ...options,
          annotations,
        } as DownloadEConsiliumParams,
      )
      .subscribe({
        next: () => {
          this.appShell.growl({
            severity: 'success',
            detail: this.translate.instant(
              'page.editor.export-econsilium-success',
            ),
          });
        },
        error: () => {
          this.appShell.growl({
            severity: 'danger',
            detail: this.translate.instant(
              'page.editor.export-econsilium-error',
            ),
            sticky: true,
          });
        },
      });
  }

  getDocumentByRef(ref: string, category: string) {
    category = category === 'coverpage' ? 'coverPage' : category;
    return this.http.get<DocumentViewResponse>(
      `${apiBaseUrl}/secured/${category}/${ref}`,
    );
  }

  compareDocumentsDownloadDocuwrite(
    currentVersion: Version,
    originalVersion: Version,
    intermediateVersion?: Version,
  ) {
    const documentType = this.documentType;
    const documentRef = this.documentRef;
    this.http
      .post(
        `${apiBaseUrl}/secured/document/download-compared-version-as-docuwrite/${documentType}/${documentRef}/`,
        {
          originalVersion: this.getVersionReferenceString(originalVersion),
          currentVersion: this.getVersionReferenceString(currentVersion),
          intermediateVersion: intermediateVersion
            ? this.getVersionReferenceString(intermediateVersion)
            : null,
        },
        {
          observe: 'response',
          responseType: 'blob',
        },
      )
      .subscribe((resp) => this.handleDownloadResponse(resp));
  }

  compareDocumentsExportAsPdf(
    currentVersion: Version,
    originalVersion: Version,
    intermediateVersion?: Version,
  ) {
    const documentType = this.documentType;
    const documentRef = this.documentRef;
    this.http
      .post(
        `${apiBaseUrl}/secured/document/export-compared-version-as-PDF/${documentType}/${documentRef}/`,
        {
          originalVersion: this.getVersionReferenceString(originalVersion),
          currentVersion: this.getVersionReferenceString(currentVersion),
          intermediateVersion: intermediateVersion
            ? this.getVersionReferenceString(intermediateVersion)
            : null,
        },
      )
      .subscribe((resp: any) => this.handleDownloadResponse(resp));
  }

  compareDocumentsDownloadXML(
    currentVersion: Version,
    originalVersion: Version,
    intermediateVersion?: Version,
  ) {
    const documentType = this.documentType;
    const documentRef = this.documentRef;
    this.http
      .post(
        `${apiBaseUrl}/secured/document/download-compared-version-XML/${documentType}/${documentRef}`,
        {
          originalVersion: this.getVersionReferenceString(originalVersion),
          currentVersion: this.getVersionReferenceString(currentVersion),
          intermediateVersion: intermediateVersion
            ? this.getVersionReferenceString(intermediateVersion)
            : null,
        },
        {
          observe: 'response',
          responseType: 'blob',
        },
      )
      .subscribe((resp) => this.handleDownloadResponse(resp));
  }

  compareDocumentsDownloadPDF(
    currentVersion: Version,
    originalVersion: Version,
    intermediateVersion?: Version,
  ) {
    const documentType = this.documentType;
    const documentRef = this.documentRef;
    this.http
      .post(
        `${apiBaseUrl}/secured/document/export-compared-version-as-PDF/${documentType}/${documentRef}`,
        {
          originalVersion: this.getVersionReferenceString(originalVersion),
          currentVersion: this.getVersionReferenceString(currentVersion),
          intermediateVersion: intermediateVersion
            ? this.getVersionReferenceString(intermediateVersion)
            : null,
        },
      )
      .subscribe((resp: any) => this.handleDownloadResponse(resp));
  }

  reloadDocument() {
    this.setDidDocumentLoadAndRender(false);
    this.coEditionService.setShouldReloadAfterUpdate();
    this.setDocumentRefAndCategory(this.documentRef, this.documentType);
    this.setSearchResultsCounter(0);
  }

  resetDocument() {
    this.reloadTriggerBS.next(this.reloadTriggerBS.value + 1);
  }

  saveVersion(requestBody: any) {
    return this.saveDocumentVersionWithData(
      this.documentType,
      this.documentRef,
      requestBody,
    );
  }

  searchNext() {
    if (
      this.currentIndex >= 0 &&
      this.currentIndex < this.searchResultIndexArray.length - 1
    ) {
      this.scrollToElement(this.searchResultIndexArray[this.currentIndex + 1]);
    } else if (this.currentIndex === this.searchResultIndexArray.length - 1) {
      this.scrollToElement(this.searchResultIndexArray[0]);
    }
  }

  searchPrevious() {
    if (this.currentIndex !== 0) {
      this.scrollToElement(this.searchResultIndexArray[this.currentIndex - 1]);
    }
  }

  searchReplace() {
    const currentIndex = this.searchResultIndexArray.indexOf(
      this.focusedSearchResult,
    );
    this.http
      .put<any>(
        `${apiBaseUrl}/secured/${this.documentType}/${this.documentRef}/replace-one`,
        {
          documentRef: this.documentRef,
          searchText: this.searchParamsBS.value.searchText,
          replaceText: this.searchAndReplaceTextBS.value,
          caseSensitive: this.searchParamsBS.value.matchCase,
          completeWords: this.searchParamsBS.value.wholeWords,
          matchIndex: currentIndex,
        },
        { responseType: 'text' as 'json' },
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.updatedContentToSaveAfterReplace = res;
        this.replacedTextPresent = true;
      });
    if (
      currentIndex >= 0 &&
      currentIndex < this.searchResultIndexArray.length
    ) {
      this.document.getElementById(this.focusedSearchResult.id).innerText =
        this.searchAndReplaceTextBS.value;
      const tmpArray = this.searchResultIndexArray;
      const previousSearchResultIndexArrayLength =
        this.searchResultIndexArray.length;
      this.searchResultIndexArray = [];
      for (let i = 0; i < tmpArray.length; i++) {
        if (i !== currentIndex) {
          this.searchResultIndexArray.push(tmpArray[i]);
        }
      }

      if (currentIndex < previousSearchResultIndexArrayLength - 1) {
        this.scrollToElement(this.searchResultIndexArray[currentIndex], true);
      } else if (
        currentIndex === previousSearchResultIndexArrayLength - 1 &&
        previousSearchResultIndexArrayLength === 1
      ) {
        this.removeHighlights();
      } else {
        this.scrollToElement(this.searchResultIndexArray[0], true);
      }
      if (this.searchResultsCounterBS.value - 1 > 0) {
        this.setSearchResultsCounter(this.searchResultsCounterBS.value - 1);
      } else {
        this.setSearchResultsCounter(0);
      }
    }
  }

  searchReplaceAll() {
    this.http
      .put<any>(
        `${apiBaseUrl}/secured/${this.documentType}/${this.documentRef}/replace-all`,
        {
          documentRef: this.documentRef,
          searchText: this.searchParamsBS.value.searchText,
          replaceText: this.searchAndReplaceTextBS.value,
          caseSensitive: this.searchParamsBS.value.matchCase,
          completeWords: this.searchParamsBS.value.wholeWords,
        },
        { responseType: 'text' as 'json' },
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.updatedContentToSaveAfterReplace = res;
        this.replacedTextPresent = true;
      });
    this.searchResultIndexArray.forEach((el, i) => {
      this.document.getElementById(el.id).innerText =
        this.searchAndReplaceTextBS.value;
      if (i < this.searchResultIndexArray.length - 1) {
        this.scrollToElement(this.searchResultIndexArray[i + 1]);
      }
    });
    this.setSearchResultsCounter(0);
  }

  searchSave() {
    this.removeHighlights();
    const documentRef = this.documentRef;
    this.http
      .put<DocumentViewResponse>(
        `${apiBaseUrl}/secured/${this.documentType}/${this.documentRef}/save-after-replace`,
        {
          documentRef,
          updatedContent: this.updatedContentToSaveAfterReplace,
        },
      )
      .subscribe((updateResult) => {
        this.setDocumentRefAndCategory(this.documentRef, this.documentType);
      });
  }

  searchSaveAndClose() {
    this.searchSave();
    this.toggleSearchPane(false);
    this.replacedTextPresent = false;
  }

  searchCancelAndClose() {
    this.toggleSearchPane(false);
    this.resetDocument();
    this.replacedTextPresent = false;
  }

  seeNavigation() {
    this.navigationPaneCollapseBS.next(!this.navigationPaneCollapseBS.value);
  }

  seeUserGuidance() {
    this.userGuidanceVisibleBS.next(!this.userGuidanceVisibleBS.value);

    if (this.userGuidanceVisibleBS.value) {
      const documentType =
        this.documentType === 'coverpage' ? 'coverPage' : this.documentType;
      const documentRef = this.documentRef;
      return this.http.get<string | null>(
        `${apiBaseUrl}/secured/${documentType}/${documentRef}/userGuidance`,
      );
    } else {
      return of(null);
    }
  }

  fetchTocAndAncestors(elementIds: string[]) {
    const documentType =
      this.documentType === 'coverpage' ? 'coverPage' : this.documentType;
    const documentRef = this.documentRef;
    const params =
      elementIds?.length > 0
        ? {
            elementIds: elementIds.join(','),
          }
        : {};
    return this.http.get(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/fetch-toc-ancestors`,
      {
        params,
      },
    );
  }

  fetchReferenceLabel(
    references: Array<string>,
    currentElementId: string,
    capital: boolean,
    documentRef: string,
  ) {
    return this.http.get<any>(
      `${apiBaseUrl}/secured/document/fetch-reference-label/${documentRef}`,
      {
        responseType: 'text' as any,
        params: {
          references,
          currentElementId: currentElementId ?? null,
          capital,
        },
      },
    );
  }

  requestElement(
    elementId: string,
    elementTagName: string,
    documentRef: string,
  ) {
    return this.http.get<FetchElementResponse>(
      `${apiBaseUrl}/secured/document/request-element/${documentRef}`,
      {
        params: {
          elementId,
          elementTagName,
        },
      },
    );
  }

  setDocumentRefAndCategory(ref: string, category: string) {
    this.documentRefAndCategoryBS.next({ ref, category });
  }

  setCollapseExpandAnnotation(value: boolean) {
    this.collapseExpandAnnotationSubj.next(value);
  }

  setSearchParams(values: Partial<DocumentSearchParams>) {
    if (values.searchText === '') {
      this.currentSearchResults = [];
      this.currentIndex = 0;
      this.displayedCurrentIndex = 0;
      this.removeHighlights();
    }
    this.searchParamsBS.pipe(take(1)).subscribe((oldVal) => {
      this.searchParamsBS.next({ ...oldVal, ...values });
    });
  }

  setSearchAndReplaceText(text: string) {
    this.searchAndReplaceTextBS.next(text);
  }

  setVersionSearchParams(values: Partial<VersionSearchParams>) {
    this.versionSearchParamsBS.pipe(take(1)).subscribe((oldVal) => {
      this.versionSearchParamsBS.next({ ...oldVal, ...values });
    });
  }

  setVersionCompareIds(versions: Version[]) {
    this.versionCompareIdsBS.next(versions);
  }

  getVersionCompareIds() {
    return this.versionCompareIdsBS.value;
  }

  setVersionFilter(filterValue: string) {
    this.versionFilterBS.next(filterValue);
  }

  toggleCompareMode(enabled?: boolean) {
    this.toggleSubject(this.compareModeEnabledBS, enabled);
    this.compareModeEnabledBS.pipe(take(1)).subscribe((e) => {
      if (!e) this.setVersionCompareIds([]);
    });
  }

  toggleSearchPane(open?: boolean) {
    if (!open) {
      this.removeHighlights();
    }
    this.searchResultIndexArray = [];
    this.currentSearchResults = [];
    this.focusedSearchResult = null;
    this.setSearchParams({ searchText: '' });
    this.toggleSubject(this.searchPaneOpenBS, open);
    this.setDocumentRefAndCategory(this.documentRef, this.documentType);
    this.setSearchResultsCounter(0);
  }

  toggleVersionsSearchPane(open?: boolean) {
    this.toggleSubject(this.versionSearchOpenBS, open);
  }

  handleContributionSelectCount(selected: boolean, reset?: boolean) {
    if (reset) {
      this.contributionSelectionsBS.next(0);
    } else if (selected) {
      this.contributionSelectionsBS.next(
        this.contributionSelectionsBS.value + 1,
      );
    } else {
      if (this.contributionSelectionsBS.value - 1 >= 0) {
        this.contributionSelectionsBS.next(
          this.contributionSelectionsBS.value - 1,
        );
      } else {
        this.contributionSelectionsBS.next(0);
      }
    }
  }

  versionRevert(versionNumber: string) {
    this.http
      .get(
        `${apiBaseUrl}/secured/${this.documentType}/${this.documentRef}/restore/${versionNumber}`,
      )
      .subscribe((r) => {
        this.setDocumentRefAndCategory(this.documentRef, this.documentType);
      });
  }

  versionView(versionNumber: string) {
    this.versionIdBS.next(versionNumber);
  }

  versionExport(version: Version) {
    const documentType = this.documentType;
    const documentRef = this.documentRef;
    const versionId = version.documentId;
    const { major, intermediate, minor } = version.versionNumber;
    const versionNumber = `${major}.${intermediate}.${minor}`;

    this.http
      .get(
        `${apiBaseUrl}/secured/${documentType}/${documentRef}/download-xml-version`,
        {
          params: { versionId },
          responseType: 'blob',
        },
      )
      .subscribe((blob) => {
        const filename = `${documentRef}_v${versionNumber}.xml`;
        downloadBlob(blob, filename, this.document);
      });
  }

  validateNodeDrop(
    draggedNodeId: string[],
    draggedNodeTagName: string,
    targetNodeId: string,
    targetNodeTagName: string,
    parentNodeId: string,
    parentNodeTagName: string,
    position: string,
    documentType: string,
    documentRef: string,
  ) {
    return this.http.post<NodeValidationResponse>(
      `${apiBaseUrl}/secured/toc/${documentRef}/validate-node-drop`,
      {
        draggedNodeId,
        draggedNodeTagName,
        targetNodeId,
        targetNodeTagName,
        parentNodeId,
        parentNodeTagName,
        position: position.toUpperCase(),
        documentRef,
        documentType: documentType.toUpperCase(),
      },
    );
  }

  get documentRef() {
    return this.documentRefAndCategoryBS.value.ref;
  }

  getDocumentVersionsData(documentType: string, documentRef: string) {
    documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
    return this.http.get<Version[]>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/version-data`,
    );
  }

  getDocumentRecentChangesData(documentType: string, documentRef: string) {
    documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
    return this.http
      .get<Version[]>(
        `${apiBaseUrl}/secured/${documentType}/${documentRef}/recent-changes`,
      )
      .pipe(take(1));
  }

  saveDocumentVersionWithData(
    documentType: string,
    documentRef: string,
    data: any,
  ) {
    documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
    return this.http.post<Version[]>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/save-version`,
      {
        ...data,
      },
    );
  }

  getDocumentVersion(documentType: string, versionId: string) {
    documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
    return this.http.get<DocumentViewResponse>(
      `${apiBaseUrl}/secured/${documentType}/${versionId}/show-version`,
    );
  }

  getDocumentVersionsComparison(
    documentType: string,
    newVersionId: string,
    oldVersionId: string,
  ) {
    documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
    return this.http.get<string>(
      `${apiBaseUrl}/secured/${documentType}/${newVersionId}/compare/${oldVersionId}`,
      { responseType: 'text' as 'json' },
    );
  }

  renumberDocument() {
    const documentType =
      this.documentType === 'coverpage' ? 'coverPage' : this.documentType;
    const documentRef = this.documentRef;
    this.http
      .put<DocumentViewResponse>(
        `${apiBaseUrl}/secured/${documentType}/${documentRef}/renumber-document`,
        {},
      )
      .subscribe((response) => {
        this.setDocumentRefAndCategory(documentRef, documentType);
      });
  }

  switchDocumentStructure() {
    const documentType =
      this.documentType === 'coverpage' ? 'coverPage' : this.documentType;
    const documentRef = this.documentRef;
    return this.http.get<DocumentViewResponse>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/switch-annex-structure`,
    );
  }

  setAnnotationGetter(getAnnotations: () => Promise<string>) {
    this.getAnnotations = getAnnotations;
  }

  setAnnotationsReadOnlySetter(
    setAnnotationsReadOnly: (mode: AnnotateOperationMode) => void,
  ) {
    this.setAnnotationMode = setAnnotationsReadOnly;
  }

  setDidDocumentLoadAndRender(loaded: boolean) {
    this.isDocumentLoadedBS.next(loaded);
  }

  setContributionViewAndMergeCollapsed(collapsed: boolean) {
    this.contributionViewAndMergeCollapsedBS.next(collapsed);
  }

  setAnnexDocNumber(num: number) {
    this.annexDocNumberBS.next(num);
  }

  setIsClonedProposal(cloned: boolean) {
    this.isClonedProposalBS.next(cloned);
  }

  setIsContributionDeclinedOrProcessed(declined: boolean) {
    this.isContributionDeclinedOrProcessedBS.next(declined);
  }

  toggleIsContributionDeclinedOrProcessed() {
    this.isContributionDeclinedOrProcessedBS.next(
      !this.isContributionDeclinedOrProcessedBS.value,
    );
  }

  getUserPermissions() {
    return this.permissionsBS.value;
  }

  getContributions(annexIndex?: number) {
    const documentRef = this.documentRef;
    const documentType =
      this.documentType === 'coverpage' ? 'coverPage' : this.documentType;
    let queryString = '';
    this.annexDocNumber$.subscribe((num) => {
      queryString = '?annexIndex=' + num;
    });
    return this.http
      .get<ContributionVO[]>(
        `${apiBaseUrl}/secured/contribution/list-contributions/${documentRef}/${documentType}${queryString}`,
      )
      .subscribe((contributions) => {
        this.contributionsBS.next(contributions);
      });
  }

  declineContribution(contribution: ContributionVO) {
    const documentRef = contribution.versionedReference;
    const documentType =
      this.documentType === 'coverpage' ? 'coverPage' : this.documentType;
    const versionLabel = `${contribution.versionNumber.major}.${contribution.versionNumber.intermediate}.${contribution.versionNumber.minor}`;

    return this.http
      .post<{ contributionStatus: string }>(
        `${apiBaseUrl}/secured/contribution/decline-contributions/${documentRef}/${documentType}`,
        {},
        { params: { versionLabel } },
      )
      .subscribe({
        next: (res) => {
          this.appShell.growl({
            severity: 'success',
            summary: this.translate.instant(
              'global.notifications.title.success',
            ),
            detail: this.translate.instant(
              'page.editor.contribution.decline-contribution-message-success',
            ),
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
          this.setIsContributionDeclinedOrProcessed(true);
          this.contributionSelectionsBS.next(0);
          this.getContributions();
        },
        error: (res) => {
          this.appShell.growl({
            severity: 'danger',
            summary: this.translate.instant(
              'page.editor.contribution.decline-contribution-message-error',
            ),
            detail: res,
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
        },
      });
  }

  updateProcessedStatus(process: boolean, contribution: ContributionVO) {
    this.processedBS.next([process, contribution]);
  }

  viewAndMergeContribution(contribution: ContributionVO) {
    const contributionVersionRef = contribution.versionedReference;
    const documentRef = this.documentRef;
    const documentType =
      this.documentType === 'coverpage' ? 'coverPage' : this.documentType;
    this.http
      .get<DocumentViewResponse>(
        `${apiBaseUrl}/secured/contribution/view-merge-pane/${documentRef}/${documentType}?contributionVersionRef=${contributionVersionRef}`,
        {},
      )
      .subscribe({
        next: (res) => {
          this.contributionViewAndMergeBS.next([res, contribution]);
        },
        error: (res) => {
          this.appShell.growl({
            severity: 'danger',
            summary: this.translate.instant(
              'page.editor.contribution.view-contribution-message-error',
            ),
            detail: res,
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
        },
      });
  }

  markContributionAsProcessed(contribution: ContributionVO) {
    const contributionVersionRef = contribution.versionedReference;
    const documentType =
      this.documentType === 'coverpage' ? 'coverPage' : this.documentType;

    return this.http.post(
      `${apiBaseUrl}/secured/contribution/mark-as-processed/${contributionVersionRef}/${documentType}`,
      {},
    );
  }

  mergeContributions(
    mergeActions: MergeActionVO[],
    acceptAllContributions: boolean,
  ) {
    const documentRef = this.documentRef;
    const documentType =
      this.documentType === 'coverpage' ? 'coverPage' : this.documentType;

    this.http
      .post(
        `${apiBaseUrl}/secured/contribution/merge-contributions/${documentRef}/${documentType}`,
        {
          mergeActions,
          acceptAllContributions,
        },
        { responseType: 'text' as 'json' },
      )
      .subscribe({
        next: (res) => {
          this.appShell.growl({
            severity: 'success',
            summary: this.translate.instant(
              'global.notifications.title.success',
            ),
            detail: this.translate.instant(
              'page.editor.contribution.merge-contribution-message-success',
            ),
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
          if (!acceptAllContributions)
            this.updateProcessedStatus(false, mergeActions[0].contributionVO);
          this.reloadDocument();
          this.getContributions();
        },
        error: (res) => {
          this.appShell.growl({
            severity: 'danger',
            summary: this.translate.instant(
              'page.editor.contribution.merge-contribution-message-error',
            ),
            detail: res,
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
        },
      });
  }

  private setSearchResultsCounter(count: number) {
    this.searchResultsCounterBS.next(count);
  }

  private getDocumentConfig(documentRef: string, documentType: string) {
    documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
    return this.http.get<DocumentConfig>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/document-config`,
    );
  }

  private doSearch(parameters: DocumentSearchParams) {
    if (parameters.searchText !== '') {
      this.currentSearchResults = [];
      this.http
        .get<SearchMatchVO[]>(
          `${apiBaseUrl}/secured/${this.documentType}/${this.documentRef}/search-text`,
          {
            params: parameters,
          },
        )
        .subscribe((results) => {
          this.currentSearchResults = results;
          this.setSearchResultsCounter(results.length);
          this.highlightSearchResults(results);
          this.scrollToElement(this.searchResultIndexArray[0]);
          this.currentIndex = 0;
          this.displayedCurrentIndex = 0;
        });
    }
  }

  private toggleSubject(subj: Subject<boolean>, value?: boolean) {
    subj.pipe(take(1)).subscribe((oldVal) => {
      const nextVal = value ?? !oldVal;
      subj.next(nextVal);
    });
  }

  private getDocument(documentRef: string, category: string) {
    return this.http
      .get(`${apiBaseUrl}/secured/${category}/${documentRef}`, {
        responseType: 'text',
      })
      .pipe(take(1));
  }

  private static searchStateComparator(a, b) {
    const aKeys = Object.keys(a);
    return (
      aKeys.length === Object.keys(b).length &&
      aKeys.every((k) => a[k] === b[k])
    );
  }

  private highlightSearchResults(resultArray: any[]) {
    this.removeHighlights();
    const rangeArray = [];
    const wrapperIdArray = [];
    for (const [index, res] of resultArray.entries()) {
      const element = document.getElementById(
        `${res.matchedElements[0].elementId}`,
      );
      if (element) {
        let elementTextLength = 0;
        let previousElementTextLength = 0;
        let foundSearchText = false;
        if (element.children.length === 0) {
          const range = document.createRange();
          const start =
            res.matchedElements[0].matchStartIndex - previousElementTextLength;
          range.setStart(element.childNodes[0], start);
          const end =
            res.matchedElements[0].matchEndIndex - previousElementTextLength;
          range.setEnd(element.childNodes[0], end);
          rangeArray.push(range);
          wrapperIdArray.push('result-' + index);
          this.searchResultIndexArray.push({
            id: 'result-' + index,
            resultArrayIndex: index,
          });
        } else {
          for (let j = 0; j < element.childNodes.length; j++) {
            const i = element.childNodes[j];
            const iHtml = element.childNodes[j] as HTMLElement;
            if (
              i.nodeType !== 3 &&
              iHtml.classList.contains('leos-content-soft-removed')
            ) {
              continue;
            } else {
              previousElementTextLength = elementTextLength;
              if (i.nodeType !== 3) {
                //nodeType=3 represents a text node
                const currentTextLength = this.getNodeTextOnlyLength(i);
                elementTextLength += currentTextLength;
              } else {
                elementTextLength += i.textContent.length;
              }
              if (
                elementTextLength - res.matchedElements[0].matchStartIndex >
                  -1 &&
                elementTextLength - res.matchedElements[0].matchEndIndex > -1 &&
                !foundSearchText
              ) {
                const range = document.createRange();
                const start =
                  res.matchedElements[0].matchStartIndex -
                  previousElementTextLength;
                range.setStart(i.firstChild !== null ? i.firstChild : i, start);
                const end =
                  res.matchedElements[0].matchEndIndex -
                  previousElementTextLength;
                range.setEnd(i.firstChild !== null ? i.firstChild : i, end);
                rangeArray.push(range);
                wrapperIdArray.push('result-' + index + '-' + j);
                this.searchResultIndexArray.push({
                  id: 'result-' + index + '-' + j,
                  resultArrayIndex: index,
                });
                foundSearchText = true;
              }
            }
          }
        }
      }
    }

    rangeArray.forEach((item, i) => {
      const wrapper = document.createElement('span');
      wrapper.id = wrapperIdArray[i];

      wrapper.classList.add('search-result');
      item.surroundContents(wrapper);
    });
  }

  private removeHighlights() {
    this.searchResultIndexArray = [];
    this.focusedSearchResult = null;
    this.document.querySelectorAll('.search-result').forEach((el) => {
      const p = el.parentNode;
      el.replaceWith(...el.childNodes);
      p.normalize();
    });
    this.document.querySelectorAll('.focused-search-result').forEach((el) => {
      const p = el.parentNode;
      el.replaceWith(...el.childNodes);
      p.normalize();
    });
  }

  private scrollToElement(searchObj: any, afterReplace?: boolean) {
    if (this.focusedSearchResult !== null) {
      const currentElement = document.getElementById(
        this.focusedSearchResult.id,
      );
      currentElement.classList.remove('focused-search-result');
      if (afterReplace) {
        const p = currentElement.parentNode;
        currentElement.replaceWith(...currentElement.childNodes);
        p.normalize();
      } else {
        currentElement.classList.add('search-result');
      }
    }
    this.focusedSearchResult = searchObj;
    const targetElement = document.getElementById(searchObj.id);
    if (targetElement) {
      this.currentIndex = this.searchResultIndexArray.indexOf(
        this.focusedSearchResult,
      );
      targetElement.classList.remove('search-result');
      targetElement.classList.add('focused-search-result');
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  private onVersionSearchParamChange(
    searchParams: VersionSearchParams,
    versions: Version[],
    recentChanges: Version[],
  ): void {
    const author = searchParams?.author?.toLowerCase() ?? '';
    const type = searchParams?.type ?? 'all';

    this.setVersionFilter(type);
    if (!author) {
      this.versionSearchResultsBS$.next(null);
    } else {
      const searchResult = [];
      [
        ...recentChanges,
        ...versions,
        ...versions.flatMap((ver) => ver.subVersions),
      ].forEach((version) => {
        if (version.createdBy?.toLowerCase()?.includes(author)) {
          searchResult.push(version.cmisVersionNumber);
        }
      });
      this.versionSearchResultsBS$.next(searchResult);
    }
  }

  /** The document type for use in `/secured/{documentType}` API endpoints. */
  get documentType() {
    return this.documentRefAndCategoryBS.value.category === 'coverpage'
      ? 'coverPage'
      : this.documentRefAndCategoryBS.value.category;
  }

  private getCollaborators(proposalRef: string) {
    if (!proposalRef) return;
    return this.http.get<Collaborator[]>(
      `${apiBaseUrl}/secured/proposal/${proposalRef}/collaborators`,
    );
  }

  private resolvePermissions(
    collaborators: Collaborator[],
    config: LeosAppConfig,
  ) {
    const docRoles = collaborators
      .filter((c) => c.login === config.user.login)
      .map((c) => c.role);
    const roles = [...config.user.roles, ...docRoles];
    const permissions = roles.flatMap((r) => config.permissionsMap[r]);
    return [...new Set(permissions)];
  }

  private handleDownloadResponse(resp: HttpResponse<Blob>) {
    const blob = resp.body;
    if (blob.size === 0) {
      this.notifyExportEmailSent();
    } else {
      const cd = parseContentDisposition(
        resp.headers.get('Content-Disposition'),
      );
      const filename = cd.attachment ? cd.filename : 'export';
      downloadBlob(blob, filename, this.document);
    }
  }

  private notifyExportEmailSent() {
    this.appConfig.config.subscribe((c) => {
      const userEmail = c.user.email;
      const fileType = 'Pdf';
      this.translate
        .get('page.editor.export-version-email-sent', { fileType, userEmail })
        .subscribe((message) => {
          this.appShell.growl({
            severity: 'info',
            detail: message,
          });
        });
    });
  }

  private getNodeTextOnlyLength(node: Node) {
    if (node.nodeType === 3) {
      //nodeType 3 represents a text node
      return node.textContent.length;
    } else if (node.nodeName === 'AUTHORIALNOTE') {
      //if it is a super/subscript dont return any length
      return 0;
    } else {
      if (node.childNodes.length === 1) {
        return this.getNodeTextOnlyLength(node.childNodes[0]);
      } else if (node.childNodes.length > 1) {
        node.childNodes.forEach((n, i) => this.getNodeTextOnlyLength(n));
      }
    }
  }

  private getVersionReferenceString(v: Version): string {
    return `${v.versionNumber.major}.${v.versionNumber.intermediate}.${v.versionNumber.minor}`;
  }
}
