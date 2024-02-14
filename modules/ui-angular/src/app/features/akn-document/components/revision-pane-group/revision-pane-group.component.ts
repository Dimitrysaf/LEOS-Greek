import { Component, Input, OnInit } from '@angular/core';

import { MergeContributionsService } from '@/features/akn-document/services/merge-contributions.service';
import { ContributionStatus } from '@/shared';
import { ContributionVO } from '@/shared/models/contribution-vo.model';
import { DocumentService } from '@/shared/services/document.service';

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
  ContributionStatus = ContributionStatus;

  constructor(
    public documentService: DocumentService,
    public mergeContributionsService: MergeContributionsService,
  ) {}

  ngOnInit(): void {
    this.revisionTitle = this.formatTitle(this.contribution);
    this.revisionVersion = this.formatVersionNumber(this.contribution);
    this.originatingApplication = this.contribution.contributionCreator;
  }

  onClickView(contribution: ContributionVO) {
    if (
      contribution.contributionStatus === ContributionStatus.ContributionDone
    ) {
      this.mergeContributionsService.viewAndMergeContribution(contribution);
      this.mergeContributionsService.updateProcessedStatus(true, contribution);
    } else if (
      contribution.contributionStatus === ContributionStatus.Received
    ) {
      this.mergeContributionsService.viewAndMergeContribution(contribution);
      this.mergeContributionsService.updateProcessedStatus(false, contribution);
    }
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
}
