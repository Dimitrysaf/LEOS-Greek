import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
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

  mailtoHeader = 'mailto:?';
  subjectProp = 'subject=';
  bodyProp = 'body=';
  amp = '&amp;';
  breakStr = '%0D%0A';

  constructor(
    private proposalDetailsService: ProposalDetailsService,
    private sanitizer: DomSanitizer,
    private router: Router,
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

  getStringifiedMailTo() {
    const activeUrl = window.location.href;
    const url = `${this.mailtoHeader}${this.subjectProp}Shared Proposal&${this.bodyProp}${activeUrl}`;
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
