import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EuiDialogService } from '@eui/components/eui-dialog';
import { Subject, takeUntil } from 'rxjs';

import { AddMilestoneDialogComponent } from '@/features/proposal-view/components/add-milestone-dialog/add-milestone-dialog.component';
import { ProposalDetailsService } from '@/features/proposal-view/services/proposal-details.service';
import { Document } from '@/shared';

import { ProposalMilestoneViewComponent } from '../../components/proposal-milestone-view/proposal-milestone-view.component';
import { Milestone } from '../../models/milestone.model';
import { ProposalMilestonesService } from '../../services/proposal-milestones.service';

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
  milestoneViewData: Milestone = null;
  proposalRef: string;
  dataSource: Milestone[] = [];
  destroy$: Subject<any> = new Subject();

  constructor(
    private euiDialogService: EuiDialogService,
    private proposalMilestonesService: ProposalMilestonesService,
    protected proposalDetailsService: ProposalDetailsService,
  ) {}

  ngOnInit(): void {
    this.proposalDetailsService.milestones$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (milestones) => {
          console.log('Milestones => ', milestones);
          this.dataSource = milestones;
        },
        error: (error) => {
          console.log('Error => ', error);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  deleteMilestone(id: string) {
    console.log(`Delete milestone  ${id}`);
    this.proposalMilestonesService.deleteMilestone(id);
  }

  openAddMilestoneDialog(): void {
    this.addMilestoneDialogVisible = true;
    setTimeout(() => this.addMilestoneDialog.open(), 0);
  }

  onAddMilestoneDialogClosed() {
    this.addMilestoneDialogVisible = false;
  }

  openMilestoneViewDialog(milestone: Milestone): void {
    this.milestoneViewData = milestone;
    setTimeout(() => this.milestoneViewDialog.open(), 0);
  }

  onMilestoneViewDialogClosed() {
    this.milestoneViewData = null;
  }
}
