import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { UxAppShellService } from '@eui/core';
import { TranslateService } from '@ngx-translate/core';
import { parse as parseContentDisposition } from 'content-disposition-attachment';
import {
  BehaviorSubject,
  combineLatestWith,
  distinctUntilChanged,
  filter,
  finalize,
  mergeMap,
  Observable,
  of,
  skip,
  Subject,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';

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
import { VersionSearchParams } from '@/shared/models/versionSearch';
import { downloadBlob } from '@/shared/utils';

import { apiBaseUrl } from '../../../config';
import { DocumentViewResponse } from '../models/document-view-response.model';
import { NodeValidationResponse } from '../models/drop-response.model';
import { SearchMatchVO } from '../models/search.model';
import { TableOfContentItemVO, TocItem } from '../models/toc.model';
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
};

export type DownloadEConsiliumOptions = Omit<
  DownloadEConsiliumParams,
  'annotations'
>;

@Injectable({
  providedIn: 'root',
})
export class DocumentService implements OnDestroy {
  documentCategory$: Observable<string | null>;
  annotationsEnabled$: Observable<boolean>;
  compareModeEnabled$: Observable<boolean>;
  documentId$: Observable<string | null>;
  documentView$: Observable<DocumentViewResponse | null>;
  versionView$: Observable<DocumentViewResponse | null>;
  versionCompareView$: Observable<string | null>;
  guidelinesEnabled$: Observable<boolean>;
  highlightsEnabled$: Observable<boolean>;
  searchPaneOpen$: Observable<boolean>;
  searchParams$: Observable<DocumentSearchParams>;
  versions$: Observable<Version[]>;
  versionSearchOpen$: Observable<boolean>;
  toc$: Observable<TableOfContentItemVO[]>;
  recentChanges$: Observable<Version[]>;
  documentConfig$: Observable<DocumentConfig>;
  versionId$: Observable<string | null>;
  versionCompareIds$: Observable<any | null>;
  searchResultIndexArray: any[];
  focusedSearchResult: any | null;
  currentSearchResults: Array<SearchMatchVO>;
  versionSearchParams$: Observable<VersionSearchParams>;
  versionFilter$: Observable<string>;
  documentReplaceView$: Observable<DocumentViewResponse | null>;
  collaborators$: Observable<Collaborator[]>;
  permissions$: Observable<Permission[]>;
  navigationPaneCollapse$: Observable<boolean>;
  userGuidanceVisible$: Observable<boolean>;
  reloadTrigger$: Observable<number>;

  currentIndex: number;
  setAnnotationMode?: (mode: AnnotateOperationMode) => void;

  private documentCategoryBS = new BehaviorSubject(null);
  private tocItemBS = new BehaviorSubject<TableOfContentItemVO[]>(null);
  private annotationsEnabledBS = new BehaviorSubject(true);
  private compareModeEnabledBS = new BehaviorSubject(false);
  private documentIdBS = new BehaviorSubject<string | null>(null);
  private guidelinesEnabledBS = new BehaviorSubject(true);
  private highlightsEnabledBS = new BehaviorSubject(true);
  private searchPaneOpenBS = new BehaviorSubject(false);
  private searchParamsBS = new BehaviorSubject({
    searchText: '',
    wholeWords: false,
    matchCase: false,
  });
  private versionSearchOpenBS = new BehaviorSubject(false);
  private versionIdBS = new BehaviorSubject<string | null>(null);
  private versionCompareIdsBS = new BehaviorSubject<any | null>(null);
  private versionSearchParamsBS = new BehaviorSubject({
    type: 'all',
    author: '',
  });
  private versionFilterBS = new BehaviorSubject<string>('All');
  private searchAndReplaceTextBS = new BehaviorSubject<string>('');
  private documentReplaceVieBS =
    new BehaviorSubject<DocumentViewResponse | null>(null);
  private collaboratorsBS = new BehaviorSubject<Collaborator[]>([]);
  private permissionsBS = new BehaviorSubject<Permission[]>([]);
  private navigationPaneCollapseBS = new BehaviorSubject<boolean>(true);
  private userGuidanceVisibleBS = new BehaviorSubject<boolean>(false);
  private reloadTriggerBS = new BehaviorSubject<number>(0);

  private updatedContentToSaveAfterReplace: string = null;
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
    this.documentId$ = this.documentIdBS.asObservable();
    const documentRefNotNull$ = this.documentId$.pipe(filter(Boolean));
    this.documentCategory$ = this.documentCategoryBS.asObservable();
    const documentCategoryNotNull$ = this.documentCategory$.pipe(
      filter(Boolean),
    );

    this.documentView$ = documentRefNotNull$.pipe(
      combineLatestWith(documentCategoryNotNull$),
      switchMap(([ref, category]) => this.getDocumentByRef(ref, category)),
    );
    // this.documentView$ = this.documentReplaceView$.pipe();

    this.annotationsEnabled$ = this.annotationsEnabledBS.asObservable();
    this.compareModeEnabled$ = this.compareModeEnabledBS.asObservable();
    this.guidelinesEnabled$ = this.guidelinesEnabledBS.asObservable();
    this.highlightsEnabled$ = this.highlightsEnabledBS.asObservable();
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
    this.versions$ = documentRefNotNull$.pipe(
      combineLatestWith(documentCategoryNotNull$),
      mergeMap(([ref, category]) =>
        this.getDocumentVersionsData(category, ref),
      ),
    );

    this.documentConfig$ = documentRefNotNull$.pipe(
      combineLatestWith(documentCategoryNotNull$),
      switchMap(([ref, category]) => this.getDocumentConfig(ref, category)),
    );

    this.recentChanges$ = documentRefNotNull$.pipe(
      combineLatestWith(documentCategoryNotNull$),
      mergeMap(([ref, category]) =>
        this.getDocumentRecentChangesData(category, ref),
      ),
    );

    this.toc$ = documentRefNotNull$.pipe(switchMap((ref) => this.getToc(ref)));

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
      combineLatestWith(this.documentCategory$),
      mergeMap(([versionId, category]) =>
        this.getDocumentVersion(category, versionId),
      ),
    );

    this.versionCompareView$ = this.versionCompareIds$.pipe(
      skip(1),
      takeUntil(this.destroy$),
      combineLatestWith(this.documentCategory$),
      mergeMap(([versionCompareIds, category]) =>
        this.getDocumentVersionsComparison(versionCompareIds, category),
      ),
    );

    this.versionSearchParams$
      .pipe(takeUntil(this.destroy$), skip(1))
      .subscribe((params) => this.handleVersionSearch(params));

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
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.getAnnotations = null;
    this.setAnnotationMode = null;
  }

  createNote() {
    console.warn('stub:', 'createNote'); // FIXME
  }

  async download(withAnnotations = false) {
    const documentType = this.documentType.toUpperCase();
    const documentRef = this.documentIdBS.value;

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
    const documentRef = this.documentIdBS.value;

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
    const documentRef = this.documentIdBS.value;

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
    return this.http
      .get<DocumentViewResponse>(`${apiBaseUrl}/secured/${category}/${ref}`)
      .pipe(take(1));
  }

  reloadDocument() {
    this.coEditionService.setShouldReloadAfterUpdate();
    this.setDocumentId(this.documentIdBS.value);
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
      });
    if (
      currentIndex >= 0 &&
      currentIndex < this.searchResultIndexArray.length
    ) {
      this.document.getElementById(this.focusedSearchResult.id).innerText =
        this.searchAndReplaceTextBS.value;
      if (currentIndex < this.searchResultIndexArray.length - 1) {
        this.scrollToElement(this.searchResultIndexArray[currentIndex + 1]);
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
      });
    this.searchResultIndexArray.forEach((el, i) => {
      this.document.getElementById(el.id).innerText =
        this.searchAndReplaceTextBS.value;
      if (i < this.searchResultIndexArray.length - 1) {
        this.scrollToElement(this.searchResultIndexArray[i + 1]);
      }
    });
  }

  searchSave() {
    this.removeHighlights();
    const updatedContent =
      this.document.getElementById('docContainer').childNodes[0];

    const xmlSerializer = new XMLSerializer();
    let xmlContent = xmlSerializer.serializeToString(updatedContent);
    xmlContent = xmlContent.replaceAll('id', 'xml:id');
    const documentRef = this.documentIdBS.value;

    this.http
      .put<DocumentViewResponse>(
        `${apiBaseUrl}/secured/${this.documentType}/${documentRef}/save-after-replace`,
        {
          documentRef,
          updatedContent: this.updatedContentToSaveAfterReplace,
        },
      )
      .subscribe((updateResult) => {
        this.setDocumentId(this.documentRef);
      });
  }

  searchSaveAndClose() {
    this.searchSave();
    this.toggleSearchPane(false);
  }

  searchCancelAndClose() {
    this.toggleSearchPane(false);
    this.reloadTriggerBS.next(this.reloadTriggerBS.value + 1);
  }

  seeNavigation() {
    this.navigationPaneCollapseBS.next(!this.navigationPaneCollapseBS.value);
  }

  seeUserGuidance() {
    this.userGuidanceVisibleBS.next(!this.userGuidanceVisibleBS.value);

    if (this.userGuidanceVisibleBS.value) {
      let documentType = this.documentCategoryBS.value;
      documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
      const documentRef = this.documentIdBS.value;
      return this.http.get<string | null>(
        `${apiBaseUrl}/secured/${documentType}/${documentRef}/userGuidance`,
      );
    } else {
      return of(null);
    }
  }

  setDocumentId(id: string) {
    this.documentIdBS.next(id);
  }

  setDocumentCategory(category: string) {
    this.documentCategoryBS.next(category);
  }

  setSearchParams(values: Partial<DocumentSearchParams>) {
    if (values.searchText === '') {
      this.currentSearchResults = [];
      this.currentIndex = 0;
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

  setVersionIdsForCompare(versionIdsToCompare: any) {
    this.versionCompareIdsBS.next(versionIdsToCompare);
  }

  getVersionsIdsArray() {
    return this.versionCompareIdsBS.value;
  }

  setVersionFilter(filterValue: string) {
    this.versionFilterBS.next(filterValue);
  }

  toggleAnnotations(enabled?: boolean) {
    this.toggleSubject(this.annotationsEnabledBS, enabled);
  }

  toggleCompareMode(enabled?: boolean) {
    this.toggleSubject(this.compareModeEnabledBS, enabled);
    this.compareModeEnabledBS.pipe(take(1)).subscribe((e) => {
      if (!e) this.setVersionIdsForCompare([]);
    });
  }

  toggleGuidelines(enabled?: boolean) {
    this.toggleSubject(this.guidelinesEnabledBS, enabled);
  }

  toggleHighlights(enabled?: boolean) {
    this.toggleSubject(this.highlightsEnabledBS, enabled);
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
    this.setDocumentId(this.documentIdBS.value);
  }

  toggleVersionsSearchPane(open?: boolean) {
    this.toggleSubject(this.versionSearchOpenBS, open);
  }

  versionRevert(versionNumber: string) {
    const documentCategory = this.documentCategoryBS.value;
    const documentRef = this.documentIdBS.value;
    this.http
      .get(
        `${apiBaseUrl}/secured/${documentCategory}/${documentRef}/restore/${versionNumber}`,
      )
      .subscribe((r) => {
        this.setDocumentId(documentRef);
      });
  }

  versionView(versionNumber: string) {
    this.versionIdBS.next(versionNumber);
  }

  versionExport(version: Version) {
    const documentType = this.documentType;
    const documentRef = this.documentIdBS.value;
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

  getToc(
    annexRef: string,
    tocMode = process.env.NG_APP_LEOS_INSTANCE === 'cn'
      ? 'NOT_SIMPLIFIED'
      : 'SIMPLIFIED',
  ) {
    let category = this.documentCategoryBS.value;
    category = category === 'coverpage' ? 'coverPage' : category;

    return this.http.get<TableOfContentItemVO[]>(
      `${apiBaseUrl}/secured/${category}/${annexRef}/getToc`,
      {
        params: { tocMode },
      },
    );
  }

  getTocItems(
    annexRef: string,
    tocMode = process.env.NG_APP_LEOS_INSTANCE === 'cn'
      ? 'NOT_SIMPLIFIED'
      : 'SIMPLIFIED',
  ) {
    let category = this.documentCategoryBS.value;
    category = category === 'coverpage' ? 'coverPage' : category;
    return this.http.get<TocItem[]>(
      `${apiBaseUrl}/secured/${category}/${annexRef}/getTocItems`,
      {
        params: { tocMode },
      },
    );
  }

  saveToc(documentRef: string, toc: TableOfContentItemVO[]) {
    let category = this.documentCategoryBS.value;
    category = category === 'coverpage' ? 'coverPage' : category;
    this.loadingService.setLoading(true);
    return this.http
      .post<TableOfContentItemVO[]>(
        `${apiBaseUrl}/secured/${category}/${documentRef}/save-toc`,
        {
          tableOfContentItemVOs: toc,
        },
      )
      .pipe(finalize(() => this.loadingService.setLoading(false)));
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
    return this.documentIdBS.value;
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

  getDocumentVersionsComparison(versionArray?: any, documentType?: string) {
    if (versionArray?.newVersion && versionArray?.oldVersion && documentType) {
      documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
      return this.http.get<string>(
        `${apiBaseUrl}/secured/${documentType}/${versionArray.newVersion}/compare/${versionArray.oldVersion}`,
        { responseType: 'text' as 'json' },
      );
    } else {
      return of('');
    }
  }

  renumberDocument() {
    let documentType = this.documentCategoryBS.value;
    documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
    const documentRef = this.documentIdBS.value;
    this.http
      .put<DocumentViewResponse>(
        `${apiBaseUrl}/secured/${documentType}/${documentRef}/renumber-document`,
        {},
      )
      .subscribe((response) => {
        this.documentIdBS.next(documentRef);
      });
  }

  switchDocumentStructure() {
    let documentType = this.documentCategoryBS.value;
    documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
    const documentRef = this.documentIdBS.value;
    this.http
      .get<DocumentViewResponse>(
        `${apiBaseUrl}/secured/${documentType}/${documentRef}/switch-annex-structure`,
      )
      .subscribe((response) => {
        this.documentIdBS.next(documentRef);
      });
  }

  setAnnotationGetter(getAnnotations: () => Promise<string>) {
    this.getAnnotations = getAnnotations;
  }

  setAnnotationsReadOnlySetter(
    setAnnotationsReadOnly: (mode: AnnotateOperationMode) => void,
  ) {
    this.setAnnotationMode = setAnnotationsReadOnly;
  }

  private getDocumentConfig(documentRef: string, documentType: string) {
    let category = this.documentCategoryBS.value;
    category = category === 'coverpage' ? 'coverPage' : category;
    return this.http.get<DocumentConfig>(
      `${apiBaseUrl}/secured/${category}/${documentRef}/document-config`,
    );
  }

  private doSearch(parameters: DocumentSearchParams) {
    if (parameters.searchText !== '') {
      const documentRef = this.documentIdBS.value;
      this.currentSearchResults = [];
      this.http
        .get<SearchMatchVO[]>(
          `${apiBaseUrl}/secured/${this.documentType}/${documentRef}/search-text`,
          {
            params: parameters,
          },
        )
        .subscribe((results) => {
          this.currentSearchResults = results;
          this.highlightSearchResults(results);
          this.scrollToElement(this.searchResultIndexArray[0]);
          this.currentIndex = 0;
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
        element.childNodes.forEach((i, j) => {
          previousElementTextLength = elementTextLength;
          if (i.nodeType !== 3) {
            //nodeType=3 represents a text node
            const currentTextLength = this.getNodeTextOnlyLength(i);
            elementTextLength += currentTextLength;
          } else {
            elementTextLength += i.textContent.length;
          }

          if (
            elementTextLength - res.matchedElements[0].matchStartIndex > -1 &&
            elementTextLength - res.matchedElements[0].matchEndIndex > -1 &&
            !foundSearchText
          ) {
            const range = document.createRange();
            const start =
              res.matchedElements[0].matchStartIndex -
              previousElementTextLength;
            range.setStart(i, start);
            const end =
              res.matchedElements[0].matchEndIndex - previousElementTextLength;
            range.setEnd(i, end);
            rangeArray.push(range);
            wrapperIdArray.push('result-' + index + '-' + j);
            this.searchResultIndexArray.push({
              id: 'result-' + index + '-' + j,
              resultArrayIndex: index,
            });
            foundSearchText = true;
          }
        });
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
  }

  private scrollToElement(searchObj: any) {
    this.focusedSearchResult = searchObj;

    const targetElement = document.getElementById(searchObj.id);
    if (targetElement) {
      this.currentIndex = this.searchResultIndexArray.indexOf(
        this.focusedSearchResult,
      );
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  private handleVersionSearch(params: VersionSearchParams) {
    this.removeVersionSearchHighlight();
    if (params.type !== 'all') {
      this.setVersionFilter(params.type);
    } else {
      this.setVersionFilter('all');
    }

    if (params.author !== '') {
      // TODO: this should be reimplemented the angular way
      this.document.querySelectorAll('.version-panes').forEach((element) => {
        this.handleNode(element, params.author);
      });
    } else {
    }
  }

  private handleNode(node: any, searchText: string) {
    if (node.childNodes.length > 0) {
      if (node.childNodes.length === 1) {
        if (node.innerText && node.innerText.search(searchText) !== -1) {
          const cardParentNode = this.findClosestParentByClass(
            node,
            'version-panes',
          );
          if (cardParentNode) {
            cardParentNode.classList.add('version-search-found');
          }
        }
      } else if (node.childNodes.length > 1) {
        node.childNodes.forEach((n) => {
          this.handleNode(n, searchText);
        });
      }
    }
  }

  private removeVersionSearchHighlight() {
    this.document
      .querySelectorAll('.version-search-found')
      .forEach((element) => {
        element.classList.remove('version-search-found');
      });
  }

  private findClosestParentByClass(node: any, searchByClass: string) {
    if (node.parentElement.classList.contains(searchByClass)) {
      return node.parentElement;
    } else {
      return this.findClosestParentByClass(node.parentElement, searchByClass);
    }
  }

  /** The document type for use in `/secured/{documentType}` API endpoints. */
  get documentType() {
    return this.documentCategoryBS.value === 'coverpage'
      ? 'coverPage'
      : this.documentCategoryBS.value;
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
    const permissions = roles.flatMap((r) => config.permissionMap[r]);
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
    this.appConfig.config.subscribe((config) => {
      const userEmail = config.user.email;
      this.translate
        .get('page.editor.export-email-sent', { userEmail })
        .subscribe((message) => {
          this.appShell.growl({
            severity: 'success',
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
}
