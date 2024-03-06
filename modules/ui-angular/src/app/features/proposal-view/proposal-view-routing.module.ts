import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProposalViewComponent } from './containers/proposal-view/proposal-view.component';

const routes: Routes = [
  { path: ':proposalId', component: ProposalViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProposalViewRoutingModule {}
