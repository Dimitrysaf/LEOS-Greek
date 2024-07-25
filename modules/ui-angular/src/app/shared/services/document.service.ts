import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { EuiGrowlService } from '@eui/core';
import { TranslateService } from '@ngx-translate/core';
import { parse as parseContentDisposition } from 'content-disposition-attachment';
import {
  BehaviorSubject,
  combineLatestWith,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  mergeMap,
  Observable,
  of,
  shareReplay,
  skip,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';
import { DocumentSearchParams } from '@/features/akn-document/models';
import { Version } from '@/features/akn-document/models/versions';
import { TableOfContentService } from '@/features/akn-document/services/table-of-content.service';
import {
  AnnotateOperationMode,
  Collaborator,
  DocumentConfig,
  LeosAppConfig,
  Permission,
} from '@/shared';
import { VersionSearchParams } from '@/shared/models/versionSearch';
import { EnvironmentService } from '@/shared/services/enviroment.service';
import { LoadingService } from '@/shared/services/loading.service';
import { downloadBlob } from '@/shared/utils';
import { cleanDelInsert } from '@/shared/utils/string.utils';

import { apiBaseUrl } from '../../../config';
import {
  DocumentViewResponse,
  FetchElementResponse,
} from '../models/document-view-response.model';
import { SearchMatchVO } from '../models/search.model';
import { CoEditionServiceWS } from './coEdition.websocket.service';

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

export type DocumentRefAndCategory = {
  ref: string;
  category: string;
};

const BASE_EC_VERSION = '0.1.0';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  pageTitle$: Observable<string>;
  documentView$: Observable<DocumentViewResponse | null>;
  didDocumentLoadAndRender$: Observable<boolean>;
  searchPaneOpen$: Observable<boolean>;
  searchParams$: Observable<DocumentSearchParams>;
  versions$: Observable<Version[]>;
  versionSearchOpen$: Observable<boolean>;
  resetZoom$: Observable<void>;
  recentChanges$: Observable<Version[]>;
  documentConfig$: Observable<DocumentConfig>;
  searchResultIndexArray: any[];
  focusedSearchResult: any | null;
  currentSearchResults: Array<SearchMatchVO>;
  versionSearchParams$: Observable<VersionSearchParams>;
  versionSearchResults$: Observable<Version[]>;
  versionFilter$: Observable<string>;
  versionLatest$: Observable<Version>;
  searchResultsCounter$: Observable<number>;
  totalNumVersion$: Observable<number>;
  collaborators$: Observable<Collaborator[]>;
  permissions$: Observable<Permission[]>;
  userRoles$: Observable<string[]>;
  navigationSidebarCollapsed$: Observable<boolean>;
  userGuidanceVisible$: Observable<boolean>;
  reloadTrigger$: Observable<number>;
  refreshConnectors$: Observable<{
    documentRef: string;
    elementId: string;
    elementType: string;
    elementFragment: string;
    isClosing: boolean;
    isSaved: boolean;
  }>;
  refreshView$: Observable<DocumentViewResponse>;
  documentRefAndCategory$: Observable<DocumentRefAndCategory | null>;
  replacedTextPresent = false;
  currentIndex: number;
  displayedCurrentIndex: number;
  setAnnotationMode?: (mode: AnnotateOperationMode) => void;
  isClonedProposal$: Observable<boolean>;
  isEditorOpen$: Observable<boolean>;
  updateElementContent$: Observable<{
    documentRef: string;
    elementId: string;
    elementType: string;
    elementFragment: string;
    isClosing: boolean;
    isSaved: boolean;
  }>;
  getElementContent$: Observable<{
    elementId: string;
    elementType: string;
  }>;
  getElementContentResponse$: Observable<{
    elementId: string;
    elementType: string;
    elementFragment: string;
  }>;
  pageSize = 10;
  isReloadRequired = false;
  public trackChangesStatus$: Observable<{
    isTrackChangesEnabled: boolean;
    isTrackChangesShowed: boolean;
  }>;
  public annexDocNumber = 0;

  private documentPageTitleBS = new BehaviorSubject<string>('');
  private resetZoomBS = new BehaviorSubject<void>(null);
  private searchPaneOpenBS = new BehaviorSubject(false);
  private searchParamsBS = new BehaviorSubject({
    searchText: '',
    wholeWords: false,
    matchCase: false,
  });
  private documentConfigBS = new BehaviorSubject<DocumentConfig>(null);
  private recentChangesBS = new BehaviorSubject<Version[]>([]);
  private totalNumVersionBS = new BehaviorSubject<number>(0);
  private versionLatestBS = new BehaviorSubject<Version>(null);
  private versionSearchOpenBS = new BehaviorSubject(false);
  // private versionIdBS = new BehaviorSubject<string | null>(null);
  private versionSearchParamsBS = new BehaviorSubject({
    type: 'all',
    author: '',
  });
  private documentViewBS = new BehaviorSubject<DocumentViewResponse>(null);
  private versionSearchResultsIsEmpty = true;
  private versionFilterBS = new BehaviorSubject<string>('All');
  private searchAndReplaceTextBS = new BehaviorSubject<string>('');
  private collaboratorsBS = new BehaviorSubject<Collaborator[]>([]);
  private permissionsBS = new BehaviorSubject<Permission[]>([]);
  private userRolesBS = new BehaviorSubject<string[]>([]);
  private navigationSidebarCollapsedBS = new BehaviorSubject<boolean>(false);
  private userGuidanceVisibleBS = new BehaviorSubject<boolean>(false);
  private reloadTriggerBS = new BehaviorSubject<number>(0);
  private refreshConnectorsBS = new BehaviorSubject<{
    documentRef: string;
    elementId: string;
    elementType: string;
    elementFragment: string;
    isClosing: boolean;
    isSaved: boolean;
  }>({
    documentRef: null,
    elementId: null,
    elementType: null,
    elementFragment: null,
    isClosing: false,
    isSaved: false,
  });
  private refreshViewBS = new BehaviorSubject<DocumentViewResponse>(null);
  private documentRefAndCategoryBS =
    new BehaviorSubject<DocumentRefAndCategory | null>(null);
  private updatedContentToSaveAfterReplace: string = null;
  private isDocumentLoadedBS = new BehaviorSubject<boolean>(false);
  private searchResultsCounterBS = new BehaviorSubject<number>(0);
  private isClonedProposalBS = new BehaviorSubject<boolean>(false);
  private isEditorOpenBS = new BehaviorSubject<boolean>(false);
  private getElementContentBS = new BehaviorSubject<{
    elementId: string;
    elementType: string;
  }>({ elementId: null, elementType: null });
  private updateElementContentBS = new BehaviorSubject<{
    documentRef: string;
    elementId: string;
    elementType: string;
    elementFragment: string;
    isClosing: boolean;
    isSaved: boolean;
  }>({
    documentRef: null,
    elementId: null,
    elementType: null,
    elementFragment: null,
    isClosing: false,
    isSaved: false,
  });

  private trackChangesStatusBS = new BehaviorSubject<{
    isTrackChangesEnabled: boolean;
    isTrackChangesShowed: boolean;
  }>({ isTrackChangesEnabled: false, isTrackChangesShowed: false });

  private getAnnotations?: () => Promise<string>;
  private refreshAnnotateCall?: () => void;
  private currentDocumentRef: string;
  private currentConfig: DocumentConfig;

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
    private appConfig: AppConfigService,
    private growlService: EuiGrowlService,
    private translate: TranslateService,
    private coEditionService: CoEditionServiceWS,
    private loadingService: LoadingService,
    private tocService: TableOfContentService,
    private envService: EnvironmentService,
  ) {
    this.trackChangesStatus$ = this.trackChangesStatusBS.asObservable();
    this.isClonedProposal$ = this.isClonedProposalBS.asObservable();
    this.didDocumentLoadAndRender$ = this.isDocumentLoadedBS.asObservable();
    this.pageTitle$ = this.documentPageTitleBS.asObservable();
    this.documentRefAndCategory$ = this.documentRefAndCategoryBS
      .asObservable()
      .pipe(filter(Boolean));

    this.documentRefAndCategory$
      .pipe(
        filter(Boolean),
        tap((res) => {
          this.tocService.reload();
          this.getRecentChanges(res.category, res.ref, 0, 1);
          this.countDocumentVersionsData(res.category, res.ref);
          this.getDocumentConfig(res.ref, res.category);
        }),
        switchMap((option) =>
          this.getDocumentByRef(option.ref, option.category),
        ),
        tap((view) => this.documentViewBS.next(view)),
      )
      .subscribe();

    this.searchPaneOpen$ = this.searchPaneOpenBS.asObservable();
    this.documentConfig$ = this.documentConfigBS
      .asObservable()
      .pipe(filter(Boolean));
    this.recentChanges$ = this.recentChangesBS.asObservable();
    this.totalNumVersion$ = this.totalNumVersionBS.asObservable();
    this.versionLatest$ = this.versionLatestBS
      .asObservable()
      .pipe(filter(Boolean));
    this.versionFilter$ = this.versionFilterBS.asObservable();
    this.searchParams$ = this.searchParamsBS.pipe(
      distinctUntilChanged(DocumentService.searchStateComparator),
    );
    this.versionSearchParams$ = this.versionSearchParamsBS.asObservable();
    this.updateVersionsData();

    this.documentConfig$.subscribe((config) => {
      this.annexDocNumber =
        config.documentsMetadata
          .filter((d) => d.category === 'ANNEX')
          .findIndex((d) => d.ref === this.documentRef) + 1;
    });

    this.versionSearchOpen$ = this.versionSearchOpenBS.asObservable();

    this.searchPaneOpen$
      .pipe(filter((x) => !x))
      .subscribe(() => this.setSearchParams({ searchText: '' }));

    this.searchParams$
      .pipe(skip(2), debounceTime(500))
      .subscribe((params) => this.doSearch(params));

    this.versionSearchOpen$
      .pipe(filter((x) => !x))
      .subscribe(() => this.setVersionSearchParams({ author: '' }));

    this.versionLatest$.subscribe((version) => {
      if (version)
        this.setPageSubTitle(
          this.formatVersionNumber(version),
          version.createdBy,
          version.updatedDate,
          null,
          null,
        );
    });

    this.documentView$ = this.documentViewBS.asObservable();

    this.documentView$.pipe(filter(Boolean)).subscribe((documentView) => {
      this.setPageSubTitle(
        documentView.versionInfoVO.documentVersion,
        `${documentView.versionInfoVO.lastModifiedBy} (${documentView.versionInfoVO.entity})`,
        documentView.versionInfoVO.lastModificationInstant,
        documentView.versionInfoVO.baseVersionTitle,
        documentView.versionInfoVO.revisedBaseVersion,
      );
    });

    this.resetZoom$ = this.resetZoomBS.asObservable();

    this.collaborators$ = this.collaboratorsBS.asObservable();
    this.documentView$
      .pipe(
        filter(Boolean),
        mergeMap((doc) => this.getCollaborators(doc.proposalRef)),
      )
      .subscribe((collaborators) => this.collaboratorsBS.next(collaborators));
    this.permissions$ = this.permissionsBS.asObservable();
    this.userRoles$ = this.userRolesBS.asObservable();
    this.collaborators$
      .pipe(combineLatestWith(this.appConfig.config))
      .subscribe(([collaborators, config]) => {
        const roles = this.resolveRoles(collaborators, config);
        this.userRolesBS.next(roles);
        const permissions = this.resolvePermissions(collaborators, config);
        this.permissionsBS.next(permissions);
      });

    this.setVersionFilter('all');

    this.navigationSidebarCollapsed$ =
      this.navigationSidebarCollapsedBS.asObservable();
    this.userGuidanceVisible$ = this.userGuidanceVisibleBS.asObservable();
    this.reloadTrigger$ = this.reloadTriggerBS.asObservable();
    this.refreshConnectors$ = this.refreshConnectorsBS.asObservable();
    this.refreshView$ = this.refreshViewBS.asObservable();

    this.versionSearchResults$ = this.versionSearchParams$.pipe(
      filter(Boolean),
      switchMap((searchParams) =>
        this.searchVersion(
          this.documentType,
          this.documentRef,
          searchParams.type,
          searchParams.author,
        ),
      ),
      shareReplay(1),
    );
    this.searchResultsCounter$ = this.searchResultsCounterBS.asObservable();
    this.isEditorOpen$ = this.isEditorOpenBS.asObservable();
    this.getElementContent$ = this.getElementContentBS.asObservable();
    this.updateElementContent$ = this.updateElementContentBS.asObservable();
  }

  clearDocumentState() {
    this.documentPageTitleBS.next(null);
    this.documentConfigBS.next(null);
    this.isDocumentLoadedBS.next(false);
    this.documentViewBS.next(null);
    this.refreshConnectorsBS.next(null);
    this.updateElementContentBS.next(null);
    this.getElementContentBS.next(null);
    this.getAnnotations = null;
    this.setAnnotationMode = null;
  }

  updateTrackChangesStatus(status: {
    isTrackChangesEnabled: boolean;
    isTrackChangesShowed: boolean;
  }) {
    if (this.currentConfig) {
      this.currentConfig.trackChangesShowed = status.isTrackChangesShowed;
    }
    this.trackChangesStatusBS.next(status);
    this.tocService.setIsTrackChangesEnabled(status.isTrackChangesEnabled);
  }

  isCNInstance() {
    return this.envService.isCouncil();
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

  toggleTrackChangesEnabled(trackChangedEnabled) {
    const documentRef = this.documentRef;
    const documentType = this.documentType;
    return this.http
      .post(
        `${apiBaseUrl}/secured/${documentType}/${documentRef}/toggle-trackchange-enabled`,
        {
          trackChangedEnabled,
        },
      )
      .subscribe((resp) => this.getDocumentConfig(documentRef, documentType));
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
          this.growlService.growl({
            severity: 'success',
            detail: this.translate.instant(
              'page.editor.export-econsilium-success',
            ),
          });
        },
        error: () => {
          this.growlService.growl({
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
    this.loadingService.setTaskOngoing('refresh', ref);
    return this.http.get<DocumentViewResponse>(
      `${apiBaseUrl}/secured/${category}/${ref}`,
    );
  }

  getDocumentForUser(ref: string, user: string) {
    return this.http.get(`${apiBaseUrl}/secured/search/${user}/${ref}`);
  }

  getIntermediateVersions(version: Version, pageIndex, pageSize) {
    return this.getIntermediateDocumentVersionsData(
      this.documentType,
      this.documentRef,
      version,
      pageIndex,
      pageSize,
    );
  }

  countIntermediateVersions(version: Version) {
    return this.countIntermediateDocumentVersionsData(
      this.documentType,
      this.documentRef,
      version,
    );
  }

  getRecentChanges(documentType, documentRef, pageIndex, pageSize) {
    this.getDocumentRecentChangesData(
      documentType,
      documentRef,
      pageIndex,
      pageSize,
    ).subscribe((versions) => {
      this.recentChangesBS.next(versions);
      this.versionLatestBS.next(versions[0]);
    });
  }

  countRecentChanges() {
    return this.countDocumentRecentChangesData(
      this.documentType,
      this.documentRef,
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

  reloadView() {
    this.getRecentChanges(this.documentType, this.documentRef, 0, 1);
    this.countDocumentVersionsData(this.documentType, this.documentRef);
    this.setSearchResultsCounter(0);
  }

  resetDocument() {
    this.reloadTriggerBS.next(this.reloadTriggerBS.value + 1);
  }

  reloadConnectors(
    data: {
      elementId: string;
      elementType: string;
      elementFragment: string;
    },
    isClosing = false,
    isSaved = false,
  ) {
    this.refreshConnectorsBS.next({
      documentRef: this.documentRef,
      elementId: data.elementId,
      elementType: data.elementType,
      elementFragment: data.elementFragment,
      isClosing,
      isSaved,
    });
  }

  refreshView(data: DocumentViewResponse) {
    this.refreshViewBS.next(data);
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
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Set the content type as JSON
    });
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
          tempUpdatedContentXML: this.updatedContentToSaveAfterReplace ?? null,
        },
        {
          headers,
          responseType: 'text' as any,
        },
      )
      .subscribe((res) => {
        console.log(res);
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
          tempUpdatedContentXML: this.updatedContentToSaveAfterReplace ?? null,
        },
        { responseType: 'text' as 'json' },
      )
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
          updatedContent: this.updatedContentToSaveAfterReplace ?? null,
        },
        { responseType: 'text' as 'json' },
      )
      .subscribe(() => {
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
    this.updatedContentToSaveAfterReplace = null;
    this.replacedTextPresent = false;
  }

  toggleNavigationSidebar(expanded = this.navigationSidebarCollapsedBS.value) {
    this.navigationSidebarCollapsedBS.next(!expanded);
  }

  seeUserGuidance() {
    this.userGuidanceVisibleBS.next(!this.userGuidanceVisibleBS.value);
  }

  resetUserGuidance() {
    this.userGuidanceVisibleBS.next(false);
  }

  requestUserGuidance() {
    const documentType =
      this.documentType === 'coverpage' ? 'coverPage' : this.documentType;
    const documentRef = this.documentRef;
    return this.http.get<string | null>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/userGuidance`,
    );
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
          capital: capital ?? false,
        },
      },
    );
  }

  updateElementContent(data: {
    documentRef: string;
    elementId: string;
    elementType: string;
    elementFragment: string;
    isClosing: boolean;
    isSaved: boolean;
  }) {
    this.updateElementContentBS.next(data);
  }

  getElementContent(elementId: string, elementTagName: string) {
    this.getElementContentBS.next({
      elementId,
      elementType: elementTagName,
    });
    return this.getElementContentResponse$;
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
    // this.compares.next(versions);
  }

  setVersionFilter(filterValue: string) {
    this.versionFilterBS.next(filterValue);
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
    this.updatedContentToSaveAfterReplace = null;
  }

  toggleVersionsSearchPane(open?: boolean) {
    this.toggleSubject(this.versionSearchOpenBS, open);
  }

  versionRevert(versionNumber: string) {
    this.loadingService.setLoading(true);
    this.http
      .get(
        `${apiBaseUrl}/secured/${this.documentType}/${this.documentRef}/restore/${versionNumber}`,
      )
      .pipe(finalize(() => this.loadingService.setLoading(false)))
      .subscribe(() => {
        this.setDocumentRefAndCategory(this.documentRef, this.documentType);
      });
  }

  // versionView(versionNumber: string) {
  //   this.versionIdBS.next(versionNumber);
  // }

  resetZoomValues() {
    this.resetZoomBS.next(null);
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

  changeBaseVersion(version: Version) {
    const versionId = version.documentId;
    const baseVersionTitle = version.checkinCommentVO.title;
    const { major, intermediate, minor } = version.versionNumber;
    const versionNumber = `${major}.${intermediate}.${minor}`;
    this.loadingService.setLoading(true);
    this.http
      .get(
        `${apiBaseUrl}/secured/document/${this.documentType}/${this.documentRef}/baseVersion/${versionId}`,
        {
          params: {
            versionLabel: versionNumber,
            versionComment: baseVersionTitle,
          },
        },
      )
      .pipe(finalize(() => this.loadingService.setLoading(false)))
      .subscribe(() => {
        this.setDocumentRefAndCategory(this.documentRef, this.documentType);
      });
  }

  get documentRef() {
    return this.documentRefAndCategoryBS.value.ref;
  }

  getVersionSearchResultsIsEmpty() {
    return this.versionSearchResultsIsEmpty;
  }

  setVersionSearchResultsIsEmpty(value: boolean) {
    this.versionSearchResultsIsEmpty = value;
  }

  countDocumentVersionsData(documentType: string, documentRef: string) {
    documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
    return this.http
      .get<number>(
        `${apiBaseUrl}/secured/${documentType}/${documentRef}/count-version-data`,
      )
      .subscribe((count) => this.totalNumVersionBS.next(count));
  }

  updateVersionsData() {
    const self = this;
    this.versions$ = this.documentRefAndCategory$.pipe(
      filter(Boolean),
      switchMap((option) =>
        this.getDocumentVersionsData(
          option.category,
          option.ref,
          0,
          self.pageSize,
        ),
      ),
      shareReplay(1),
    );
  }

  getDocumentVersionsData(
    documentType: string,
    documentRef: string,
    pageIndex: number,
    pageSize: number,
  ) {
    documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
    return this.http.get<Version[]>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/version-data?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    );
  }

  getIntermediateDocumentVersionsData(
    documentType: string,
    documentRef: string,
    version: Version,
    pageIndex,
    pageSize,
  ) {
    documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
    return this.http.get<Version[]>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/intermediate-version-data?currIntVersion=${version.cmisVersionNumber}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    );
  }

  countIntermediateDocumentVersionsData(
    documentType: string,
    documentRef: string,
    version: Version,
  ) {
    documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
    return this.http.get<number>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/count-intermediate-version-data?currIntVersion=${version.cmisVersionNumber}`,
    );
  }

  getDocumentRecentChangesData(
    documentType: string,
    documentRef: string,
    pageIndex,
    pageSize,
  ) {
    documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
    return this.http
      .get<Version[]>(
        `${apiBaseUrl}/secured/${documentType}/${documentRef}/recent-changes?pageIndex=${pageIndex}&pageSize=${pageSize}`,
      )
      .pipe(take(1));
  }

  countDocumentRecentChangesData(documentType: string, documentRef: string) {
    documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
    return this.http
      .get<number>(
        `${apiBaseUrl}/secured/${documentType}/${documentRef}/count-recent-changes`,
      )
      .pipe(take(1));
  }

  searchVersion(
    documentType: string,
    documentRef: string,
    versionType: string,
    authorKey: string,
  ) {
    documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
    const vType =
      versionType === 'milestone'
        ? 'MAJOR'
        : versionType === 'save'
        ? 'INTERMEDIATE'
        : '';
    if (this.versionSearchOpenBS.getValue()) {
      this.loadingService.setLoading(true);
      return this.http
        .get<Version[]>(
          `${apiBaseUrl}/secured/${documentType}/${documentRef}/search-versions?authorKey=${authorKey}&type=${vType}`,
        )
        .pipe(finalize(() => this.loadingService.setLoading(false)));
    } else {
      return new Observable<Version[]>((observer) => {
        observer.next([]);
        observer.complete();
      });
    }
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

  renumberDocument() {
    const documentType =
      this.documentType === 'coverpage' ? 'coverPage' : this.documentType;
    const documentRef = this.documentRef;
    this.http
      .put<DocumentViewResponse>(
        `${apiBaseUrl}/secured/${documentType}/${documentRef}/renumber-document`,
        {},
      )
      .subscribe(() => {
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

  setRefreshAnnotateCall(setRefreshAnnotateCall: () => void) {
    this.refreshAnnotateCall = setRefreshAnnotateCall;
  }

  refreshAnnotate() {
    //Core #1705: Check if refreshAnnotateCall is defined before calling it
    if (typeof this.refreshAnnotateCall === 'function') {
      this.refreshAnnotateCall();
    }
  }

  setDidDocumentLoadAndRender(loaded: boolean) {
    this.isDocumentLoadedBS.next(loaded);
  }

  setIsClonedProposal(cloned: boolean) {
    this.isClonedProposalBS.next(cloned);
    this.tocService.setIsClonedProposal(cloned);
  }

  getUserPermissions() {
    return this.permissionsBS.value;
  }

  getUserRoles() {
    return this.userRolesBS.value;
  }

  updateTitle(newTitle: string): void {
    this.documentPageTitleBS.next(cleanDelInsert(newTitle));
  }

  setIsEditorOpen(val: boolean) {
    this.isEditorOpenBS.next(val);
  }

  findNextElementOfTheSameTypeInDocument(
    prevElementId: string,
    elementType: string,
  ) {
    const foundElement = document.getElementById(prevElementId);

    let nextSibling = foundElement?.nextElementSibling;
    if (nextSibling && nextSibling.tagName.toLowerCase() === elementType) {
      return nextSibling.getAttribute('id');
    } else if (nextSibling && nextSibling.tagName.toLowerCase() === 'list') {
      nextSibling = nextSibling.firstElementChild;
      return nextSibling?.getAttribute('id');
    } else if (nextSibling) {
      const secondLevelSibling = nextSibling.nextElementSibling;
      if (
        secondLevelSibling &&
        secondLevelSibling.tagName.toLowerCase() === elementType
      ) {
        return secondLevelSibling.getAttribute('id');
      }
    } else {
      nextSibling = foundElement?.parentElement?.nextElementSibling;
      if (nextSibling && nextSibling.tagName.toLowerCase() === elementType) {
        return nextSibling.getAttribute('id');
      }
    }
    return null;
  }

  toggleUserGuidanceOff() {
    this.userGuidanceVisibleBS.next(false);
  }

  private setSearchResultsCounter(count: number) {
    this.searchResultsCounterBS.next(count);
  }

  private getDocumentConfig(documentRef: string, documentType: string) {
    documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
    return this.http
      .get<DocumentConfig>(
        `${apiBaseUrl}/secured/${documentType}/${documentRef}/document-config`,
      )
      .subscribe((config) => {
        if (documentRef === this.currentDocumentRef && this.currentConfig) {
          config.trackChangesShowed = this.currentConfig.trackChangesShowed;
        }
        this.currentDocumentRef = documentRef;
        this.currentConfig = config;
        this.documentConfigBS.next(config);
      });
  }

  private doSearch(parameters: DocumentSearchParams) {
    if (parameters.searchText !== '') {
      this.currentSearchResults = [];
      this.http
        .post<SearchMatchVO[]>(
          `${apiBaseUrl}/secured/${this.documentType}/${this.documentRef}/search-text`,
          this.updatedContentToSaveAfterReplace ?? '',
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

  /** The document type for use in `/secured/{documentType}` API endpoints. */
  get documentType() {
    return this.documentRefAndCategoryBS.value.category === 'coverpage'
      ? 'coverPage'
      : this.documentRefAndCategoryBS.value.category;
  }

  private getCollaborators(proposalRef: string) {
    if (!proposalRef) return of([]);
    return this.http.get<Collaborator[]>(
      `${apiBaseUrl}/secured/proposal/${proposalRef}/collaborators`,
    );
  }

  private retrieveAuthority(collaborators: Collaborator[], config: LeosAppConfig) {
    /** Normal user collaborator - has preference over entity collaborators **/
    const userCollaborators = collaborators
      .filter((c) => c.login === config.user.login);
    for (const collaborator of userCollaborators) {
      const collaboratorRootEntity = collaborator.entity.name.split("\\.", 2);
      for (const entity of config.user.entities) {
        const userRootEntity = entity.name.split("\\.", 2);
        if (userRootEntity[0] === collaboratorRootEntity[0]) {
          return [collaborator.role];
        }
      }
    }
    /** Entity collaborators **/
    const entityCollaborators = collaborators
      .filter((c) => c.login === c.entity.name)
      .sort((c1, c2) => {
        const c1l = c1.entity.name.split(".").length - 1,
          c2l = c2.entity.name.split(".").length - 1;
        return (c2l < c1l) ? -1 : ((c1l === c2l) ? 0 : 1); // Reverse order
      });
    for (const collaborator of entityCollaborators) {
      for (const entity of config.user.entities) {
        if (entity.name.concat(".").startsWith(collaborator.entity.name.concat("."))) {
          return [collaborator.role];
        }
      }
    }
    return [];
  }

  private resolveRoles(collaborators: Collaborator[], config: LeosAppConfig) {
    const docRoles = this.retrieveAuthority(collaborators, config);
    return [...config.user.roles, ...docRoles, config.contextRole].filter(
      Boolean,
    );
  }

  private resolvePermissions(
    collaborators: Collaborator[],
    config: LeosAppConfig,
  ) {
    const docRoles = this.retrieveAuthority(collaborators, config);
    const roles = [...config.user.roles, ...docRoles, config.contextRole];
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
          this.growlService.growl({
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
        node.childNodes.forEach((n) => this.getNodeTextOnlyLength(n));
      }
    }
  }

  private getVersionReferenceString(v: Version): string {
    return v
      ? `${v.versionNumber.major}.${v.versionNumber.intermediate}.${v.versionNumber.minor}`
      : null;
  }

  private setPageSubTitle(
    documentVersion,
    updatedBy,
    updatedDate,
    baseVersionTitle,
    revisedBaseVersion,
  ) {
    if (this.isCNInstance() && BASE_EC_VERSION !== revisedBaseVersion) {
      this.translate
        .get('page.editor.base.revision.toolbar.info', {
          version: documentVersion,
          updatedByFull: updatedBy,
          updatedOn: updatedDate,
          baseVersionTitle,
          revisedBaseVersion,
        })
        .pipe(take(1))
        .subscribe((subTitle: string) => {
          this.documentPageTitleBS.next(cleanDelInsert(subTitle));
        });
    } else {
      this.translate
        .get('page.editor.subtitle', {
          version: documentVersion,
          updatedByFull: updatedBy,
          updatedOn: updatedDate,
        })
        .pipe(take(1))
        .subscribe((subTitle: string) => {
          this.documentPageTitleBS.next(cleanDelInsert(subTitle));
        });
    }
  }

  private formatVersionNumber(version: Version): string {
    const { major, intermediate, minor } = version.versionNumber;
    return `${major}.${intermediate}.${minor}`;
  }
}
