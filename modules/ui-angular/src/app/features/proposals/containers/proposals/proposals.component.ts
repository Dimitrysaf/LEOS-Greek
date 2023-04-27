import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import {
  EuiPaginationEvent,
  EuiPaginatorComponent,
} from '@eui/components/eui-paginator';
import { EuiBreadcrumbService } from '@eui/components/layout';
import { ProcedureType } from '@leos/shared';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, distinctUntilChanged, map, take } from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';

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
  providers: [ProposalService],
})
export class ProposalsComponent implements OnInit, AfterViewInit {
  isFilterCollapsed = false;
  filters$ = this.proposalService.filters$;
  page$ = this.proposalService.page$;
  limit$ = this.proposalService.limit$;
  proposals$ = this.proposalService.proposals$;
  totalResults$ = this.proposalService.totalResults$;
  sortOrder = DEFAULT_SORT_ORDER;
  canCreateDraft = false;
  canCreateMandate = false;
  canCreateProposal = false;
  canUpload = false;

  @ViewChild('paginatorComponent')
  paginatorComponent: EuiPaginatorComponent;
  @ViewChild('filters') filtersComponent: ProposalsFiltersComponent;

  protected readonly homeUrl = document.baseURI;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private proposalService: ProposalService,
    private cdr: ChangeDetectorRef,
    private appConfig: AppConfigService,
    public breadcrumbService: EuiBreadcrumbService,
    public translateService: TranslateService,
  ) {}

  ngAfterViewInit(): void {
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

  ngOnInit(): void {
    this.manageBreadCrumbsRepository();
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
    this.setPermissions();
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

  private setPermissions() {
    this.appConfig.config.subscribe((config) => {
      const CN = process.env.NG_APP_LEOS_INSTANCE === 'cn';
      const CAN_UPLOAD = config.permissions.includes('CAN_UPLOAD');
      this.canCreateDraft = CN && CAN_UPLOAD;
      this.canCreateMandate = CN;
      this.canCreateProposal = !CN;
      this.canUpload = !CN && CAN_UPLOAD;
    });
  }

  private manageBreadCrumbsRepository() {
    this.breadcrumbService.setBreadcrumb([
      {
        id: 'home',
        label: this.translateService.instant('global.breadcrumb.proposals'),
        link: null,
      },
    ]);
  }
}
