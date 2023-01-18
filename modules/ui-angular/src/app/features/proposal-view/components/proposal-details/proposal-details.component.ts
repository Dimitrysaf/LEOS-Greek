import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Document } from '@leos/shared';

@Component({
  selector: 'app-proposal-details',
  templateUrl: './proposal-details.component.html',
  styleUrls: ['./proposal-details.component.scss'],
})
export class ProposalDetailsComponent implements OnInit {
  @Input() proposal: Document;

  eeaRelevance: boolean;
  constructor() {}
  ngOnInit(): void {
    this.eeaRelevance = this.proposal.metadata.eeaRelevance;
  }

  handleEEAChange(e) {
    console.log('hey');
  }
}
