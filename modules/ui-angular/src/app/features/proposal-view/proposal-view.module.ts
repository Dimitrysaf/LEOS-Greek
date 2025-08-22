import { ProposalService } from "@/shared/services/proposal.service";
import { SharedModule } from "@/shared/shared.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AddMilestoneDialogComponent } from "./components/add-milestone-dialog/add-milestone-dialog.component";
import { MilestoneAnnotationWarningModalComponent } from "./components/milestone-annotation-warning-modal/milestone-annotation-warning-modal.component";
import { ProposalActionsDropdownComponent } from "./components/proposal-actions-dropdown/proposal-actions-dropdown.component";
import { ProposalDetailsComponent } from "./components/proposal-details/proposal-details.component";
import { ProposalHeaderComponent } from "./components/proposal-header/proposal-header.component";
import { ProposalLastUpdatedOnComponent } from "./components/proposal-last-updated-on/proposal-last-updated-on.component";
import { ProposalCollaboratorsDialogComponent } from "./containers/proposal-collaborators-dialog/proposal-collaborators-dialog.component";
import { ProposalCollaboratorsComponent } from "./containers/proposal-collaborators/proposal-collaborators.component";
import { ProposalDraftsComponent } from "./containers/proposal-drafts/proposal-drafts.component";
import { ProposalExportsComponent } from "./containers/proposal-exports/proposal-exports.component";
import { ProposalMilestoneSendCopyDialogComponent } from "./containers/proposal-milestone-send-copy-dialog/proposal-milestone-send-copy-dialog.component";
import { ProposalMilestonesComponent } from "./containers/proposal-milestones/proposal-milestones.component";
import { ProposalViewComponent } from "./containers/proposal-view/proposal-view.component";
import { ProposalViewRoutingModule } from "./proposal-view-routing.module";
import {MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {
  ProposalMilestonePublishToCatalogDialogComponent
} from "@/features/proposal-view/containers/proposal-milestone-publish-to-dg-template-catalog/proposal-milestone-publish-to-catalog-dialog.component";


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
    ProposalLastUpdatedOnComponent,
    ProposalExportsComponent,
    AddMilestoneDialogComponent,
    ProposalMilestoneSendCopyDialogComponent,
    ProposalMilestonePublishToCatalogDialogComponent,
    MilestoneAnnotationWarningModalComponent
  ],
  imports: [
    ProposalViewRoutingModule,
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormField,
    MatDatepickerToggle,
    MatHint,
    MatLabel,
    MatDatepicker,
    MatDatepickerInput,
    MatSuffix,
  ],
  providers: [ProposalService],
})
export class ProposalViewModule {}
