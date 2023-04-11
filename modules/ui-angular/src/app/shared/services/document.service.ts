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
  Collaborator,
  DocumentConfig,
  LeosAppConfig,
  Permission,
} from '@/shared';
import { VersionSearchParams } from '@/shared/models/versionSearch';

import { apiBaseUrl } from '../../../config';
import { DocumentViewResponse } from '../models/document-view-response.model';
import { NodeValidationResponse } from '../models/drop-response.model';
import { SearchMatchVO } from '../models/search.model';
import { TableOfContentItemVO, TocItem } from '../models/toc.model';
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
  tocItems$: Observable<any[]>;
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
  ) {
    this.documentId$ = this.documentIdBS.asObservable();
    this.documentCategory$ = this.documentCategoryBS.asObservable();
    this.tocItems$ = this.tocItemBS.asObservable();

    this.documentView$ = this.documentId$.pipe(
      filter(Boolean), // skip null values
      combineLatestWith(this.documentCategory$),
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
    this.versions$ = this.documentId$.pipe(
      combineLatestWith(this.documentCategory$),
      mergeMap(([ref, category]) =>
        this.getDocumentVersionsData(category, ref),
      ),
    );

    this.documentConfig$ = this.documentId$.pipe(
      combineLatestWith(this.documentCategory$),
      mergeMap(([ref, category]) => this.getDocumentConfig(ref, category)),
    );

    this.recentChanges$ = this.documentId$.pipe(
      combineLatestWith(this.documentCategory$),
      mergeMap(([ref, category]) =>
        this.getDocumentRecentChangesData(category, ref),
      ),
    );

    this.toc$ = this.documentId$.pipe(switchMap((ref) => this.getToc(ref)));

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
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.getAnnotations = null;
  }

  closeEditor() {
    console.warn('stub:', 'closeEditor'); // FIXME
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
      .post(
        `${apiBaseUrl}/secured/document/export-to-econsilium/${documentType}/${documentRef}`,
        {
          ...options,
          annotations,
        } as DownloadEConsiliumParams,
        {
          observe: 'response',
          responseType: 'blob',
        },
      )
      .subscribe((resp) => this.handleDownloadResponse(resp));
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
  }

  saveVersion(requestBody: any) {
    return this.saveDocumentVersionWithData(
      this.documentType,
      this.documentRef,
      requestBody,
    );
  }

  searchNext() {
    const currentIndex = this.searchResultIndexArray.indexOf(
      this.focusedSearchResult,
    );
    if (
      currentIndex >= 0 &&
      currentIndex < this.searchResultIndexArray.length - 1
    ) {
      this.scrollToElement(this.searchResultIndexArray[currentIndex + 1]);
    } else if (currentIndex === this.searchResultIndexArray.length - 1) {
      this.scrollToElement(this.searchResultIndexArray[0]);
    }
  }

  searchPrevious() {
    const currentIndex = this.searchResultIndexArray.indexOf(
      this.focusedSearchResult,
    );
    if (currentIndex !== 0) {
      this.scrollToElement(this.searchResultIndexArray[currentIndex - 1]);
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

  // setDocumentView(view: DocumentViewResponse) {
  //   console.log('elemState in setDocumentView:', view);
  //   this.documentViewBS.next(view);
  // }

  setDocumentId(id: string) {
    this.documentIdBS.next(id);
  }

  setDocumentCategory(category: string) {
    this.documentCategoryBS.next(category);
  }

  setSearchParams(values: Partial<DocumentSearchParams>) {
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

  versionExploreMilestone(versionNumber: string) {
    console.warn('stub:', 'versionExploreMilestone', versionNumber); // FIXME
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

  getToc(annexRef: string, tocMode = 'SIMPLIFIED') {
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
    return this.http.post<TableOfContentItemVO[]>(
      `${apiBaseUrl}/secured/${category}/${documentRef}/save-toc`,
      {
        tableOfContentItemVOs: toc,
      },
    );
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

  setToc(toc: TableOfContentItemVO[]) {
    this.tocItemBS.next(toc);
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

  getDocumentVersionsComparison(versionArray: any, documentType: string) {
    documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
    if (versionArray && versionArray.newVersion !== null) {
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

  private getDocumentConfig(documentRef: string, documentType: string) {
    return this.http.get<DocumentConfig>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/document-config`,
    );
  }

  setAnnotationGetter(getAnnotations: () => Promise<string>) {
    this.getAnnotations = getAnnotations;
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
    let multipleInstances = false;
    for (const [index, res] of resultArray.entries()) {
      if (multipleInstances) {
        multipleInstances = false;
        continue;
      }
      const element = document.getElementById(
        `${res.matchedElements[0].elementId}`,
      );
      if (element) {
        const elementText = element.childNodes[0];
        if (elementText) {
          const range = document.createRange();
          range.setStart(elementText, res.matchedElements[0].matchStartIndex);
          range.setEnd(elementText, res.matchedElements[0].matchEndIndex);

          if (
            resultArray[index + 1] &&
            resultArray[index + 1].matchedElements[0].elementId ===
              res.matchedElements[0].elementId
          ) {
            const nextOccurrence = resultArray[index + 1];
            const range2 = document.createRange();
            range2.setStart(elementText, nextOccurrence.matchStartIndex);
            range2.setEnd(elementText, nextOccurrence.matchEndIndex);
            const wrapper2 = document.createElement('span');
            const wrapperId2 = 'result-' + (index + 1);
            wrapper2.id = wrapperId2;
            this.searchResultIndexArray.push({
              id: wrapper2.id,
              resultArrayIndex: index + 1,
            });
            wrapper2.classList.add('search-result');
            range2.surroundContents(wrapper2);
            multipleInstances = true;
          }
          const wrapper = document.createElement('span');
          const wrapperId = 'result-' + index;
          wrapper.id = wrapperId;
          this.searchResultIndexArray.push({
            id: wrapper.id,
            resultArrayIndex: index,
          });
          wrapper.classList.add('search-result');
          range.surroundContents(wrapper);
        }
      }
    }
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

  get documentType() {
    return this.documentCategoryBS.value === 'coverpage'
      ? 'coverPage'
      : this.documentCategoryBS.value;
  }

  private getCollaborators(proposalRef: string) {
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
      this.downloadBlob(blob, filename);
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

  private downloadBlob(blob: Blob, filename: string) {
    const data = window.URL.createObjectURL(blob);

    const link = this.document.createElement('a');
    link.href = data;
    link.download = filename;
    document.body.appendChild(link);

    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      }),
    );

    this.document.body.removeChild(link);
  }
}
