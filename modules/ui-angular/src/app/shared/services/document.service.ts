import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  mergeMap,
  Observable,
  skip,
  Subject,
  take,
  takeUntil,
} from 'rxjs';

import { DocumentSearchParams } from '@/features/akn-document/models';
import { Version } from '@/features/akn-document/models/versions';

import { TableOfContentItemVO } from '../models/toc.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentService implements OnDestroy {
  documentCategory: Observable<boolean>;
  annotationsEnabled$: Observable<boolean>;
  compareModeEnabled$: Observable<boolean>;
  documentId$: Observable<string | null>;
  documentXML$: Observable<string | null>;
  guidelinesEnabled$: Observable<boolean>;
  highlightsEnabled$: Observable<boolean>;
  searchPaneOpen$: Observable<boolean>;
  searchParams$: Observable<DocumentSearchParams>;
  versions$: Observable<Version[]>;
  versionSearchOpen$: Observable<boolean>;
  tocItems$: Observable<TableOfContentItemVO[]>;

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
    this.tocItems$ = this.tocItemBS.asObservable();
    this.documentXML$ = this.documentId$.pipe(
      // FIXME: use proper API
      mergeMap((ref) =>
        ref ? this.getDocumentByRef(ref, this.documentCategoryBS.value) : null,
      ),
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
      // FIXME: use proper API
      mergeMap((id) =>
        this.http.get<Version[]>(`api/secured/documents/${id}/versions/`),
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

  /** @deprecated TODO: replace uses and delete */
  getXmlDocument() {
    return this.documentXML$;
  }

  getDocumentByRef(ref: string, category: string) {
    category = category === 'coverpage' ? 'coverPage' : category;
    return this.http
      .get(`api/secured/${category}/${ref}`, { responseType: 'text' })
      .pipe(take(1));
  }

  import() {
    console.warn('stub:', 'import'); // FIXME
  }

  reloadDocument() {
    console.warn('stub:', 'reloadDocument'); // FIXME
  }

  saveVersion() {
    console.warn('stub:', 'saveVersion'); // FIXME
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

  getTocItems(annexRef: string, tocMode = 'SIMPLIFIED') {
    let category = this.documentCategoryBS.value;
    category = category === 'coverpage' ? 'coverPage' : category;
    return this.http.get<TableOfContentItemVO[]>(
      `api/secured/${category}/${annexRef}/getTocItems`,
      {
        params: { tocMode },
      },
    );
  }

  setToc(toc: TableOfContentItemVO[]) {
    this.tocItemBS.next(toc);
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
