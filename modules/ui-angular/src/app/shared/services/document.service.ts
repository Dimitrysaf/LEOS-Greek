import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  combineLatestWith,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  Observable,
  skip,
  Subject,
  switchMap,
  take,
  takeUntil,
  withLatestFrom,
} from 'rxjs';

import { DocumentSearchParams } from '@/features/akn-document/models';
import { Version } from '@/features/akn-document/models/versions';

import { DocumentViewResponse } from '../models/document-view-response.model';
import { TableOfContentItemVO, TocItem } from '../models/toc.model';
import { VersionInfoVO } from '../models/version-info.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentService implements OnDestroy {
  documentCategory$: Observable<string | null>;
  annotationsEnabled$: Observable<boolean>;
  compareModeEnabled$: Observable<boolean>;
  documentId$: Observable<string | null>;
  documentView$: Observable<DocumentViewResponse | null>;
  guidelinesEnabled$: Observable<boolean>;
  highlightsEnabled$: Observable<boolean>;
  searchPaneOpen$: Observable<boolean>;
  searchParams$: Observable<DocumentSearchParams>;
  versions$: Observable<Version[]>;
  versionSearchOpen$: Observable<boolean>;
  toc$: Observable<TableOfContentItemVO[]>;
  tocItems$: Observable<any[]>;

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

  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient) {
    this.documentId$ = this.documentIdBS.asObservable();
    this.documentCategory$ = this.documentCategoryBS.asObservable();
    this.tocItems$ = this.tocItemBS.asObservable();
    this.documentView$ = this.documentId$.pipe(
      // FIXME: use proper API
      combineLatestWith(this.documentCategory$),
      switchMap(([ref, category]) => this.getDocumentByRef(ref, category)),
    );

    this.annotationsEnabled$ = this.annotationsEnabledBS.asObservable();
    this.compareModeEnabled$ = this.compareModeEnabledBS.asObservable();
    this.guidelinesEnabled$ = this.guidelinesEnabledBS.asObservable();
    this.highlightsEnabled$ = this.highlightsEnabledBS.asObservable();
    this.searchPaneOpen$ = this.searchPaneOpenBS.asObservable();
    this.searchParams$ = this.searchParamsBS.pipe(
      distinctUntilChanged(DocumentService.searchStateComparator),
    );
    this.versions$ = this.documentId$.pipe(
      combineLatestWith(this.documentCategory$),
      mergeMap(([ref, category]) =>
        this.getDocumentVersionsData(category, ref),
      ),
    );
    this.versionSearchOpen$ = this.versionSearchOpenBS.asObservable();

    this.searchPaneOpen$
      .pipe(
        takeUntil(this.destroy$),
        filter((x) => !x),
      )
      .subscribe(() => this.setSearchParams({ searchText: '' }));
    this.searchParams$
      .pipe(takeUntil(this.destroy$), skip(1))
      .subscribe((params) => this.doSearch(params));
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
    console.warn('stub:', 'download'); // FIXME
  }

  downloadWithAnnotation() {
    console.warn('stub:', 'downloadWithAnnotation'); // FIXME
  }

  getDocumentByRef(ref: string, category: string) {
    category = category === 'coverpage' ? 'coverPage' : category;
    return this.http
      .get<DocumentViewResponse>(`api/secured/${category}/${ref}`)
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
    console.warn('stub:', 'searchNext'); // FIXME
  }

  searchPrevious() {
    console.warn('stub:', 'searchPrevious'); // FIXME
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

  toggleAnnotations(enabled?: boolean) {
    this.toggleSubject(this.annotationsEnabledBS, enabled);
  }

  toggleCompareMode(enabled?: boolean) {
    this.toggleSubject(this.compareModeEnabledBS, enabled);
    this.compareModeEnabledBS.pipe(take(1)).subscribe((e) => {
      console.warn('stub:', 'toggleCompareMode', e); // FIXME
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
    console.warn('stub:', 'versionRevert', versionNumber); // FIXME
  }

  versionView(versionNumber: string) {
    console.warn('stub:', 'versionView', versionNumber); // FIXME
  }

  getToc(annexRef: string, tocMode = 'SIMPLIFIED') {
    let category = this.documentCategoryBS.value;
    category = category === 'coverpage' ? 'coverPage' : category;
    return this.http.get<TableOfContentItemVO[]>(
      `api/secured/${category}/${annexRef}/getToc`,
      {
        params: { tocMode },
      },
    );
  }

  getTocItems(annexRef: string, tocMode = 'SIMPLIFIED') {
    let category = this.documentCategoryBS.value;
    category = category === 'coverpage' ? 'coverPage' : category;
    return this.http.get<TocItem[]>(
      `api/secured/${category}/${annexRef}/getTocItems`,
      {
        params: { tocMode },
      },
    );
  }

  validateNodeDrop(
    documentRef: string,
    documentType: string,
    nodeDragged: TableOfContentItemVO,
    nodeDroppedAt: TableOfContentItemVO,
  ) {
    return this.http.post(`api/secured/toc/${documentRef}/validate-node-drop`, {
      nodeDragged: null,
      nodeDroppedAt: null,
      documentRef,
      documentType,
    });
  }

  setToc(toc: TableOfContentItemVO[]) {
    this.tocItemBS.next(toc);
  }

  getDocumentVersionsData(documentType: string, documentRef: string) {
    //FIXME modify this when backend api for version-data is modified not to contain documentId param.
    return this.http.get<Version[]>(
      `api/secured/${documentType}/${documentRef}/${documentRef}/version-data/`,
    );
  }

  saveDocumentVersionWithData(
    documentType: string,
    documentRef: string,
    data: any,
  ) {
    return this.http.post<Version[]>(
      `api/secured/${documentType}/${documentRef}/save-version`,
      {
        ...data,
      },
    );
  }

  private doSearch(params: DocumentSearchParams) {
    console.warn('stub:', 'doSearch', params); // FIXME
  }

  private toggleSubject(subj: Subject<boolean>, value?: boolean) {
    subj.pipe(take(1)).subscribe((oldVal) => {
      const nextVal = value ?? !oldVal;
      subj.next(nextVal);
    });
  }

  private getDocument(documentRef: string, category: string) {
    return this.http
      .get(`api/secured/${category}/${documentRef}`, { responseType: 'text' })
      .pipe(take(1));
  }

  private static searchStateComparator(a, b) {
    const aKeys = Object.keys(a);
    return (
      aKeys.length === Object.keys(b).length &&
      aKeys.every((k) => a[k] === b[k])
    );
  }
}
