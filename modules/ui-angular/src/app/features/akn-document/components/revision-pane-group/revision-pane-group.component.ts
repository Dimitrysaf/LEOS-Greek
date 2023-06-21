import { Component, Input, OnInit } from '@angular/core';
import * as cluster from 'cluster';

import { Version } from '@/features/akn-document/models';
import { ContributionVO } from '@/shared/models/contribution-vo.model';

@Component({
  selector: 'app-revision-pane-group',
  templateUrl: './revision-pane-group.component.html',
  styleUrls: ['./revision-pane-group.component.scss'],
})
export class RevisionPaneGroupComponent implements OnInit {
  @Input() contribution: ContributionVO;
  revisionVersion: string;
  //fixme this should not be hardcoded but provided in the contribution
  originatingApplication = 'LEOS';
  revisionTitle: string;
  updatedAtBy: string;
  status: string;

  constructor() {}

  ngOnInit(): void {
    this.revisionTitle = this.formatTitle(this.contribution);
    this.revisionVersion = this.formatVersionNumber(this.contribution);
  }

  protected formatVersionNumber(contribution: ContributionVO): string {
    return `${contribution.versionNumber[0]}.${contribution.versionNumber[1]}.${contribution.versionNumber[2]}`;
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
