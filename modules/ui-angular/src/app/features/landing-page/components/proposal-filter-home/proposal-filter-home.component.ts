import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import {
  DEFAULT_SORT_ORDER,
  ProposalFilter,
} from '@/features/proposals/models';
import { ProposalService } from '@/shared/services/proposal.service';

type ProposalsState = {
  filters: ProposalFilter;
  sortOrder: boolean;
  limit: number;
  page: number;
};

@Component({
  selector: 'app-proposal-filter-home',
  templateUrl: './proposal-filter-home.component.html',
  styleUrls: ['./proposal-filter-home.component.scss'],
})
export class ProposalFilterHomeComponent implements OnInit {
  sortOrder = DEFAULT_SORT_ORDER;
  @Output() searchInitiation: EventEmitter<string | null> = new EventEmitter();
  searchTerm = '';
  private destroy$ = new Subject<void>();

  constructor(
    private proposalService: ProposalService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  buttonWatchForChanges() {
    this.searchInitiation.emit(this.searchTerm || null);
  }

  resetFilters() {
    this.proposalService.setFilters({
      searchTerm: '',
    });
  }

  toggleSortOrder() {
    this.sortOrder = !this.sortOrder;
    this.proposalService.setSortOrder(this.sortOrder);
  }

  workspaceRoute() {
    this.router.navigate(['/workspace']);
  }
}
