import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { result } from 'lodash-es';
import {
  BehaviorSubject,
  combineLatestWith,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  Observable,
  of,
  skip,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';

import { DocumentSearchParams } from '@/features/akn-document/models';
import { Version } from '@/features/akn-document/models/versions';
import { VersionSearchParams } from '@/shared/models/versionSearch';

import { apiBaseUrl } from '../../../config';
import { DocumentViewResponse } from '../models/document-view-response.model';
import { NodeValidationResponse } from '../models/drop-response.model';
import { TableOfContentItemVO, TocItem } from '../models/toc.model';

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
  recentChanges$: Observable<any[]>;
  versionId$: Observable<string | null>;
  versionCompareIds$: Observable<any | null>;
  searchResultIndexArray: string[];
  focusedSearchResult: string;
  versionSearchParams$: Observable<VersionSearchParams>;
  versionFilter$: Observable<string>;

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

  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.documentId$ = this.documentIdBS.asObservable();
    this.documentCategory$ = this.documentCategoryBS.asObservable();
    this.tocItems$ = this.tocItemBS.asObservable();
    this.documentView$ = this.documentId$.pipe(
      combineLatestWith(this.documentCategory$),
      switchMap(([ref, category]) => this.getDocumentByRef(ref, category)),
    );

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

    this.setVersionFilter('all');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeEditor() {
    console.warn('stub:', 'closeEditor'); // FIXME
  }

  createNote() {
    console.warn('stub:', 'createNote'); // FIXME
  }

  download() {
    const documentType = this.documentCategoryBS.value;
    const documentRef = this.documentIdBS.value;
    let versionId = '';
    this.versions$
      .pipe(take(1))
      .subscribe((versionArray) => (versionId = versionArray[0].documentId));

    this.http
      .get(`${apiBaseUrl}/secured/${documentType}/${documentRef}`, {
        params: { versionId },
      })
      .subscribe((data: DocumentViewResponse) => {
        const blob = new Blob([data.editableXml], { type: 'text/xml' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      });
  }

  downloadWithAnnotation() {
    console.warn('stub:', 'downloadWithAnnotation'); // FIXME
  }

  getDocumentByRef(ref: string, category: string) {
    category = category === 'coverpage' ? 'coverPage' : category;
    return this.http
      .get<DocumentViewResponse>(`${apiBaseUrl}/secured/${category}/${ref}`)
      .pipe(take(1));
  }

  import() {
    console.warn('stub:', 'import'); // FIXME
  }

  reloadDocument() {
    console.warn('stub:', 'reloadDocument'); // FIXME
  }

  saveVersion(requestBody: any) {
    return this.saveDocumentVersionWithData(
      this.documentCategoryBS.value,
      this.documentIdBS.value,
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

  searchReplace(text: string) {
    console.warn('stub:', 'searchReplace', text); // FIXME
  }

  searchReplaceAll(text: string) {
    console.warn('stub:', 'searchReplaceAll', text); // FIXME
  }

  searchSave() {
    console.warn('stub:', 'searchSave'); // FIXME
  }

  searchSaveAndClose() {
    this.searchSave();
    this.toggleSearchPane(false);
  }

  seeNavigation() {
    console.warn('stub:', 'seeNavigation'); // FIXME
  }

  seeUserGuidance() {
    console.warn('stub:', 'seeUserGuidance'); // FIXME
  }

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
    this.toggleSubject(this.searchPaneOpenBS, open);
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
        `api/secured/${documentCategory}/${documentRef}/restore/${versionNumber}`,
      )
      .subscribe((r) => {
        this.setDocumentId(documentRef);
      });

    console.warn('stub:', 'versionRevert', versionNumber); // FIXME
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

  getTocItems(annexRef: string, tocMode = 'SIMPLIFIED') {
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
    return this.http.get<any[]>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/recent-changes`,
    );
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
      `api/secured/${documentType}/${versionId}/show-version`,
    );
  }

  getDocumentVersionsComparison(versionArray: any, documentType: string) {
    documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
    if (versionArray && versionArray.newVersion !== null) {
      return this.http.get<string>(
        `api/secured/${documentType}/${versionArray.newVersion}/compare/${versionArray.oldVersion}`,
        { responseType: 'text' as 'json' },
      );
    } else {
      return of('');
    }
  }

  private doSearch(parameters: DocumentSearchParams) {
    const documentType =
      this.documentCategoryBS.value === 'coverpage'
        ? 'coverPage'
        : this.documentCategoryBS.value;
    const documentRef = this.documentIdBS.value;
    this.http
      .get(`api/secured/${documentType}/${documentRef}/search-text`, {
        params: parameters,
      })
      .subscribe((results: any[]) => {
        this.highlightSearchResults(results);
        this.scrollToElement(this.searchResultIndexArray[0]);
      });
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
            this.searchResultIndexArray.push(wrapper2.id);
            wrapper2.classList.add('search-result');
            range2.surroundContents(wrapper2);
            multipleInstances = true;
          }
          const wrapper = document.createElement('span');
          const wrapperId = 'result-' + index;
          wrapper.id = wrapperId;
          this.searchResultIndexArray.push(wrapper.id);
          wrapper.classList.add('search-result');
          range.surroundContents(wrapper);
        }
      }
    }
  }

  private removeHighlights() {
    this.searchResultIndexArray = [];
    this.focusedSearchResult = '';
    this.document.querySelectorAll('.search-result').forEach((el) => {
      const p = el.parentNode;
      el.replaceWith(...el.childNodes);
      p.normalize();
    });
  }

  private scrollToElement(id: string) {
    this.focusedSearchResult = id;
    const targetElement = document.getElementById(id);
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
}
