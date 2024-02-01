import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { EuiDialogComponent } from '@eui/components/eui-dialog';
import { UxAppShellService } from '@eui/core';
import { TranslateService } from '@ngx-translate/core';

import { ContributionStatus } from '@/shared';
import { ContributionVO } from '@/shared/models/contribution-vo.model';
import { DocumentService } from '@/shared/services/document.service';

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

  constructor(
    public documentService: DocumentService,
    private translate: TranslateService,
    private appShellService: UxAppShellService,
  ) {}

  ngOnInit(): void {}

  onContributionDecline(
    version: string,
    versionNumber: { major: number; intermediate: number; minor: number },
  ) {
    this.translate
      .get('page.editor.contribution.decline.modal-text-version', {
        versionNumber: `${versionNumber.major}.${versionNumber.intermediate}.${versionNumber.minor}`,
      })
      .subscribe((res) => {
        this.versionModalText = res;
      });
    this.versionToDecline = version;
    this.declineContributionDialog.openDialog();
  }

  onClickViewAndMerge(contribution: ContributionVO) {
    this.documentService.viewAndMergeContribution(contribution);
    this.documentService.updateProcessedStatus(false, contribution);
  }

  onClickSendFeedback(contribution: ContributionVO) {
    // do nothing for the moment
  }
  onClickApplyAllChanges(contribution: ContributionVO) {
    // do nothing for the moment
  }

  onClickApplyAllWithTrackChanges(contribution: ContributionVO) {
   // do nothing for the moment
 }
  onClickMarkAsProcessed(contribution: ContributionVO) {
    this.documentService.toggleIsContributionDeclinedOrProcessed();
    this.markContributionAsProcessedDialog.openDialog();
  }

  onClickView(contribution: ContributionVO) {
    this.documentService.viewAndMergeContribution(contribution);
    this.documentService.updateProcessedStatus(true, contribution);
  }

  onAccept() {
    this.documentService.declineContribution(this.contribution);
    this.documentService.updateProcessedStatus(true, this.contribution);
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
    this.documentService.toggleIsContributionDeclinedOrProcessed();
    this.markContributionAsProcessedDialog.closeDialog();
  }

  onAcceptMarkContributionAsProcessed() {
      this.documentService
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
            this.documentService.getContributions();
            this.documentService.setIsContributionDeclinedOrProcessed(true);
            this.documentService.updateProcessedStatus(true, this.contribution);
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
