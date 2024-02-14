import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { EuiDialogComponent } from '@eui/components/eui-dialog';
import { UxAppShellService } from '@eui/core';
import { TranslateService } from '@ngx-translate/core';

import { MergeContributionsService } from '@/features/akn-document/services/merge-contributions.service';
import { ContributionStatus } from '@/shared';
import { ContributionVO } from '@/shared/models/contribution-vo.model';

@Component({
  selector: 'app-revision-actions-dropdown',
  templateUrl: './revision-actions-dropdown.component.html',
  styleUrls: ['./revision-actions-dropdown.component.scss'],
})
export class RevisionActionsDropdownComponent implements OnInit {
  @Input() contribution: ContributionVO;
  @ViewChild('declineContributionDialog')
  declineContributionDialog: EuiDialogComponent;
  @ViewChild('markContributionAsProcessedDialog')
  markContributionAsProcessedDialog: EuiDialogComponent;
  versionModalText: string;
  versionToDecline = '';
  ContributionStatus = ContributionStatus;
  processed = false;
  contributionPaneOpened = false;

  constructor(
    protected mergeContributionsService: MergeContributionsService,
    private translate: TranslateService,
    private appShellService: UxAppShellService,
  ) {}

  ngOnInit(): void {
    this.mergeContributionsService.contributionModeEnabled$.subscribe(
      (enabled) => {
        this.contributionPaneOpened = enabled;
      },
    );
  }

  onClickSendFeedback(contribution: ContributionVO) {
    // do nothing for the moment
  }

  onClickApplyAllChanges(contribution: ContributionVO) {
    // do nothing for the moment
  }

  onClickApplyAllChangesWithTC(contribution: ContributionVO) {
    // do nothing for the moment
  }

  onClickMarkAsProcessed(contribution: ContributionVO) {
    this.mergeContributionsService.toggleIsContributionDeclinedOrProcessed();
    this.markContributionAsProcessedDialog.openDialog();
  }

  onAccept() {
    this.mergeContributionsService.declineContribution(this.contribution);
    this.mergeContributionsService.updateProcessedStatus(
      true,
      this.contribution,
    );
    this.declineContributionDialog.closeDialog();
    this.versionToDecline = '';
    this.versionModalText = '';
  }

  onCancel() {
    this.declineContributionDialog.closeDialog();
    this.versionToDecline = '';
    this.versionModalText = '';
  }

  onCancelMarkContributionAsProcessed() {
    this.mergeContributionsService.toggleIsContributionDeclinedOrProcessed();
    this.markContributionAsProcessedDialog.closeDialog();
  }

  onAcceptMarkContributionAsProcessed() {
    this.mergeContributionsService
      .markContributionAsProcessed(this.contribution)
      .subscribe({
        next: (res) => {
          this.appShellService.growl({
            severity: 'success',
            summary: this.translate.instant(
              'global.notifications.title.success',
            ),
            detail: this.translate.instant(
              'page.editor.contribution.mark-as-processed-message-success',
            ),
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
          this.mergeContributionsService.getContributions();
          this.mergeContributionsService.setIsContributionDeclinedOrProcessed(
            true,
          );
          this.mergeContributionsService.updateProcessedStatus(
            true,
            this.contribution,
          );
        },
        error: (res) => {
          this.appShellService.growl({
            severity: 'danger',
            summary: this.translate.instant(
              'page.editor.contribution.mark-as-processed-message-error',
            ),
            detail: res,
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
        },
      });
    this.markContributionAsProcessedDialog.closeDialog();
  }
}
