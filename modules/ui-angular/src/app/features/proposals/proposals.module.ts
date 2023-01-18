import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import {
  ProposalCreateFormComponent,
  ProposalCreateTemplateSelectorComponent,
  ProposalItemComponent,
  ProposalsFiltersComponent,
  ProposalsListComponent,
} from './components';
import {
  ProposalCreateWizardComponent,
  ProposalsComponent,
} from './containers';
import { ProposalsRoutingModule } from './proposals-routing.module';

@NgModule({
  declarations: [
    ProposalsComponent,
    ProposalsFiltersComponent,
    ProposalsListComponent,
    ProposalItemComponent,
    ProposalCreateWizardComponent,
    ProposalCreateFormComponent,
    ProposalCreateTemplateSelectorComponent,
  ],
  imports: [SharedModule, ReactiveFormsModule, ProposalsRoutingModule],
})
export class ProposalsModule {}
