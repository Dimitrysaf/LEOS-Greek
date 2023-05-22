import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  finalize,
  forkJoin,
  map,
  mergeMap,
  Observable,
  Subject,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import { apiBaseUrl } from 'src/config';

import { TableOfContentItemVO } from '@/shared/models/toc.model';
import { DocumentRefAndCategory } from '@/shared/services/document.service';
import { LoadingService } from '@/shared/services/loading.service';

import { TocItem } from '../models/ckeditor';

@Injectable({ providedIn: 'root' })
export class TableOfContentService implements OnDestroy {
  toc$: Observable<TableOfContentItemVO[]>;
  tocItems$: Observable<TocItem[]>;
  documentRefAndCategory$: Observable<DocumentRefAndCategory>;

  private documentRefAndCategoryBS =
    new BehaviorSubject<DocumentRefAndCategory | null>(null);
  private tocBS = new BehaviorSubject<TableOfContentItemVO[]>(null);
  private tocItemsBS = new BehaviorSubject<TocItem[]>(null);
  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
  ) {
    this.documentRefAndCategory$ = this.documentRefAndCategoryBS
      .asObservable()
      .pipe(filter(Boolean));

    this.toc$ = this.tocBS.asObservable();
    this.tocItems$ = this.tocItemsBS.asObservable();

    this.documentRefAndCategory$
      .pipe(
        filter(Boolean),
        takeUntil(this.destroy$),
        mergeMap((options) => {
          const toc = this.getToc(options.ref, options.category);
          const tocItems = this.getTocItems(options.ref, options.category);
          return forkJoin([toc, tocItems]);
        }),
      )
      .subscribe((result) => {
        this.tocBS.next(result[0]);
        this.tocItemsBS.next(result[1]);
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setDocumentRefAndCategory(ref: string, category: string) {
    this.documentRefAndCategoryBS.next({ ref, category });
  }

  reload() {
    const ref = this.documentRefAndCategoryBS.value.ref;
    const category = this.documentRefAndCategoryBS.value.category;
    this.setDocumentRefAndCategory(ref, category);
  }

  reloadTocItems() {
    const ref = this.documentRefAndCategoryBS.value.ref;
    const category = this.documentRefAndCategoryBS.value.category;
    this.getTocItems(ref, category)
      .pipe(take(1))
      .subscribe((tocItems) => this.tocItemsBS.next(tocItems));
  }

  reloadToc() {
    const ref = this.documentRefAndCategoryBS.value.ref;
    const category = this.documentRefAndCategoryBS.value.category;
    this.getToc(ref, category)
      .pipe(take(1))
      .subscribe((toc) => this.tocBS.next(toc));
  }

  saveToc(
    documentRef: string,
    documentType: string,
    toc: TableOfContentItemVO[],
  ) {
    const category = documentType === 'coverpage' ? 'coverPage' : documentType;
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

  private getTocItems(
    documentRef: string,
    documentType: string,
    tocMode = process.env.NG_APP_LEOS_INSTANCE === 'cn'
      ? 'NOT_SIMPLIFIED'
      : 'SIMPLIFIED',
  ) {
    const category = documentType === 'coverpage' ? 'coverPage' : documentType;
    return this.http.get<TocItem[]>(
      `${apiBaseUrl}/secured/${category}/${documentRef}/getTocItems`,
      {
        params: { tocMode },
      },
    );
  }

  private getToc(
    documentRef: string,
    documentType: string,
    tocMode = process.env.NG_APP_LEOS_INSTANCE === 'cn'
      ? 'NOT_SIMPLIFIED'
      : 'SIMPLIFIED',
  ) {
    const category = documentType === 'coverpage' ? 'coverPage' : documentType;

    return this.http.get<TableOfContentItemVO[]>(
      `${apiBaseUrl}/secured/${category}/${documentRef}/getToc`,
      {
        params: { tocMode },
      },
    );
  }

  public getCurrentToc() {
    return this.tocBS.value;
  }
}
