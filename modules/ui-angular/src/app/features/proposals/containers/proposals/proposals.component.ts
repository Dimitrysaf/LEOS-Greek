import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import {
  EuiPaginationEvent,
  EuiPaginatorComponent,
} from '@eui/components/eui-paginator';
import { ProcedureType } from '@leos/shared';
import { combineLatest, distinctUntilChanged, map, take, tap } from 'rxjs';

import { ProposalsFiltersComponent } from '../../components';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  DEFAULT_SEARCH,
  DEFAULT_SORT_ORDER,
  ProposalFilter,
} from '../../models';
import { ProposalService } from '../../services/proposal.service';

type ProposalsState = {
  filters: ProposalFilter;
  sortOrder: boolean;
  limit: number;
  page: number;
};

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.scss'],
})
export class ProposalsComponent implements OnInit {
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
    const limit = getIntParam('limit', DEFAULT_LIMIT);
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
  isFilterCollapsed = false;
  filters$ = this.proposalService.filters$;
  page$ = this.proposalService.page$;
  limit$ = this.proposalService.limit$;
  proposals$ = this.proposalService.proposals$;
  totalResults$ = this.proposalService.totalResults$;
  sortOrder = DEFAULT_SORT_ORDER;

  @ViewChild('paginatorComponent')
  paginatorComponent: EuiPaginatorComponent;
  @ViewChild('filters') filtersComponent: ProposalsFiltersComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private proposalService: ProposalService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((paramsMap) =>
      this.applyQueryParams(paramsMap),
    );

    this.proposalService.sortOrder$.subscribe((so) => (this.sortOrder = so));

    combineLatest({
      filters: this.proposalService.filters$,
      sortOrder: this.proposalService.sortOrder$,
      limit: this.proposalService.limit$,
      page: this.proposalService.page$,
    })
      .pipe(
        map(ProposalsComponent.stateToQueryParams),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      )
      .subscribe((params) => {
        this.setQueryParams(params);
      });

    // Sync service.page$ -> paginator
    this.proposalService.proposals$.pipe(take(1)).subscribe(() => {
      // waiting for `proposals$` required for initial value from queryParams
      this.proposalService.page$.subscribe((page) => {
        // `getPage` (?!) + timeout + `detectChanges()` required so that paginatorComponent gets updated
        this.paginatorComponent.getPage(page);
        setTimeout(() => this.cdr.detectChanges());
      });
    });
  }

  onToggleTOCColumnCollapsed() {
    this.isFilterCollapsed = !this.isFilterCollapsed;
  }

  resetFilter() {
    this.filtersComponent.resetFilters();
  }

  handlePagerChange($event: EuiPaginationEvent) {
    this.proposalService.setLimit($event.pageSize);
    this.proposalService.setPage($event.page);
  }

  toggleSortOrder() {
    this.proposalService.setSortOrder(!this.sortOrder);
  }

  private applyQueryParams(paramsMap: ParamMap) {
    const { filters, limit, page } =
      ProposalsComponent.queryParamsToState(paramsMap);

    this.proposalService.setFilters(filters);
    this.proposalService.setLimit(limit);
    this.proposalService.setPage(page);
  }

  private setQueryParams(queryParams: Params) {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: '',
    });
  }
}
