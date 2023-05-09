import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { AddMilestoneDialogComponent } from '@/features/proposal-view/components/add-milestone-dialog/add-milestone-dialog.component';
import { Milestone } from '@/features/proposal-view/models/milestone.model';
import { ProposalDetailsService } from '@/features/proposal-view/services/proposal-details.service';
import { Document, Permission } from '@/shared';
import {
  MilestoneDescriptor,
  ProposalMilestoneViewComponent,
} from '@/shared/components/proposal-milestone-view/proposal-milestone-view.component';

@Component({
  selector: 'app-proposal-milestones',
  templateUrl: './proposal-milestones.component.html',
  styleUrls: ['./proposal-milestones.component.scss'],
})
export class ProposalMilestonesComponent implements OnInit, OnDestroy {
  @Input() proposal: Document;
  @ViewChild('addMilestoneDialog')
  addMilestoneDialog: AddMilestoneDialogComponent;
  addMilestoneDialogVisible = false;
  @ViewChild('milestoneViewDialog')
  milestoneViewDialog: ProposalMilestoneViewComponent;
  milestoneViewData: MilestoneDescriptor = null;
  proposalRef: string;
  dataSource: Milestone[] = [];
  permissions: Permission[];

  destroy$: Subject<any> = new Subject();

  constructor(protected proposalDetailsService: ProposalDetailsService) {}

  ngOnInit(): void {
    this.proposalDetailsService.milestones$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (milestones) => {
          this.dataSource = milestones;
        },
        error: (error) => {
          console.log('Error => ', error);
        },
      });

    this.proposalDetailsService.permissions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((perms) => (this.permissions = perms));
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  openAddMilestoneDialog(): void {
    this.addMilestoneDialogVisible = true;
    setTimeout(() => this.addMilestoneDialog.open(), 0);
  }

  onAddMilestoneDialogClosed() {
    this.addMilestoneDialogVisible = false;
  }

  openMilestoneViewDialog(milestone: MilestoneDescriptor): void {
    this.milestoneViewData = milestone;
    setTimeout(() => this.milestoneViewDialog.open(), 0);
  }

  onMilestoneViewDialogClosed() {
    this.milestoneViewData = null;
  }
}
