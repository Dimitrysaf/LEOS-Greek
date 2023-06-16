import {
  Directive,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';
import { Document } from '@/shared';

@Directive({
  selector: '[appIsRecievedForContribution]',
})
export class IsRecievedForContributionDirective implements OnDestroy {
  private destroy$: Subject<any> = new Subject();
  private userLogin: string;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private appConfig: AppConfigService,
  ) {
    this.appConfig.config.pipe().subscribe((config) => {
      this.userLogin = config.user.login;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  @Input() set appIsRecievedForContribution(proposal: Document) {
    if (!proposal.cloneProposalMetadataVO.clonedProposal) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }
}
