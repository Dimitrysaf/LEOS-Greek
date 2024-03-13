import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

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
import { Document, ProcedureType } from '@/shared';
import { CreateProposalService } from '@/shared/services/create-proposal.service';
import { EnvironmentService } from '@/shared/services/enviroment.service';
import { ProposalService } from '@/shared/services/proposal.service';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { UserState } from '@eui/base';
import {
  EuiPaginationEvent,
  EuiPaginatorComponent,
} from '@eui/components/eui-paginator';
import { Store } from '@ngrx/store';
import {
  Observable,
  Subject,
  combineLatest,
  distinctUntilChanged,
  map,
  takeUntil,
} from 'rxjs';
import { PackagesRecentlyChanged } from '../../models/packages-recent-changed.model';
import { LandingPageService } from '../../services/landing-page.service';
import { PackagesFavourite } from '../../models/packages-favourite.model';

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
export class LandingPageComponent implements OnInit, OnDestroy {
  protected readonly homeUrl = document.baseURI;
  private destroy$: Subject<any> = new Subject();
  latestPackages$: Observable<PackagesRecentlyChanged[]>;
  favouritesPackages$: Observable<PackagesFavourite[]>;
  proposals$: Observable<Document[]>;
  limit$: Observable<number>;
  totalResults$: Observable<number>;
  sortOrder = DEFAULT_SORT_ORDER;
  public searchTerm: string;
  @ViewChild('paginatorComponent')
  paginatorComponent: EuiPaginatorComponent;
  @ViewChild('filters') filtersComponent: ProposalFilterHomeComponent;
  showProposalCard: boolean = false;
  canCreateDraft = false;
  canCreateMandate = false;
  canCreateProposal = false;
  canUpload = false;
  isCNInstance;
  userName: string;

  constructor(
    private store: Store<any>,
    protected createProposalService: CreateProposalService,
    private proposalService: ProposalService,
    private landingPageService: LandingPageService,
    private appConfig: AppConfigService,
    private router: Router,
    private route: ActivatedRoute,
    public environmentService: EnvironmentService,
  ) {
    this.limit$ = this.proposalService.limit$;
    this.proposals$ = this.proposalService.proposals$;
    this.latestPackages$ = this.landingPageService.findRecentPackagesForUser();
    this.favouritesPackages$ = this.landingPageService.findFavouritePackagesForUser();
    this.totalResults$ = this.proposalService.totalResults$;
    this.searchTerm = '';
  }
  ngOnInit() {
    this.proposalService.sortOrder$.subscribe((so) => (this.sortOrder = so));

    this.store
      .select('user')
      .pipe(takeUntil(this.destroy$))
      .subscribe((userState: UserState) => {
        this.userName = userState.firstName;
      });

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
    this.setPermissions();
  }

  private setPermissions() {
    this.appConfig.config.subscribe((config) => {
      const CN = process.env.NG_APP_LEOS_INSTANCE === 'cn';
      const CAN_UPLOAD = config.userAppPermissions.includes('CAN_UPLOAD');
      this.canCreateDraft = CN && CAN_UPLOAD;
      this.canCreateMandate = CN;
      this.canCreateProposal = !CN;
      this.canUpload = CAN_UPLOAD;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(null);
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
      this.proposalService.setFilters({ searchTerm: searchTerm });
      this.showProposalCard = true;
    } else {
      this.showProposalCard = false;
    }
  }

  resetFilter() {
    this.filtersComponent.resetFilters();
  }
}
