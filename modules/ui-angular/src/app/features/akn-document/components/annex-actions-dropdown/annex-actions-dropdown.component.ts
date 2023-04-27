import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EuiDialogComponent } from '@eui/components/eui-dialog';
import { Subject } from 'rxjs';

import { DownloadEconsiliumModalComponent } from '@/features/akn-document/components/download-econsilium-modal/download-econsilium-modal.component';
import { ImportFromJournalDialogComponent } from '@/features/akn-document/components/import-from-journal-dialog/import-from-journal-dialog.component';
import { CKEditorService } from '@/features/akn-document/services/ckeditor.service';
import { DocumentService } from '@/shared/services/document.service';

@Component({
  selector: 'app-annex-actions-dropdown',
  templateUrl: './annex-actions-dropdown.component.html',
  styleUrls: ['./annex-actions-dropdown.component.scss'],
})
export class AnnexActionsDropdownComponent implements OnInit, OnDestroy {
  isExportVersion = process.env.NG_APP_LEOS_INSTANCE !== 'cn';
  downloadVersionVisible =
    this.doc.documentType !== 'memorandum' &&
    this.doc.documentType !== 'council_explanatory';
  downloadVersionWithAnnotationsVisible =
    this.doc.documentType !== 'memorandum';
  // TODO: CN || proposal.isCloned() - see `setDownloadCleanVersionVisible`
  downloadCleanVersionVisible =
    process.env.NG_APP_LEOS_INSTANCE === 'cn' &&
    this.doc.documentType !== 'memorandum';
  // TODO see `setShowCleanVersionVisible`
  showCleanVersionVisible = false;
  downloadEConsiliumVisible =
    process.env.NG_APP_LEOS_INSTANCE === 'cn' &&
    this.doc.documentType !== 'memorandum';
  importerVisible = false;

  @ViewChild('createVersionDialog') createVersionDialog: EuiDialogComponent;
  @ViewChild('eConsiliumModal')
  eConsiliumModal: DownloadEconsiliumModalComponent;
  @ViewChild('importDialog')
  importDialog: ImportFromJournalDialogComponent;

  private destroy$ = new Subject();

  constructor(
    public doc: DocumentService,
    public ckEditorService: CKEditorService,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.doc.permissions$.subscribe((permissions) => {
      this.importerVisible =
        this.doc.documentType === 'bill' && permissions.includes('CAN_UPDATE');
    });
  }
}
