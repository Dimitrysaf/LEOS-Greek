import { Component, Input } from '@angular/core';
import { Document } from '@leos/shared';

@Component({
  selector: 'app-proposals-list',
  templateUrl: './proposals-list.component.html',
  styleUrls: ['./proposals-list.component.scss'],
})
export class ProposalsListComponent {
  @Input() proposals: Document[];
  constructor() {}

  trackProposal(index: number, proposal: any) {
    return proposal ? proposal.id : undefined;
  }
}
