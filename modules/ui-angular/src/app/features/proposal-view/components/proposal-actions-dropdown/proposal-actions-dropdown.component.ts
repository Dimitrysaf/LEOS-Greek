import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

import { Permission } from '@/shared';
import { ConfirmDeleteDialogComponent } from '@/shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';

import { ProposalDetailsService } from '../../services/proposal-details.service';
import {
  ProposalLinguisticVersionsDialogComponent
} from "@/features/proposal-view/containers/proposal-linguistic-versions-dialog/proposal-linguistic-versions-dialog.component";

@Component({
  selector: 'app-proposal-actions-dropdown',
  templateUrl: './proposal-actions-dropdown.component.html',
})
export class ProposalActionsDropdownComponent implements OnDestroy {
  @Input() proposalId: string;
  @Input() permissions: Permission[];
  loading = false;

  @Input() nonEditablePartOfTitle: string;
  @Input() editableTitle: string;
  @Input() isClonedProposal: boolean;
  @Input() proposalRef: string;
  @Input() proposalState: string;
  @Input() proposalTemplate!: string;
  @Input() proposalLanguage!: string;
  @Input() translatedLanguages!: string[];
  @Input() documentCollectionName!: string;
  @Input() customTemplateAct: boolean;
  @Input() isPublished: boolean;

  @ViewChild('proposalDeleteConf')
  proposalDeleteConf: ConfirmDeleteDialogComponent;
  @ViewChild('proposalDeleteCannotConf')
  proposalDeleteCannotConf: ConfirmDialogComponent;
  @ViewChild('proposalPublishedDeleteCannotConf')
  proposalPublishedDeleteCannotConf: ConfirmDialogComponent;
  @ViewChild('linguisticVersionsDialog')
  linguisticVersionsDialog: ProposalLinguisticVersionsDialogComponent;

  canExportLW = false;
  canValidate = false;
  canUpdate = false;
  canCreateTemplate = false;
  translated = false;
  repetitiveActsEnabled= false;

  private destroy$: Subject<any> = new Subject();

  constructor(
    public proposalDetailsService: ProposalDetailsService) {
    proposalDetailsService.permissions$.subscribe((permissions) => {
      this.canExportLW = permissions.includes('CAN_EXPORT_LW');
      this.canValidate = permissions.includes('CAN_VALIDATE');
      this.canUpdate = permissions.includes('CAN_UPDATE');
      this.canCreateTemplate = permissions.includes('CAN_CREATE_TEMPLATE');
    });
    this.translated = proposalDetailsService.getTranslated();
    this.repetitiveActsEnabled = proposalDetailsService.isRepetitiveActsEnabled();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
    this.proposalDetailsService.clonedProposalCount = 0;
  }

  handleDownload() {
    this.proposalDetailsService.downloadProposal();
  }

  handleExportAsPDF() {
    this.proposalDetailsService.exportProposal('PDF');
  }

  handleExportAsLW() {
    this.proposalDetailsService.exportProposal('WORD');
  }

  handleValidation() {
    this.proposalDetailsService.validateProposal().finally();
  }

  handleCopyChange() {
    this.proposalDetailsService.openProposalChangeCopyDialog(this.nonEditablePartOfTitle, this.editableTitle,
      this.proposalTemplate, this.proposalLanguage, this.documentCollectionName);
  }

  handleAddLinguisticVersion() {
    this.linguisticVersionsDialog.open();
  }

  handleShare() {
    console.warn('stub:', 'handleShare'); // FIXME
  }

  handleDelete() {
    this.proposalDetailsService.deleteProposal();
  }

  handleConfirmationDelete() {

    if (this.isPublished){
      this.proposalPublishedDeleteCannotConf.confirmDialog.openDialog();
      return;
    }

    if (this.proposalDetailsService.clonedProposalCount === 0) {
      this.proposalDeleteConf.deleteDialog.openDialog();
    } else {
      this.proposalDeleteCannotConf.confirmDialog.openDialog();
    }
  }
}
