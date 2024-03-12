import { Document } from '@/shared';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { apiBaseUrl } from 'src/config';
import { PackagesRecentlyChanged } from '../../models/packages-recent-changed.model';
import { Observable } from 'rxjs';

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

  createdBy;
  updatedOn;
  title: string;

  constructor(
    private translateService: TranslateService,
    private domSanitizer: DomSanitizer,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    console.log('Package on init:', this.package);
    if (this.proposal) this.setItemTitle(this.proposal.title);

    if (this.package) {
      this.getUserDoc(this.package.ref).subscribe((document) => {
        this.createdBy = document.createdBy;
        this.updatedOn = document.updatedOn;
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

  private setItemTitle(newTitle: any) {
    this.title = newTitle.replace(/<del[^>]*?>[\s\S]*?<\/del>/gi, '');
    this.title = this.title.replace(/<\/?ins[^>]*?>/gi, '');
    this.title =
      this.domSanitizer.sanitize(SecurityContext.HTML, this.title) || '';
  }

  private getUserDoc(pkg: PackagesRecentlyChanged): Observable<Document> {
    return this.http.get<Document>(`${apiBaseUrl}/secured/proposals/${pkg}`);
  }
}
