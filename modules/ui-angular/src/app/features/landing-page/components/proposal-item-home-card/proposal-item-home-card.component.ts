import { Component, Input, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { catchError, EMPTY } from 'rxjs';

import { Document } from '@/shared';
import { LandingPageService } from '../../services/landing-page.service';

@Component({
  selector: 'app-proposal-item-home-card',
  templateUrl: './proposal-item-home-card.component.html',
  styleUrls: ['./proposal-item-home-card.component.scss'],
})
export class ProposalItemHomeCardComponent implements OnInit {
  @Input() proposal: any;
  @Input() package: any;
  @Input() status: string | null;
  @Input() originRef: string | null;

  updatedBy;
  updatedOn;
  title: string;
  isClonedProposal = false;

  constructor(
    private translateService: TranslateService,
    private domSanitizer: DomSanitizer,
    private landingPageService: LandingPageService,
  ) {}

  ngOnInit() {
    if (this.proposal) {
      this.setItemTitle(this.proposal.title);
    } else if (this.package) {
      this.setItemTitle(this.package.title);
      this.landingPageService
        .getUserDoc(this.package.ref)
        .pipe(catchError(() => { return EMPTY; }))
        .subscribe((document) => {
          this.updatedBy = document.updatedBy;
          this.updatedOn = document.updatedOn;
          this.originRef = this.determineOriginRefFromDocument(document);
          this.status = this.determineStatusFromDocument(document);
        });
    }
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

  determineStatusFromDocument(document: Document) {
    const contributionStatus =
      document.cloneProposalMetadataVO?.revisionStatus ===
      'Sent for contribution'
        ? 'sent'
        : 'ready';

    return document.cloneProposalMetadataVO !== null
      ? contributionStatus
      : null;
  }

  determineOriginRefFromDocument(document: Document) {
    return document.cloneProposalMetadataVO?.originRef ?? null;
  }

  private setItemTitle(newTitle: any) {
    this.title = newTitle.replace(/<del[^>]*?>[\s\S]*?<\/del>/gi, '');
    this.title = this.title.replace(/<\/?ins[^>]*?>/gi, '');
    this.title =
      this.domSanitizer.sanitize(SecurityContext.HTML, this.title) || '';
  }
}
