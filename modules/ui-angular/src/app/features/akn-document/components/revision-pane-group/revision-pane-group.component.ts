import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ContributionVO } from '@/shared/models/contribution-vo.model';

@Component({
  selector: 'app-revision-pane-group',
  templateUrl: './revision-pane-group.component.html',
  styleUrls: ['./revision-pane-group.component.scss'],
})
export class RevisionPaneGroupComponent implements OnInit {
  @Input() contribution: ContributionVO;
  revisionVersion: string;
  originatingApplication: string;
  revisionTitle: string;
  updatedAtBy: string;
  status: string;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.revisionTitle = this.formatTitle(this.contribution);
    this.revisionVersion = this.formatVersionNumber(this.contribution);
    this.originatingApplication = this.contribution.contributionCreator;
    this.status = this.contributionStatusTooltipText(this.contribution);
  }

  protected formatVersionNumber(contribution: ContributionVO): string {
    return `${contribution.versionNumber.major}.${contribution.versionNumber.intermediate}.${contribution.versionNumber.minor}`;
  }

  protected formatTitle(contribution: ContributionVO): string {
    if (contribution.checkinCommentVO.checkinElement) {
      return (
        contribution.checkinCommentVO.checkinElement.elementLabel +
        ' ' +
        contribution.checkinCommentVO.checkinElement.actionType.toLowerCase()
      );
    } else {
      return contribution.checkinCommentVO.title;
    }
  }

  protected contributionStatusTooltipText(
    contribution: ContributionVO,
  ): string {
    return contribution.contributionStatus === 'RECEIVED'
      ? this.translate.instant(
          'page.workspace.proposal-item.contribution-received',
        )
      : this.translate.instant(
          'page.workspace.proposal-item.contribution-done',
        );
  }
}
