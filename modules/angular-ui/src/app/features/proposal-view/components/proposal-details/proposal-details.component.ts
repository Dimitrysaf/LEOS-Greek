import { Component, Input } from '@angular/core';
import { Document } from '@leos/shared';

@Component({
  selector: 'app-proposal-details',
  templateUrl: './proposal-details.component.html',
  styleUrls: ['./proposal-details.component.scss'],
})
export class ProposalDetailsComponent {
  @Input() proposal: Document;

  constructor() {}
}
