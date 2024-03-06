import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import {
  ProposalItemComponent,
  ProposalsFiltersComponent,
  ProposalsListComponent,
} from './components';
import { ProposalsComponent } from './containers';
import { ProposalsRoutingModule } from './proposals-routing.module';

@NgModule({
  declarations: [
    ProposalsComponent,
    ProposalsFiltersComponent,
    ProposalsListComponent,
    ProposalItemComponent,
  ],
  imports: [SharedModule, ReactiveFormsModule, ProposalsRoutingModule],
})
export class ProposalsModule {}
