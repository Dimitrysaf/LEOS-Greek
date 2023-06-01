import { Component, Input } from '@angular/core';
import { Document } from '@leos/shared';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-proposals-list',
  templateUrl: './proposals-list.component.html',
  styleUrls: ['./proposals-list.component.scss'],
})
export class ProposalsListComponent {
  @Input() proposals: Document[];
  constructor(private translateService: TranslateService) {}

  trackProposal(_index: number, proposal: Document) {
    return proposal?.id ?? undefined;
  }

  geContributionStatus(proposal: Document) {
    const contributionStatus =
      proposal.cloneProposalMetadataVO?.revisionStatus ===
      'Sent for contribution'
        ? 'sent'
        : 'ready';

    return proposal.cloneProposalMetadataVO !== null
      ? contributionStatus
      : null;
  }
}
