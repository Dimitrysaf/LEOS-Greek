import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { EuiDialogComponent } from '@eui/components/eui-dialog';
import { TranslateService } from '@ngx-translate/core';

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
  versionModalText: string;
  versionToDecline = '';

  constructor(
    public documentService: DocumentService,
    private translate: TranslateService,
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
  }

  onClickView(contribution: ContributionVO) {
    this.documentService.viewAndMergeContribution(contribution);
    this.documentService.updateProcessedStatus(true);
  }

  onAccept() {
    this.documentService.declineContribution(this.contribution);
    this.documentService.updateProcessedStatus(true);
    this.declineContributionDialog.closeDialog();
    this.versionToDecline = '';
    this.versionModalText = '';
  }

  onCancel() {
    this.declineContributionDialog.closeDialog();
    this.versionToDecline = '';
    this.versionModalText = '';
  }
}
