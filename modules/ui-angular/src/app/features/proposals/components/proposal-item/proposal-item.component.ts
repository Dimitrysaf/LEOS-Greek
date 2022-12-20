import { Component, Input, OnInit } from '@angular/core';
import { Document } from '@leos/shared';

@Component({
  selector: 'app-proposal-item',
  templateUrl: './proposal-item.component.html',
  styleUrls: ['./proposal-item.component.scss'],
})
export class ProposalItemComponent implements OnInit {
  @Input() proposal: Document;
  @Input() status: string;

  constructor() {}

  ngOnInit() {
    console.log('[ProposalItemComponent] proposal => ', this.proposal);
  }
}
