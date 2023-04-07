import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { GLOBAL_CONFIG_TOKEN, GlobalConfig, I18nService } from '@eui/core';
import { Document } from '@leos/shared';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  lastValueFrom,
  map,
  Observable,
  pluck,
  shareReplay,
  tap,
} from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { apiBaseUrl } from 'src/config';

import { AppConfigService } from '@/core/services/app-config.service';
import { LoadingService } from '@/shared/services/loading.service';

import {
  CreateDraftBody,
  CreateDraftResponse,
  CreateExplanatoryDocument,
  CreateProposalBody,
  CreateProposalResponse,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  DEFAULT_SORT_ORDER,
  GetTemplatesResponse,
  ListProposalsWithFilterBody,
  ListProposalsWithFilterBodyFilter,
  ListProposalsWithFilterResponse,
  ProposalFilter,
  UpdateProposalMetadataModel,
} from '../models';
import {
  LegFileValidationResponse,
  UploadProposalResposne,
} from '../models/upload-response.model';

const initialFilters: ProposalFilter = {
  searchTerm: '',
  procedures: [],
  acts: [],
  templates: [],
  roles: [],
};

@Injectable()
export class ProposalService {
  private static extractParamFilters(formFilters: ProposalFilter) {
    const reqFilters: ListProposalsWithFilterBodyFilter[] = [];

    if (formFilters.procedures?.length) {
      reqFilters.push({
        type: 'procedureType',
        value: [...formFilters.procedures].sort(),
      });
    }
    if (formFilters.acts?.length) {
      reqFilters.push({
        type: 'docType',
        value: [...formFilters.acts].sort(),
      });
    }
    if (formFilters.templates?.length) {
      reqFilters.push({
        type: 'template',
        value: [...formFilters.templates].sort(),
      });
    }
    if (formFilters.roles?.length) {
      reqFilters.push({
        type: 'role',
        value: [...formFilters.roles].sort(),
      });
    }
    if (formFilters.searchTerm?.length) {
      reqFilters.push({
        type: 'title',
        value: [formFilters.searchTerm],
      });
    }

    return reqFilters;
  }

  private static eqFilters(f1: ProposalFilter, f2: ProposalFilter) {
    const eqArray = (a: unknown[], b: unknown[]) =>
      a.length === b.length && a.every((x) => b.includes(x));
    const keys = Object.keys(f1);
    if (!eqArray(keys, Object.keys(f2))) {
      return false;
    }

    const propIsEqual = (k) => {
      const v1 = f1[k];
      const v2 = f2[k];
      return Array.isArray(v1) ? eqArray(v1, v2) : Object.is(v1, v2);
    };

    return keys.every(propIsEqual);
  }

  filters$: Observable<ProposalFilter>;
  sortOrder$: Observable<boolean>;
  limit$: Observable<number>;
  page$: Observable<number>;
  proposals$: Observable<Document[]>;
  totalResults$: Observable<number>;
  templateCatalog$ = this.http
    .get<GetTemplatesResponse>(`${apiBaseUrl}/secured/getTemplates`)
    .pipe(shareReplay(1));

  private defaultLanguage =
    this.globalConfig.i18n.i18nService.defaultLanguage.toUpperCase();
  private userLang: string;
  private filtersBS = new BehaviorSubject<ProposalFilter>(initialFilters);
  private sortOrderBS = new BehaviorSubject(DEFAULT_SORT_ORDER);
  private limitBS = new BehaviorSubject<number>(DEFAULT_LIMIT);
  private pageBS = new BehaviorSubject<number>(DEFAULT_PAGE);
  private params$: Observable<ListProposalsWithFilterBody>;
  private proposalResponse$: Observable<ListProposalsWithFilterResponse>;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    @Inject(GLOBAL_CONFIG_TOKEN) protected globalConfig: GlobalConfig,
    private i18nService: I18nService,
  ) {
    i18nService.getState().subscribe((state) => {
      this.userLang = state.activeLang.toUpperCase();
    });
    this.filters$ = this.filtersBS.pipe(
      distinctUntilChanged(ProposalService.eqFilters),
    );
    this.sortOrder$ = this.sortOrderBS.pipe(distinctUntilChanged());
    this.limit$ = this.limitBS.pipe(distinctUntilChanged());
    this.page$ = this.pageBS.pipe(distinctUntilChanged());

    this.params$ = combineLatest([
      this.filters$,
      this.sortOrder$,
      this.limit$,
      this.page$,
    ]).pipe(
      tap(() => this.loadingService.setLoading(true)),
      map(([filters, sortOrder, limit, page]) => ({
        startIndex: (page === -1 ? 0 : page) * limit,
        sortOrder,
        limit,
        filters: ProposalService.extractParamFilters(filters),
      })),
      finalize(() => {
        this.setPage(0);
        this.loadingService.setLoading(false);
      }),
    );

    this.proposalResponse$ = this.params$.pipe(
      debounceTime(10),
      tap(() =>
        this.loadingService.setLoading(true)
      ),
      switchMap((params) =>
        this.http.post<ListProposalsWithFilterResponse>(
          `${apiBaseUrl}/secured/filterProposals`,
          params,
        ),
      ),
      tap(() => this.loadingService.setLoading(false)),

      shareReplay(1),
    );

    this.totalResults$ = this.proposalResponse$.pipe(pluck('proposalCount'));
    this.proposals$ = this.proposalResponse$.pipe(pluck('proposals'));
  }

  setSortOrder(order: boolean) {
    this.sortOrderBS.next(order);
  }

  setPage(page: number) {
    this.pageBS.next(page);
  }

  setLimit(limit: number) {
    this.limitBS.next(limit);
  }

  setFilters(filters: Partial<ProposalFilter>) {
    this.filtersBS.next({
      ...this.filtersBS.value,
      ...filters,
    });
  }

  getTranslation(dict: Record<string, string>, langCode = this.userLang) {
    const firstAvailableLang = Object.keys(dict)[0];
    return (
      dict[langCode] ??
      dict[this.defaultLanguage] ??
      dict[firstAvailableLang] ??
      ''
    );
  }

  createProposal(data: CreateProposalBody) {
    this.loadingService.setLoading(true);
    return this.http
      .post<CreateProposalResponse>(`${apiBaseUrl}/secured/createPackage`, data)
      .pipe(finalize(() => this.loadingService.setLoading(false)));
  }

  createExplanatoryDocument(data: CreateExplanatoryDocument) {
    this.loadingService.setLoading(true);
    return this.http
      .post<Document>(
        `${apiBaseUrl}/secured/proposal/createExplanatoryDocument`,
        data,
      )
      .pipe(finalize(() => this.loadingService.setLoading(false)));
  }

  uploadProposal(data: File) {
    const formData: FormData = new FormData();
    formData.append('legFile', data);
    return this.http
      .post<UploadProposalResposne>(
        `${apiBaseUrl}/secured/proposal/upload`,
        formData,
        {
          reportProgress: true,
          observe: 'events',
        },
      )
      .pipe(tap(() => this.loadingService.setLoading(true)));
  }

  validateLegFile(data: File) {
    const formData: FormData = new FormData();
    formData.append('legFile', data);
    return this.http
      .post<LegFileValidationResponse>(
        `${apiBaseUrl}/secured/proposal/validateLegFile`,
        formData,
        {
          reportProgress: true,
        },
      )
      .pipe(finalize(() => this.loadingService.setLoading(false)));
  }

  updateProposalMetadata(
    proposalRef: string,
    requestData: UpdateProposalMetadataModel,
  ) {
    return this.http.put(
      `${apiBaseUrl}/secured/proposal/${proposalRef}`,
      requestData,
    );
  }
}
