import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EuiDialogConfig, EuiDialogService } from '@eui/components/eui-dialog';

import { ProposalCreateDraftComponent } from '@/shared/components/proposal-create-draft/proposal-create-draft.component';
import { ProposalCreateWizardComponent } from '@/shared/components/proposal-create-wizard/proposal-create-wizard.component';
import { ProposalUploadWizardComponent } from '@/shared/components/proposal-upload-wizard/proposal-upload-wizard.component';

@Injectable({
  providedIn: 'root',
})
export class CreateProposalService {
  createForm: FormGroup;

  constructor(private euiDialogService: EuiDialogService) {}

  openProposalUploadDialog() {
    const dialog = this.euiDialogService.openDialog(
      new EuiDialogConfig({
        dialogId: 'upload-id',
        bodyComponent: {
          component: ProposalUploadWizardComponent,
          config: {
            closeDialog: () => this.euiDialogService.closeDialog(dialog.id),
          },
        },
        hasFooter: false,
      }),
    );
  }

  openProposalCreateDialog() {
    const dialog = this.euiDialogService.openDialog(
      new EuiDialogConfig({
        dialogId: 'create-dialog',
        bodyComponent: {
          component: ProposalCreateWizardComponent,
          config: {
            closeDialog: () => this.euiDialogService.closeDialog(dialog.id),
          },
        },
        hasFooter: false,
      }),
    );
  }

  openProposalCreateDraftDialog() {
    const dialog = this.euiDialogService.openDialog(
      new EuiDialogConfig({
        dialogId: 'create-draft-dialog',
        bodyComponent: {
          component: ProposalCreateDraftComponent,
          config: {
            closeDialog: () => this.euiDialogService.closeDialog(dialog.id),
          },
        },
        hasFooter: false,
      }),
    );
  }
}
