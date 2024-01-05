import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UxAppShellService } from '@eui/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';
import { AddMilestoneDialogComponent } from '@/features/proposal-view/components/add-milestone-dialog/add-milestone-dialog.component';
import { MilestoneAnnotationWarningModalComponent } from '@/features/proposal-view/components/milestone-annotation-warning-modal/milestone-annotation-warning-modal.component';
import {
  Milestone,
  MilestoneStatus,
} from '@/features/proposal-view/models/milestone.model';
import { ProposalDetailsService } from '@/features/proposal-view/services/proposal-details.service';
import { Document, LeosAppConfig, Permission } from '@/shared';
import {
  MilestoneDescriptor,
  ProposalMilestoneViewComponent,
} from '@/shared/components/proposal-milestone-view/proposal-milestone-view.component';
import { ProposalMilestonesService } from '@/shared/services/proposal-milestones.service';

import { ProposalMilestoneSendCopyDialogComponent } from '../proposal-milestone-send-copy-dialog/proposal-milestone-send-copy-dialog.component';

const MILESTONE_RELOAD_INTERVAL = 10000;
@Component({
  selector: 'app-proposal-milestones',
  templateUrl: './proposal-milestones.component.html',
  styleUrls: ['./proposal-milestones.component.scss'],
})
export class ProposalMilestonesComponent implements OnInit, OnDestroy {
  @Input() proposal: Document;
  @Input() proposalRef: string;
  @ViewChild('addMilestoneDialog')
  addMilestoneDialog: AddMilestoneDialogComponent;
  addMilestoneDialogVisible = false;
  openMilestoneViewDialogVisible = false;
  sendCopyDialogVisible = false;
  annotationWarningDialogVisible = false;
  viewContribution= true;
  @ViewChild('milestoneViewDialog')
  milestoneViewDialog: ProposalMilestoneViewComponent;
  @ViewChild('sendMilestoneCopyForContributionDialog')
  sendMilestoneCopyForContributionDialog: ProposalMilestoneSendCopyDialogComponent;
  @ViewChild('milestoneAnnotationWarningModal')
  milestoneAnnotationWarningModal: MilestoneAnnotationWarningModalComponent;
  milestoneViewData: MilestoneDescriptor = null;
  dataSource: Milestone[] = [];
  permissions: Permission[];
  milestoneStatus = MilestoneStatus;

  private milestonesCheckTimer: ReturnType<typeof setTimeout>;
  private milestonesStatus = {
    inPreparation: 0,
    error: 0,
    ready: 0,
  };
  private destroy$: Subject<any> = new Subject();

  constructor(
    protected proposalDetailsService: ProposalDetailsService,
    private translateService: TranslateService,
    private uxAppService: UxAppShellService,
    private proposalMilestonesService: ProposalMilestonesService,
    private appConfigService: AppConfigService,
  ) {}

  ngOnInit(): void {
    let firstLoad = true;

    this.appConfigService.config.subscribe((config: LeosAppConfig) => {
      this.viewContribution = config.showRevisionEnabled;
    });

    this.proposalDetailsService.milestones$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (milestones) => {
          this.dataSource = this.initMilestonesDataSource(
            milestones,
            !firstLoad,
          );
          firstLoad = false;
          milestones.forEach((milestone) => {
            if (milestone.clonedMilestones && !this.proposal.cloneProposalMetadataVO?.clonedProposal) {
              this.proposalDetailsService.clonedProposalCount = milestone.clonedMilestones.length;
            }
          })
        },
        error: (error) => {
          this.uxAppService.growl({
            severity: 'danger',
            summary: this.translateService.instant(
              'page.collection.milestones.load-milestones.error',
            ),
            detail: error.error,
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
        },
      });

    this.proposalDetailsService.permissions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((perms) => (this.permissions = perms));
  }

  ngOnDestroy(): void {
    clearTimeout(this.milestonesCheckTimer);
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
    this.proposalDetailsService.clonedProposalCount = 0;
  }

  openAnnotationWarningModal(milestone: MilestoneDescriptor): void {
    this.annotationWarningDialogVisible = true;
    this.milestoneViewData = milestone;
    setTimeout(() => this.milestoneAnnotationWarningModal.open(), 0);
  }

  acceptAnnotationWarningModal(): void {
    this.annotationWarningDialogVisible = false;
    this.openSendContributionForRevision(this.milestoneViewData);
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

  onDownloadMilestone(milestone: Milestone) {
    if(milestone?.legFileId){
      this.proposalMilestonesService.downloadLegFile(milestone?.legFileId)
    }
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
      case MilestoneStatus.ReadyToMerge:
        return this.translateService.instant(
          'page.workspace.proposal-item.ready-status'
        );
      default:
        return status;
    }
  }

  private initMilestonesDataSource(
    milestones: Milestone[],
    showGrowl: boolean,
  ): Milestone[] {
    const countByStatus = (s: MilestoneStatus) =>
      milestones.filter((m) => m.status === s).length;

    const milestonesStatus = {
      inPreparation: countByStatus(MilestoneStatus.InPreparation),
      error: countByStatus(MilestoneStatus.Error),
      ready: countByStatus(MilestoneStatus.Ready),
    };
    const lessInPreparation =
      milestonesStatus.inPreparation < this.milestonesStatus.inPreparation;
    const notMoreErrors = milestonesStatus.error <= this.milestonesStatus.error;

    clearTimeout(this.milestonesCheckTimer);

    if (milestonesStatus.inPreparation) {
      this.milestonesCheckTimer = setTimeout(
        () => this.proposalDetailsService.reloadMilestones(),
        MILESTONE_RELOAD_INTERVAL,
      );
    }

    const assumeMilestoneTurnedReady = lessInPreparation && notMoreErrors;
    if (assumeMilestoneTurnedReady && showGrowl) {
      this.uxAppService.growl({
        severity: 'success',
        summary: this.translateService.instant(
          'global.notifications.title.success',
        ),
        detail: this.translateService.instant(
          'page.collection.milestones.check-for-milestone-status-change.success',
        ),
        life: 3000,
        isGrowlSticky: false,
        position: 'bottom-right',
      });
    }

    milestones
      .filter((m) => m.clonedMilestones !== null)
      .forEach((milestone) => {
        milestone.opened = true;
        milestone.clonedMilestones.forEach(
          this.formatClonedMilestoneUpdatedDate,
        );
      });

    this.milestonesStatus = milestonesStatus;

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

  updateReadyToMergeStatus(milestone: Milestone): void {
    this.proposalMilestonesService.updateReadyToMergeStatus(milestone.status);
    this.openMilestoneViewDialog(milestone);
  }

  isReadyToMerge(status: MilestoneStatus): boolean {
    const readyToMergeTranslation = this.translateService.instant('page.workspace.proposal-item.ready-status');
    return this.getStatus(status) === readyToMergeTranslation;
  }
}
