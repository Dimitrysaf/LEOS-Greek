import { ProposalsFiltersComponent } from '@/features/proposals/components';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  DEFAULT_SORT_ORDER,
  ProposalFilter,
} from '@/features/proposals/models';
import { Document } from '@/shared';
import { ProposalService } from '@/shared/services/proposal.service';
import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  EuiPaginationEvent,
  EuiPaginatorComponent,
} from '@eui/components/eui-paginator';
import {
  Observable,
  Subject,
  combineLatest,
  distinctUntilChanged,
  map,
  takeUntil,
} from 'rxjs';
import { PackagesRecentlyChanged } from '../../models/packages-recent-changed.model';

export const PACKAGES_PAGE_SIZE = 4;
type ProposalsState = {
  filters: ProposalFilter;
  sortOrder: boolean;
  limit: number;
  page: number;
};
@Component({
  selector: 'app-proposal-home-card',
  templateUrl: './proposal-home-card.component.html',
  styleUrls: ['./proposal-home-card.component.scss'],
})
export class ProposalHomeCardComponent implements OnInit {
  @Input() iconClass: string;
  @Input() labelKey: string;
  @Input() proposals: Document[];
  @Input() packages: PackagesRecentlyChanged[];
  @Input() searchTerm: string;
  @ViewChild('paginatorComponent')
  paginatorComponent: EuiPaginatorComponent;
  @ViewChild('paginatorComponentPackages')
  paginatorComponentPackages: EuiPaginatorComponent;
  @ViewChild('filters')
  filtersComponent: ProposalsFiltersComponent;
  displayedPackages: PackagesRecentlyChanged[] = [];
  currentPackagesPage;
  packagesPageSize = PACKAGES_PAGE_SIZE;
  sortOrder = DEFAULT_SORT_ORDER;
  showHeader = true;
  filters$: Observable<ProposalFilter>;
  limit$: Observable<number>;
  page$: Observable<number>;
  totalResults$: Observable<number>;
  private destroy$: Subject<any> = new Subject();

  constructor(
    private proposalService: ProposalService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.totalResults$ = this.proposalService.totalResults$;
    this.filters$ = this.proposalService.filters$;
    this.page$ = this.proposalService.page$;
    this.limit$ = this.proposalService.limit$;
  }

  ngOnInit() {
    this.proposalService.sortOrder$
      .pipe(takeUntil(this.destroy$))
      .subscribe((so) => (this.sortOrder = so));

    combineLatest({
      filters: this.proposalService.filters$,
      sortOrder: this.proposalService.sortOrder$,
      limit: this.proposalService.limit$,
      page: this.proposalService.page$,
    })
      .pipe(
        map(ProposalHomeCardComponent.stateToQueryParams),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      )
      .subscribe((params) => {
        this.setQueryParams(params);
      });
    this.updateDisplayedPackages();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.packages) {
      this.updateDisplayedPackages();
    }
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

  private setQueryParams(queryParams: Params) {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: '',
    });
  }

  get shouldShowIcon(): boolean {
    return !!this.iconClass;
  }

  toggleHeaderVisibility() {
    console.log(this.showHeader);
    this.showHeader = !this.showHeader;
  }

  toggleSortOrder() {
    this.proposalService.setSortOrder(!this.sortOrder);
  }

  trackProposal(_index: number, proposal: Document) {
    return proposal?.id ?? undefined;
  }

  geContributionStatus(proposal: Document) {
    const contributionStatus =
      proposal.cloneProposalMetadataVO?.revisionStatus ===
      'Sent for contribution'
        ? 'sent'
        : 'ready';

    return proposal.cloneProposalMetadataVO !== null
      ? contributionStatus
      : null;
  }

  handlePagerChange($event: EuiPaginationEvent) {
    this.proposalService.setLimit($event.pageSize);
    this.proposalService.setPage($event.page);
  }

  handlePackagePagerChange($event: EuiPaginationEvent): void {
    this.currentPackagesPage = $event.page;
    this.packagesPageSize = $event.pageSize;
    this.updateDisplayedPackages();
  }

  updateDisplayedPackages(): void {
    const start = this.currentPackagesPage * this.packagesPageSize;
    const end = start + this.packagesPageSize;
    this.displayedPackages = [...(this.packages || []).slice(start, end)];
  }

  protected readonly DEFAULT_SORT_ORDER = DEFAULT_SORT_ORDER;
}
