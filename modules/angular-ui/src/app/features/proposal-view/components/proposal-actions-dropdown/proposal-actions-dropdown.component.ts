import { Component, Input } from '@angular/core';
import { UxAppShellService } from '@eui/core';

import { ProposalDetailsService } from '../../services/proposal-details.service';

@Component({
  selector: 'app-proposal-actions-dropdown',
  templateUrl: './proposal-actions-dropdown.component.html',
  styleUrls: ['./proposal-actions-dropdown.component.scss'],
})
export class ProposalActionsDropdownComponent {
  @Input() proposalId: string;
  loading = false;
  constructor(
    private proposalDetailsService: ProposalDetailsService,
    private uxService: UxAppShellService,
  ) {}

  handleDownload() {
    this.proposalDetailsService.donwloadProposal();
  }

  handleExport() {
    this.proposalDetailsService.exportProposal('PDF');
  }

  handleShare() {
    console.warn('stub:', 'handleShare'); // FIXME
  }

  handleDelete() {
    this.proposalDetailsService.deleteProposal();
  }
}
