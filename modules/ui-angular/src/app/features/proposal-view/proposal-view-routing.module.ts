import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProposalViewComponent } from './containers/proposal-view/proposal-view.component';
import { ProposalDetailsService } from './services/proposal-details.service';

const routes: Routes = [{ path: ':id', component: ProposalViewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ProposalDetailsService],
})
export class ProposalViewRoutingModule {}
