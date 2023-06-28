import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { AddMilestoneDialogComponent } from '@/features/proposal-view/components/add-milestone-dialog/add-milestone-dialog.component';
import { MilestoneAnnotationWarningModalComponent } from '@/features/proposal-view/components/milestone-annotation-warning-modal/milestone-annotation-warning-modal.component';
import { Milestone } from '@/features/proposal-view/models/milestone.model';
import { ProposalDetailsService } from '@/features/proposal-view/services/proposal-details.service';
import { Document, Permission } from '@/shared';
import {
  MilestoneDescriptor,
  ProposalMilestoneViewComponent,
} from '@/shared/components/proposal-milestone-view/proposal-milestone-view.component';

import { ProposalMilestoneSendCopyDialogComponent } from '../proposal-milestone-send-copy-dialog/proposal-milestone-send-copy-dialog.component';

enum MilestoneStatus {
  Ready = 'FILE_READY',
  ContributionSent = 'CONTRIBUTION_SENT',
  InPreparation = 'IN_PREPARATION',
}

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
  openMilestoneViewDialogVisible = false;
  sendCopyDialogVisible = false;
  annotationWarningDialogVisible = false;
  @ViewChild('milestoneViewDialog')
  milestoneViewDialog: ProposalMilestoneViewComponent;
  @ViewChild('sendMilestoneCopyForContributionDialog')
  sendMilestoneCopyForContributionDialog: ProposalMilestoneSendCopyDialogComponent;
  @ViewChild('milestoneAnnotationWarningModal')
  milestoneAnnotationWarningModal: MilestoneAnnotationWarningModalComponent;
  milestoneViewData: MilestoneDescriptor = null;
  proposalRef: string;
  dataSource: Milestone[] = [];
  permissions: Permission[];
  milestoneStatus = MilestoneStatus;

  destroy$: Subject<any> = new Subject();

  constructor(
    protected proposalDetailsService: ProposalDetailsService,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.proposalDetailsService.milestones$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (milestones) => {
          this.dataSource = this.initMilestonesDataSource(milestones);
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

  openAnnotationWarningModal(): void {
    this.annotationWarningDialogVisible = true;
    setTimeout(() => this.milestoneAnnotationWarningModal.open(), 0);
  }

  acceptAnnotationWarningModal(): void {
    this.annotationWarningDialogVisible = false;
    this.openAddMilestoneDialog();
  }

  dismissAnnotationWarningModal(): void {
    this.annotationWarningDialogVisible = false;
  }

  openAddMilestoneDialog(): void {
    this.addMilestoneDialogVisible = true;
    setTimeout(() => this.addMilestoneDialog.open(), 0);
  }

  onAddMilestoneDialogClosed() {
    this.addMilestoneDialogVisible = false;
  }

  openMilestoneViewDialog(milestone: MilestoneDescriptor): void {
    this.openMilestoneViewDialogVisible = true;
    this.milestoneViewData = milestone;
    setTimeout(() => this.milestoneViewDialog.open(), 0);
  }

  onMilestoneViewDialogClosed() {
    this.openMilestoneViewDialogVisible = false;
    this.milestoneViewData = null;
  }

  openMilestoneSendCopyForContributionDialog(milestone: MilestoneDescriptor) {
    this.sendCopyDialogVisible = true;
    this.milestoneViewData = milestone;
    setTimeout(() => this.sendMilestoneCopyForContributionDialog.open(), 0);
  }

  onMilestoneSendCopyForContributionDialogClosed() {
    this.sendCopyDialogVisible = false;
    this.milestoneViewData = null;
  }

  openSendContributionForRevision(milestone: MilestoneDescriptor) {
    this.proposalDetailsService.sendRevisionForMerge(milestone);
  }

  getStatus(status: MilestoneStatus) {
    switch (status) {
      case MilestoneStatus.Ready:
        return this.translateService.instant(
          'page.workspace.milestones.status.file-ready',
        );
      case MilestoneStatus.ContributionSent:
        return this.translateService.instant(
          'page.workspace.milestones.status.contribution-sent',
        );
      case MilestoneStatus.InPreparation:
        return this.translateService.instant(
          'page.workspace.milestones.status.in-preparation',
        );
      default:
        return status;
    }
  }

  private initMilestonesDataSource(milestones: Milestone[]): Milestone[] {
    milestones.forEach((milestone) => {
      if (milestone.clonedMilestones !== null) {
        milestone.opened = true;
        milestone.clonedMilestones = milestone.clonedMilestones.map(
          (clonedMilestone) =>
            this.formatClonedMilestoneUpdatedDate(clonedMilestone),
        );
      }
    });

    return milestones;
  }

  private formatClonedMilestoneUpdatedDate(
    clonedMilestone: Milestone,
  ): Milestone {
    clonedMilestone.updatedDate = new Date(
      clonedMilestone.createdDate.replace(
        /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
        '$3-$2-$1T$4:$5:$6',
      ),
    ).getTime();

    return clonedMilestone;
  }
}
