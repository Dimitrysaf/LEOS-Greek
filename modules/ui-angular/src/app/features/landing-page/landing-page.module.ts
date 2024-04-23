import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ProposalFilterHomeComponent } from '@/features/landing-page/components/proposal-filter-home/proposal-filter-home.component';
import { ProposalItemHomeCardComponent } from '@/features/landing-page/components/proposal-item-home-card/proposal-item-home-card.component';
import { SharedModule } from '@/shared/shared.module';

import { ProposalHomeCardComponent } from './components/proposal-home-card/proposal-home-card.component';
import { LandingPageComponent } from './containers/landing-page/landing-page.component';
import { LandingPageRoutingModule } from './landing-page-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    LandingPageRoutingModule,
    CommonModule,
  ],
  declarations: [
    ProposalHomeCardComponent,
    LandingPageComponent,
    ProposalItemHomeCardComponent,
    ProposalFilterHomeComponent,
  ],
})
export class LandingPageModule {}
