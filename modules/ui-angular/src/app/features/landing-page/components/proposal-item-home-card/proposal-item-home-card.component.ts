import { Component, Input, OnInit, SecurityContext } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-proposal-item-home-card',
  templateUrl: './proposal-item-home-card.component.html',
  styleUrls: ['./proposal-item-home-card.component.css'],
})
export class ProposalItemHomeCardComponent implements OnInit {
  @Input() proposal: any;
  @Input() status: string | null;
  @Input() originRef: string | null;

  title: string;
  constructor(
    private translateService: TranslateService,
    private domSanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.setItemTitle(this.proposal.title);
  }

  getStatus(status: string) {
    return status === 'ready'
      ? this.translateService.instant(
          'page.workspace.proposal-item.ready-status',
        )
      : this.translateService.instant(
          'page.workspace.proposal-item.sent-status',
        );
  }

  private setItemTitle(newTitle: any) {
    this.title = newTitle.replace(/<del[^>]*?>[\s\S]*?<\/del>/gi, '');
    this.title = this.title.replace(/<\/?ins[^>]*?>/gi, '');
    this.title =
      this.domSanitizer.sanitize(SecurityContext.HTML, this.title) || '';
  }
}
