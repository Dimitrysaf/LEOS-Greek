import { Component } from '@angular/core';

@Component({
  selector: 'app-proposal-actions-dropdown',
  templateUrl: './proposal-actions-dropdown.component.html',
  styleUrls: ['./proposal-actions-dropdown.component.scss'],
})
export class ProposalActionsDropdownComponent {
  constructor() {}

  handleDownload() {
    console.warn('stub:', 'handleDownload'); // FIXME
  }

  handleExport() {
    console.warn('stub:', 'handleExport'); // FIXME
  }

  handleShare() {
    console.warn('stub:', 'handleShare'); // FIXME
  }

  handleDelete() {
    console.warn('stub:', 'handleDelete'); // FIXME
  }
}
