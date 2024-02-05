import { Component, Input, OnInit, SecurityContext} from '@angular/core';
import { Document } from '@leos/shared';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-proposal-item',
  templateUrl: './proposal-item.component.html',
  styleUrls: ['./proposal-item.component.scss'],
})
export class ProposalItemComponent implements OnInit {
  @Input() proposal: Document;
  @Input() status: string | null;
  @Input() originRef: string | null;

  title: string;

  constructor(private translateService: TranslateService, private domSanitizer: DomSanitizer) {}

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
