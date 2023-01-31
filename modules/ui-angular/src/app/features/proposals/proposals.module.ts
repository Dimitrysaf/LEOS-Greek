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
import { ProposalUploadWizardComponent } from './containers/proposal-upload-wizard/proposal-upload-wizard.component';
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
    ProposalUploadWizardComponent,
  ],
  imports: [SharedModule, ReactiveFormsModule, ProposalsRoutingModule],
})
export class ProposalsModule {}
