import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import {
  EuiPaginationEvent,
  EuiPaginatorComponent,
} from '@eui/components/eui-paginator';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  Subject,
  take,
  takeUntil,
} from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';
import { ProposalFilterHomeComponent } from '@/features/landing-page/components/proposal-filter-home/proposal-filter-home.component';
import {
  DEFAULT_HOME_LIMIT,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  DEFAULT_SEARCH,
  DEFAULT_SORT_ORDER,
  ProposalFilter,
} from '@/features/proposals/models';
import { Document, LeosConfig, ProcedureType } from '@/shared';
import { CreateProposalService } from '@/shared/services/create-proposal.service';
import { EnvironmentService } from '@/shared/services/enviroment.service';
import { ProposalService } from '@/shared/services/proposal.service';

type ProposalsState = {
  filters: ProposalFilter;
  sortOrder: boolean;
  limit: number;
  page: number;
};

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit, AfterViewInit, OnDestroy {
  proposals$: Observable<Document[]>;
  limit$: Observable<number>;
  totalResults$: Observable<number>;
  sortOrder = DEFAULT_SORT_ORDER;
  public searchTerm: string;
  @ViewChild('paginatorComponent')
  paginatorComponent: EuiPaginatorComponent;
  @ViewChild('filters') filtersComponent: ProposalFilterHomeComponent;
  showProposalCard = false;
  canUpload = false;
  protected readonly homeUrl = document.baseURI;
  private destroy$ = new Subject<void>();

  constructor(
    public environmentService: EnvironmentService,
    private fb: FormBuilder,
    protected createProposalService: CreateProposalService,
    private proposalService: ProposalService,
    private cdr: ChangeDetectorRef,
    private appConfig: AppConfigService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.limit$ = this.proposalService.limit$;
    this.proposals$ = this.proposalService.proposals$;
    this.totalResults$ = this.proposalService.totalResults$;
    this.searchTerm = '';
  }

  ngOnInit() {
    this.proposalService.sortOrder$.subscribe((so) => (this.sortOrder = so));

    this.route.queryParamMap.subscribe((paramsMap) =>
      this.applyQueryParams(paramsMap),
    );

    combineLatest({
      filters: this.proposalService.filters$,
      sortOrder: this.proposalService.sortOrder$,
      limit: this.proposalService.limit$,
      page: this.proposalService.page$,
    })
      .pipe(
        map(LandingPageComponent.stateToQueryParams),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      )
      .subscribe((params) => {
        this.setQueryParams(params);
      });

    this.appConfig.config.pipe(takeUntil(this.destroy$)).subscribe((config) => {
      this.canUpload = config.userAppPermissions.includes('CAN_UPLOAD');
    });
  }

  ngAfterViewInit(): void {
    this.proposalService.proposals$.pipe(take(1)).subscribe(() => {
      this.proposalService.page$.subscribe((page) => {
        this.paginatorComponent?.getPage(page);
        setTimeout(() => this.cdr.detectChanges());
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleCreate() {
    this.createProposalService.openProposalCreateDialog();
  }

  handleUpload() {
    this.createProposalService.openProposalUploadDialog();
  }

  handleCreateMandate() {
    this.createProposalService.openProposalUploadDialog();
  }

  handleCreateDraft() {
    this.createProposalService.openProposalCreateDraftDialog(false);
  }

  private setQueryParams(queryParams: Params) {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: '',
    });
  }

  private applyQueryParams(paramsMap: ParamMap) {
    const { filters, limit, page } =
      LandingPageComponent.queryParamsToState(paramsMap);

    this.proposalService.setFilters(filters);
    this.proposalService.setLimit(limit);
    this.proposalService.setPage(page);
  }

  private static queryParamsToState(paramsMap: ParamMap): ProposalsState {
    const getIntParam = (name: string, defaultVal: number) => {
      const val = paramsMap.get(name);
      return typeof val === 'string' && /\d+/.test(val)
        ? Number.parseInt(val, 10)
        : defaultVal;
    };

    const filters: ProposalFilter = {
      procedures: paramsMap.getAll('procedures') as ProcedureType[],
      acts: paramsMap.getAll('acts'),
      templates: paramsMap.getAll('templates'),
      roles: paramsMap.getAll('roles') as ProposalFilter['roles'],
      searchTerm: paramsMap.get('searchTerm') ?? DEFAULT_SEARCH,
    };
    const sortOrder = paramsMap.get('sortOrder') === 'true';
    const limit = getIntParam('limit', DEFAULT_HOME_LIMIT);
    const page = getIntParam('page', DEFAULT_PAGE);

    return { filters, sortOrder, limit, page };
  }

  private static stateToQueryParams(state: ProposalsState): Params {
    const { filters, sortOrder, limit, page } = state;
    const queryParams = {} as Params;

    if (filters.procedures?.length) {
      queryParams.procedures = filters.procedures;
    }
    if (filters.acts?.length) {
      queryParams.acts = filters.acts;
    }
    if (filters.templates?.length) {
      queryParams.templates = filters.templates;
    }
    if (filters.roles?.length) {
      queryParams.roles = filters.roles;
    }
    if (filters.searchTerm?.length) {
      queryParams.searchTerm = filters.searchTerm;
    }
    if (sortOrder !== DEFAULT_SORT_ORDER) {
      queryParams.sortOrder = sortOrder;
    }
    if (limit !== DEFAULT_LIMIT) {
      queryParams.limit = limit;
    }
    if (page !== DEFAULT_PAGE) {
      queryParams.page = page;
    }

    return queryParams;
  }

  handlePagerChange($event: EuiPaginationEvent) {
    this.proposalService.setLimit($event.pageSize);
    this.proposalService.setPage($event.page);
  }

  toggleProposalCardVisibility(searchTerm: string | null): void {
    this.searchTerm = searchTerm || '';
    if (searchTerm) {
      this.proposalService.setFilters({ searchTerm });
      this.showProposalCard = true;
    } else {
      this.showProposalCard = false;
    }
  }

  resetFilter() {
    this.filtersComponent.resetFilters();
  }
}
