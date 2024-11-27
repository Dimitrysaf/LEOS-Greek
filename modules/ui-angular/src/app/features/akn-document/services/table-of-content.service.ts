import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  finalize,
  forkJoin,
  Observable,
  switchMap,
  take,
} from 'rxjs';
import { apiBaseUrl } from 'src/config';

import { TableOfContentItemVO } from '@/shared/models/toc.model';
import { DocumentRefAndCategory } from '@/shared/services/document.service';
import { LoadingService } from '@/shared/services/loading.service';

import { TocItem } from '../models/ckeditor';

@Injectable({ providedIn: 'root' })
export class TableOfContentService {
  toc$: Observable<TableOfContentItemVO[]>;
  tocItems$: Observable<TocItem[]>;
  documentRefAndCategory$: Observable<DocumentRefAndCategory>;
  selectedNode$: Observable<TableOfContentItemVO>;
  isEditMode$: Observable<boolean>;
  isTocDraft$: Observable<boolean>;
  isTocLoading$: Observable<boolean>;

  public isClonedProposal = false;
  public isTrackChangesEnabled = false;
  private originalToc : TableOfContentItemVO[];

  documentRefAndCategoryBS = new BehaviorSubject<DocumentRefAndCategory | null>(
    null,
  );

  private tocBS = new BehaviorSubject<TableOfContentItemVO[]>(null);
  private initialToc = new BehaviorSubject<TableOfContentItemVO[]>(null);
  private tocItemsBS = new BehaviorSubject<TocItem[]>(null);
  private selectedNodeBS = new BehaviorSubject<TableOfContentItemVO>(null);
  private isEditModeBS = new BehaviorSubject<boolean>(false);
  private isTocDraftBS = new BehaviorSubject<boolean>(false);
  private isTocLoadingBS = new BehaviorSubject<boolean>(false);

  private blockReloadOfToc = false;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
  ) {
    this.documentRefAndCategory$ = this.documentRefAndCategoryBS
      .asObservable()
      .pipe(filter(Boolean));

    this.toc$ = this.tocBS.asObservable();
    this.tocItems$ = this.tocItemsBS.asObservable();
    this.selectedNode$ = this.selectedNodeBS.asObservable();
    this.isTocDraft$ = this.isTocDraftBS.asObservable();
    this.isTocLoading$ = this.isTocLoadingBS.asObservable();
    this.isEditMode$ = this.isEditModeBS.asObservable();

    this.documentRefAndCategory$
      .pipe(
        distinctUntilChanged(),
        filter(Boolean),
        switchMap((options) => {
          if (!this.blockReloadOfToc) {
            const toc = this.getToc(options.ref, options.category);
            const tocItems = this.getTocItems(options.ref, options.category);
            return forkJoin([toc, tocItems]);
          } else {
            this.blockReloadOfToc = false;
            return forkJoin([this.tocBS, this.tocItemsBS]);
          }
        }),
      )
      .subscribe((result) => {
        this.tocBS.next(result[0]);
        this.tocItemsBS.next(result[1]);
      });
  }

  setIsClonedProposal(isClonedProposal: boolean) {
    this.isClonedProposal = isClonedProposal;
  }

  setIsTrackChangesEnabled(isTrackChangesEnabled: boolean) {
    this.isTrackChangesEnabled = isTrackChangesEnabled;
  }

  setDocumentRefAndCategory(ref: string, category: string) {
    this.documentRefAndCategoryBS.next({ ref, category });
  }

  reload() {
    const ref = this.documentRefAndCategoryBS.value.ref;
    const category = this.documentRefAndCategoryBS.value.category;
    this.setDocumentRefAndCategory(ref, category);
  }

  refreshToc(toc) {
    this.tocBS.next(toc);
  }

  reloadToc() {
    const ref = this.documentRefAndCategoryBS.value.ref;
    const category = this.documentRefAndCategoryBS.value.category;
    this.getToc(ref, category)
      .pipe(take(1))
      .subscribe((toc) => this.tocBS.next(toc));
  }

  returnInitialToc() {
    const ref = this.documentRefAndCategoryBS.value.ref;
    const category = this.documentRefAndCategoryBS.value.category;
    this.getToc(ref, category)
      .pipe(take(1))
      .subscribe((toc) => this.initialToc.next(toc));
    return this.initialToc.value;
  }

  displayOriginalToc() {
    this.tocBS.next(this.originalToc);
  }

  resetOriginalToc(toc?: TableOfContentItemVO[]) {
    if (toc) {
      this.originalToc = toc;
    } else {
      this.originalToc = this.tocBS.value;
    }
  }

  saveToc(
    documentRef: string,
    documentType: string,
    toc: TableOfContentItemVO[],
  ) {
    const category = documentType === 'coverpage' ? 'coverPage' : documentType;
    return this.http
      .post<TableOfContentItemVO[]>(
        `${apiBaseUrl}/secured/${category}/${documentRef}/save-toc`,
        {
          tableOfContentItemVOs: toc,        },
      );
  }

  setBlockReloadOfToc() {
    this.blockReloadOfToc = true;
  }

  getCurrentToc() {
    return this.tocBS.value;
  }

  getCurrentTocItems() {
    return this.tocItemsBS.value;
  }

  getIsTocDraft() {
    return this.isTocDraftBS.value;
  }

  setToc(toc: TableOfContentItemVO[]) {
    this.tocBS.next(toc);
  }

  setTocIsDraft(value: boolean) {
    this.isTocDraftBS.next(value);
  }

  setSelectedNode(node: TableOfContentItemVO) {
    this.selectedNodeBS.next(node);
  }

  setIsEditMode(value: boolean) {
    this.isEditModeBS.next(value);
    if (value) {
      this.originalToc = this.tocBS.value;
    }
  }

  private getTocItems(documentRef: string, documentType: string) {
    const category = documentType === 'coverpage' ? 'coverPage' : documentType;
    const tocMode = 'SIMPLIFIED';
    return this.http.get<TocItem[]>(
      `${apiBaseUrl}/secured/${category}/${documentRef}/getTocItems`,
      {
        params: { tocMode },
      },
    );
  }

  private getToc(documentRef: string, documentType: string) {
    const category = documentType === 'coverpage' ? 'coverPage' : documentType;
    const tocMode = 'SIMPLIFIED';
    this.isTocLoadingBS.next(true);
    if (this.isEditModeBS.value) {
      this.loadingService.setLoading(true);
    }
    return this.http.get<TableOfContentItemVO[]>(
      `${apiBaseUrl}/secured/${category}/${documentRef}/getToc`,
      {
        params: { tocMode },
      },
    ).pipe(finalize(() => {
      this.loadingService.setLoading(false);
      this.isTocLoadingBS.next(false);
    }));
  }
}
