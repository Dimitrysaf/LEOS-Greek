import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Document, Permission} from '@leos/shared';
import {ProposalDetailsService} from "@/features/proposal-view/services/proposal-details.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-proposal-details',
  templateUrl: './proposal-details.component.html',
  styleUrls: ['./proposal-details.component.scss'],
})
export class ProposalDetailsComponent implements OnInit, OnDestroy {
  @Input() proposal: Document;
  permissions: Permission[];
  @Output() eeaRelevanceChanged: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  eeaRelevance: boolean;
  destroy$: Subject<any> = new Subject();
  constructor(protected detailsService: ProposalDetailsService,) {
    this.detailsService.permissions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((perms) => (this.permissions = perms));
  }
  ngOnInit(): void {
    this.eeaRelevance = this.proposal.metadata.eeaRelevance;
  }

  handleEEAChange(e: boolean) {
    this.eeaRelevanceChanged.emit(e);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
