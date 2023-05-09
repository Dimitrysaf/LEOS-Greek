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

  constructor(private translateService: TranslateService) {}

  ngOnInit() {}

  getStatus(status: string) {
    return status === 'ready'
      ? this.translateService.instant(
          'page.workspace.proposal-item.ready-status',
        )
      : this.translateService.instant(
          'page.workspace.proposal-item.sent-status',
        );
  }
}
