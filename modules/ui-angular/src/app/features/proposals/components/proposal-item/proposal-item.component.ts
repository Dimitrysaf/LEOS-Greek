import { Component, Input, OnInit } from '@angular/core';
import { Document } from '@leos/shared';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-proposal-item',
  templateUrl: './proposal-item.component.html',
  styleUrls: ['./proposal-item.component.scss'],
})
export class ProposalItemComponent implements OnInit {
  @Input() proposal: Document;
  @Input() status: string;

  constructor(private tranlsateService: TranslateService) {}

  ngOnInit() {
    console.log('[ProposalItemComponent] proposal => ', this.proposal);
  }

  getStatus(status: string) {
    return status === 'ready'
      ? this.tranlsateService.instant(
          'page.workspace.proposal-item.ready-status',
        )
      : this.tranlsateService.instant(
          'page.workspace.proposal-item.sent-status',
        );
  }
}
