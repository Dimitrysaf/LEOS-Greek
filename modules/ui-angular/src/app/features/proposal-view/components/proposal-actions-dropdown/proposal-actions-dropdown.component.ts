import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

import { Permission } from '@/shared';
import { ConfirmDeleteDialogComponent } from '@/shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';

import { ProposalDetailsService } from '../../services/proposal-details.service';
import {TranslateService} from "@ngx-translate/core";

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
  @Input() proposalState: string;
  @Input() proposalTemplate!: string;
  @Input() proposalLanguage!: string;
  @Input() documentCollectionName!: string;
  @Input() customTemplateAct: boolean;
  @Input() translatedLanguages: string[];
  @Input() isPublished: boolean;

  @ViewChild('proposalDeleteConf')
  proposalDeleteConf: ConfirmDeleteDialogComponent;
  @ViewChild('proposalDeleteCannotConf')
  proposalDeleteCannotConf: ConfirmDialogComponent;
  @ViewChild('proposalPublishedDeleteCannotConf')
  proposalPublishedDeleteCannotConf: ConfirmDialogComponent;

  canExportLW = false;
  canValidate = false;
  canUpdate = false;
  translated = false;
  repetitiveActsEnabled= false;

  private destroy$: Subject<any> = new Subject();

  constructor(
    public proposalDetailsService: ProposalDetailsService,
    private translateService: TranslateService) {
    proposalDetailsService.permissions$.subscribe((permissions) => {
      this.canExportLW = permissions.includes('CAN_EXPORT_LW');
      this.canValidate = permissions.includes('CAN_VALIDATE');
      this.canUpdate = permissions.includes('CAN_UPDATE');
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

  get confirmDeleteMessage() {
    let message = this.translateService.instant('page.collection.proposal-header.actions.delete-dialog.desc');
    if (this.translatedLanguages?.length > 0) {
      message += '<br><br>' + this.translateService.instant('page.collection.proposal-header.actions.delete-dialog.linguistic-versions');
    }
    return message;
  }
}
