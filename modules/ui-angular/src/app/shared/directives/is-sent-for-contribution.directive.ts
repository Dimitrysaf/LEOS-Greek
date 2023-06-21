import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { Document } from '@/shared';

@Directive({
  selector: '[appIsSentForContribution]',
})
export class IsSentForContributionDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
  ) {}

  @Input() set appIsSentForContribution(proposal: Document) {
    if (proposal.cloneProposalMetadataVO.clonedProposal) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }
}
