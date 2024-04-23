import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EuiDialogConfig, EuiDialogService } from '@eui/components/eui-dialog';
import { TranslateService } from '@ngx-translate/core';

import { ProposalCreateDraftComponent } from '@/shared/components/proposal-create-draft/proposal-create-draft.component';
import { ProposalCreateWizardComponent } from '@/shared/components/proposal-create-wizard/proposal-create-wizard.component';
import { ProposalUploadWizardComponent } from '@/shared/components/proposal-upload-wizard/proposal-upload-wizard.component';

import { EnvironmentService } from './enviroment.service';

@Injectable({
  providedIn: 'root',
})
export class CreateProposalService {
  createForm: FormGroup;

  constructor(
    private euiDialogService: EuiDialogService,
    private translateService: TranslateService,
    private environmentService: EnvironmentService,
  ) {}

  openProposalUploadDialog() {
    const dialog = this.euiDialogService.openDialog(
      new EuiDialogConfig({
        dialogId: 'upload-id',
        title: this.translateService.instant(
          this.environmentService.isCouncil()
            ? 'page.workspace.upload-cn.title'
            : 'page.workspace.upload.title',
        ),
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
        title: this.translateService.instant('page.workspace.create-title'),
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

  openProposalCreateDraftDialog(fromProposal: boolean) {
    const dialog = this.euiDialogService.openDialog(
      new EuiDialogConfig({
        dialogId: 'create-draft-dialog',
        title: this.translateService.instant(
          'page.workspace.create-title.draft',
        ),
        bodyComponent: {
          component: ProposalCreateDraftComponent,
          config: {
            closeDialog: () => this.euiDialogService.closeDialog(dialog.id),
            fromProposal,
          },
        },
        hasFooter: false,
      }),
    );
  }
}
