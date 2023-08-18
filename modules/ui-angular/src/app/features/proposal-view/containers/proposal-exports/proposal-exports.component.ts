import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EuiDialogComponent } from '@eui/components/eui-dialog';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, Subject, takeUntil } from 'rxjs';

import { Document } from '@/shared';
import { ConfirmDeleteDialogComponent } from '@/shared/components/confirm-delete-dialog/confirm-delete-dialog.component';

import { ExportPackageVO } from '../../models/export-package.model';
import { ProposalDetailsService } from '../../services/proposal-details.service';

const DEBOUNCE_TIME = 300;
@Component({
  selector: 'app-proposal-exports',
  templateUrl: './proposal-exports.component.html',
  styleUrls: ['./proposal-exports.component.scss'],
})
export class ProposalExportsComponent implements OnInit, OnDestroy {
  @Input() proposal: Document;

  titleToEdit;
  exportToDelete: ExportPackageVO;
  exportDocuments: ExportPackageVO[];
  destroy$: Subject<any> = new Subject<any>();
  selectedExportPackage: ExportPackageVO;

  @ViewChild('confirmationForDelete')
  confirmDeleteComp: ConfirmDeleteDialogComponent;

  @ViewChild('editTitleExport') editExporTittleDialog: EuiDialogComponent;

  constructor(
    private proposalDetailsService: ProposalDetailsService,
    public translateService: TranslateService,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  handleTitleChange() {
    this.selectedExportPackage.comments[0] = this.titleToEdit;
    this.proposalDetailsService
      .updateExportDocument(
        this.selectedExportPackage.id,
        this.selectedExportPackage.comments,
      )
      .pipe(debounceTime(DEBOUNCE_TIME), takeUntil(this.destroy$))
      .subscribe((res) => {
        this.exportDocuments = res;
        this.closeEditExportDialog();
      });
  }

  ngOnInit(): void {
    this.proposalDetailsService.exportedDocuments$
      .pipe(takeUntil(this.destroy$))
      .subscribe((exports) => (this.exportDocuments = exports));
  }

  handleDeleteExport(exportData: ExportPackageVO) {
    this.exportToDelete = exportData;
    this.confirmDeleteComp.deleteDialog.openDialog();
  }

  handleNotifyExport(id: string) {
    this.proposalDetailsService
      .notifyExport(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {});
  }

  handlePreviewExport(id: string) {
    this.proposalDetailsService.previewExport(id);
  }

  hanldeConfirmationDelete() {
    this.deleteExport(this.exportToDelete.id);
  }

  openEditExportDialog(data: ExportPackageVO) {
    this.titleToEdit = data.comments[0];
    this.selectedExportPackage = data;
    this.editExporTittleDialog.openDialog();
  }

  closeEditExportDialog() {
    this.titleToEdit = null;
    this.selectedExportPackage = null;
    this.editExporTittleDialog.closeDialog();
  }

  private deleteExport(id: string) {
    this.proposalDetailsService
      .deleteExportDocument(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.exportDocuments = res;
      });
  }
}
