import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { Permission } from '@/shared';
import { ConfirmDeleteDialogComponent } from '@/shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { ConfirmDialogComponent } from '@/shared/components/confirm-dialog/confirm-dialog.component';

import { ProposalDetailsService } from '../../services/proposal-details.service';
import { EditTitleDialogComponent } from '../edit-title-dialog/edit-title-dialog.component';

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
  @Input() originRef: string | null;
  @Input() proposalState: string;

  mailtoHeader = 'mailto:?';
  subjectProp = 'subject=';
  bodyProp = 'body=';
  amp = '&amp;';
  @ViewChild('proposalDeleteConf')
  proposalDeleteConf: ConfirmDeleteDialogComponent;
  @ViewChild('proposalDeleteCannotConf')
  proposalDeleteCannotConf: ConfirmDialogComponent;
  @ViewChild('editTitleDialog')
  editTitleDialog: EditTitleDialogComponent;
  canExportLW = false;

  private destroy$: Subject<any> = new Subject();

  constructor(
    public proposalDetailsService: ProposalDetailsService,
    private sanitizer: DomSanitizer,
  ) {
    proposalDetailsService.permissions$.subscribe((permissions) => {
      this.canExportLW = permissions.includes('CAN_EXPORT_LW');
    });
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

  handleShare() {
    console.warn('stub:', 'handleShare'); // FIXME
  }

  handleDelete() {
    this.proposalDetailsService.deleteProposal();
  }

  handleConfirmationDelete() {
    if (this.proposalDetailsService.clonedProposalCount === 0) {
      this.proposalDeleteConf.deleteDialog.openDialog();
    } else {
      this.proposalDeleteCannotConf.confirmDialog.openDialog();
    }
  }

  getStringifiedMailTo() {
    const activeUrl = window.location.href;
    const url = `${this.mailtoHeader}${this.subjectProp}Shared Proposal&${this.bodyProp}${activeUrl}`;
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  openEditTitleDialog() {
    this.editTitleDialog.openDialog();
  }
}
