import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  EuiDialogComponent,
  EuiDialogService,
} from '@eui/components/eui-dialog';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, Subject, takeUntil } from 'rxjs';

import { DownloadEconsiliumModalComponent } from '@/features/akn-document/components/download-econsilium-modal/download-econsilium-modal.component';
import { ImportFromJournalDialogComponent } from '@/features/akn-document/components/import-from-journal-dialog/import-from-journal-dialog.component';
import { CKEditorService } from '@/features/akn-document/services/ckeditor.service';
import { DocumentConfig, Permission } from '@/shared';
import { DocumentService } from '@/shared/services/document.service';

@Component({
  selector: 'app-document-actions-dropdown',
  templateUrl: './document-actions-dropdown.component.html',
  styleUrls: ['./document-actions-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentActionsDropdownComponent implements OnInit, OnDestroy {
  @Output() annexChangeStructure = new EventEmitter<void>();

  documentConfig: DocumentConfig;

  saveVersionVisible = false;
  exportVersionVisible = false;
  exportVersionWithAnnotationsVisible = false;
  exportCleanVersionVisible = false;
  showCleanVersionVisible = false;
  exportEConsiliumVisible = false;
  importVisible = false;
  toggleUserGuidanceVisible = false;
  seeNavigationPanelVisible = false;
  changeDocumentStructureVisible = false;
  renumberDocumentVisible = false;
  canActivateTrackChanges = true;
  isTrackChangesEnabled = true;
  seeTrackChanges = true;
  isClonedProposal = false;

  @ViewChild('createVersionDialog') createVersionDialog: EuiDialogComponent;
  @ViewChild('eConsiliumModal')
  eConsiliumModal: DownloadEconsiliumModalComponent;
  @ViewChild('importDialog')
  importDialog: ImportFromJournalDialogComponent;

  private destroy$ = new Subject();

  constructor(
    public doc: DocumentService,
    public ckEditorService: CKEditorService,
    public dialogService: EuiDialogService,
    public translateService: TranslateService,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    combineLatest([this.doc.documentConfig$, this.doc.permissions$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([config, perms]) => {
        this.setMenuState(config, perms);
      });
  }

  updateTrackChangesStatus() {
    this.doc.updateTrackChangesStatus({
      isTrackChangesEnabled: this.isTrackChangesEnabled,
      isTrackChangesShowed: this.seeTrackChanges,
    });
  }

  handleAnnexStructureChange() {
    this.annexChangeStructure.emit();
  }

  toggleSeeTrackChanges() {
    this.seeTrackChanges = !this.seeTrackChanges;
    this.ckEditorService.changeSeeTrackChangesState();
    this.updateTrackChangesStatus();
  }

  showCleanVersion() {
    this.doc.showCleanVersion();
  }

  toggleTrackChangesEnabled() {
    this.isTrackChangesEnabled = !this.isTrackChangesEnabled;
    this.ckEditorService.changeEnableTrackChangesState(
      this.isTrackChangesEnabled,
    );
    this.doc.toggleTrackChangesEnabled(this.isTrackChangesEnabled);
    this.updateTrackChangesStatus();
  }

  onApplyContinuousNumberingSelect() {
    this.dialogService.openDialog({
      title: this.translateService.instant(
        'page.editor.actions-dropdown.apply-continuous-numbering.confirmation.title',
      ),
      content: this.translateService.instant(
        `page.editor.actions-dropdown.${this.doc.documentType.toLowerCase()}.apply-continuous-numbering.confirmation.message`,
      ),
      acceptLabel: this.translateService.instant('global.actions.continue'),
      accept: () => {
        this.doc.renumberDocument();
      },
      dismiss: () => {},
    });
  }

  setMenuState(config: DocumentConfig, permissions: Permission[]) {
    this.documentConfig = config;
    const isClonedProposal = this.documentConfig?.clonedProposal;
    const isTCEnabled = this.documentConfig?.trackChangesEnabled;

    const isCN = process.env.NG_APP_LEOS_INSTANCE === 'cn';
    const isAnnex = this.doc.documentType === 'annex';
    const isMandateAnnex = isCN && isAnnex;
    const isDocument = this.doc.documentType === 'bill';
    const isMandateDocument = isCN && isDocument;
    const isExplanatory = this.doc.documentType === 'council_explanatory';
    const isMandateExplanatory = isCN && isExplanatory;
    const isMemorandum = this.doc.documentType === 'memorandum';
    const isMandateMemorandum = isCN && isMemorandum;
    const CAN_UPDATE = permissions.includes('CAN_UPDATE');
    const CAN_RENUMBER = permissions.includes('CAN_RENUMBER');
    const CAN_WORK_WITH_EXPORT_PACKAGE = permissions.includes(
      'CAN_WORK_WITH_EXPORT_PACKAGE',
    );
    const CAN_ACTIVATE_TRACK_CHANGES = permissions.includes(
      'CAN_ACTIVATE_TRACK_CHANGES',
    );

    this.saveVersionVisible = !isMandateMemorandum && CAN_UPDATE;
    this.exportVersionVisible = !isMandateExplanatory && !isMandateMemorandum;
    this.exportVersionWithAnnotationsVisible = !isMandateMemorandum;
    this.exportEConsiliumVisible =
      isCN && !isMandateMemorandum && CAN_WORK_WITH_EXPORT_PACKAGE;
    this.importVisible = isDocument && CAN_UPDATE;
    this.toggleUserGuidanceVisible = true;
    this.seeNavigationPanelVisible = true;
    this.changeDocumentStructureVisible = isAnnex && CAN_UPDATE;
    this.renumberDocumentVisible =
      (isMandateAnnex || isMandateDocument) && CAN_RENUMBER;
    this.seeTrackChanges = this.documentConfig.trackChangesShowed;
    this.canActivateTrackChanges =
      !isClonedProposal && CAN_ACTIVATE_TRACK_CHANGES;
    this.exportCleanVersionVisible =
      (isCN || isClonedProposal) && !isMandateMemorandum;
    this.showCleanVersionVisible =
      (isCN || isClonedProposal) && !isMandateMemorandum;
    this.isClonedProposal = isClonedProposal;
    this.isTrackChangesEnabled = isTCEnabled;
    this.updateTrackChangesStatus();
  }

  setTrackChangesEnabled() {}
}
