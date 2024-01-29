import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { DocumentService } from '@/shared/services/document.service';

import { ProposalService } from '../proposals/services/proposal.service';
import { AddMilestoneDialogComponent } from './components/add-milestone-dialog/add-milestone-dialog.component';
import { EditTitleDialogComponent } from './components/edit-title-dialog/edit-title-dialog.component';
import { MilestoneAnnotationWarningModalComponent } from './components/milestone-annotation-warning-modal/milestone-annotation-warning-modal.component';
import { ProposalActionsDropdownComponent } from './components/proposal-actions-dropdown/proposal-actions-dropdown.component';
import { ProposalDetailsComponent } from './components/proposal-details/proposal-details.component';
import { ProposalHeaderComponent } from './components/proposal-header/proposal-header.component';
import { ProposalLastUpdatedOnComponent } from './components/proposal-last-updated-on/proposal-last-updated-on.component';
import { ProposalCollaboratorsComponent } from './containers/proposal-collaborators/proposal-collaborators.component';
import { ProposalCollaboratorsDialogComponent } from './containers/proposal-collaborators-dialog/proposal-collaborators-dialog.component';
import { ProposalDraftsComponent } from './containers/proposal-drafts/proposal-drafts.component';
import { ProposalExportsComponent } from './containers/proposal-exports/proposal-exports.component';
import { ProposalMilestoneSendCopyDialogComponent } from './containers/proposal-milestone-send-copy-dialog/proposal-milestone-send-copy-dialog.component';
import { ProposalMilestonesComponent } from './containers/proposal-milestones/proposal-milestones.component';
import { ProposalViewComponent } from './containers/proposal-view/proposal-view.component';
import { ProposalViewRoutingModule } from './proposal-view-routing.module';

@NgModule({
  declarations: [
    ProposalActionsDropdownComponent,
    ProposalDetailsComponent,
    ProposalDraftsComponent,
    ProposalMilestonesComponent,
    ProposalViewComponent,
    ProposalCollaboratorsComponent,
    ProposalCollaboratorsDialogComponent,
    ProposalHeaderComponent,
    EditTitleDialogComponent,
    ProposalLastUpdatedOnComponent,
    ProposalExportsComponent,
    AddMilestoneDialogComponent,
    ProposalMilestoneSendCopyDialogComponent,
    MilestoneAnnotationWarningModalComponent,
  ],
  providers: [ProposalService],
  imports: [ProposalViewRoutingModule, SharedModule],
})
export class ProposalViewModule {}
