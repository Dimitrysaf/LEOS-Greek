import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EuiDialogService } from '@eui/components/eui-dialog';
import { EuiDropdownButtonMenuItem } from '@eui/components/eui-dropdown-button-menu';
import { TranslateService } from '@ngx-translate/core';

import { DownloadEconsiliumComponent } from '@/features/akn-document/components/download-econsilium/download-econsilium.component';
import {
  IRibbonToolbarButton,
  IRibbonToolbarItem,
  IRibbonToolbarSection,
  IRibbonToolbarType,
} from '@/features/akn-document/models/document-actions.model';
import { CKEditorService } from '@/features/akn-document/services/ckeditor.service';
import { DocumentActionsService } from '@/features/akn-document/services/document-actions.service';
import { ImportService } from '@/features/akn-document/services/import.service';
import {
  EXPORT_DROPDOWN_EXPORT_CLEAN_VERSION_ID,
  EXPORT_DROPDOWN_EXPORT_TO_ECONSILIUM,
  EXPORT_SECTION_DROPDOWN_ID,
  EXPORT_SECTION_ID,
  STRUCTURE_RENUMBER_DOCUMENT_ID,
  STRUCTURE_SECTION_ID,
} from '@/shared/constants/document-actions.constants';
import {
  DocumentService,
  DownloadEConsiliumOptions,
} from '@/shared/services/document.service';
import { EnvironmentService } from '@/shared/services/enviroment.service';

@Injectable()
export class DocumentActionsMandateService extends DocumentActionsService {
  constructor(
    protected formBuilder: FormBuilder,
    protected router: Router,
    protected documentService: DocumentService,
    protected translateService: TranslateService,
    protected domSanitizer: DomSanitizer,
    protected ckEditorService: CKEditorService,
    protected dialogService: EuiDialogService,
    protected environmentService: EnvironmentService,
    protected importService: ImportService,
  ) {
    super(
      router,
      documentService,
      translateService,
      domSanitizer,
      ckEditorService,
      dialogService,
      environmentService,
      formBuilder,
      importService,
    );
  }

  getInstanceSpecificItem(
    commonItems: IRibbonToolbarItem[] = [],
  ): IRibbonToolbarSection[] {
    this.addExportSectionMandateItems(commonItems);
    this.addStructureSectionMandateItems(commonItems);
    return [];
  }

  private addStructureSectionMandateItems(commonItems: IRibbonToolbarItem[]) {
    const structureSection = this.findItemById(
      STRUCTURE_SECTION_ID,
      commonItems,
    );

    if (
      !structureSection ||
      structureSection.type !== IRibbonToolbarType.SECTION
    )
      return;

    if (
      // todo uncomment this ...
      // this.isMandateBillOrAnnex() &&
      this.hasPermission('CAN_UPDATE')
    ) {
      const renumberDocumentComponent = this.buildRenumberDocumentButtonItem();
      structureSection.children.push(renumberDocumentComponent);
    }
  }

  private addExportSectionMandateItems(commonItems: IRibbonToolbarItem[]) {
    const exportSection = this.findItemById(EXPORT_SECTION_ID, commonItems);
    if (!exportSection || exportSection.type !== IRibbonToolbarType.SECTION)
      return;

    const exportDropdown = this.findItemById(
      EXPORT_SECTION_DROPDOWN_ID,
      exportSection.children,
    );
    if (!exportDropdown || exportDropdown.type !== IRibbonToolbarType.DROPDOWN)
      return;

    if (!this.isMandateMemorandum()) {
      const exportCleanExportItem = this.buildCleanExportButtonItem();
      exportDropdown.items.push(exportCleanExportItem);
    }

    if (
      !this.isMandateMemorandum() &&
      this.hasPermission('CAN_WORK_WITH_EXPORT_PACKAGE')
    ) {
      const econsiliumExportItem = this.buildExportToEConsilium();
      exportDropdown.items.push(econsiliumExportItem);
    }
  }

  private buildRenumberDocumentButtonItem(): IRibbonToolbarButton {
    return {
      type: IRibbonToolbarType.BUTTON,
      id: STRUCTURE_RENUMBER_DOCUMENT_ID,
      label: this.translateService.instant(
        'page.editor.actions-dropdown.renumber-document',
      ),
      euiSize: 's',
      euiStyle: 'secondary',
      svgType: 'sharp',
      svgIconClas: '',
      actionFn: () => this.onApplyContinuousNumberingSelect(),
    };
  }

  private buildCleanExportButtonItem(): EuiDropdownButtonMenuItem {
    return {
      id: EXPORT_DROPDOWN_EXPORT_CLEAN_VERSION_ID,
      label: this.translateService.instant(
        'page.editor.actions-dropdown.export-clean-version',
      ),
      command: () => {
        this.documentService.downloadCleanVersion();
      },
    };
  }

  private buildExportToEConsilium(): EuiDropdownButtonMenuItem {
    let exportOptions: DownloadEConsiliumOptions = null;
    return {
      id: EXPORT_DROPDOWN_EXPORT_TO_ECONSILIUM,
      label: this.translateService.instant(
        'page.editor.actions-dropdown.export-econsilium',
      ),
      iconClass: 'eui-icon-ecl-file',
      command: () => {
        const econsiliumDialog = this.dialogService.openDialog({
          dialogId: 'export-econsilium',
          title: this.translateService.instant(
            'page.editor.actions-dropdown.export-econsilium',
          ),
          bodyComponent: {
            component: DownloadEconsiliumComponent,
            config: {
              setExportOptionsCallback: (
                options: DownloadEConsiliumOptions,
              ) => {
                exportOptions = options;
              },
            },
          },
          accept: () => {
            this.documentService.downloadEConsilium(exportOptions);
          },
        });
      },
    };
  }

  private onApplyContinuousNumberingSelect() {
    this.dialogService.openDialog({
      title: this.translateService.instant(
        'page.editor.actions-dropdown.apply-continuous-numbering.confirmation.title',
      ),
      content: this.translateService.instant(
        `page.editor.actions-dropdown.${this.documentService.documentType.toLowerCase()}.apply-continuous-numbering.confirmation.message`,
      ),
      acceptLabel: this.translateService.instant('global.actions.continue'),
      accept: () => {
        this.documentService.renumberDocument();
      },
      dismiss: () => {},
    });
  }

  private isMandateBillOrAnnex(): boolean {
    return (
      this.environmentService.isCouncil() &&
      this.isDocumentTypeTheSame(this.documentService.documentType, 'BILL') &&
      this.isDocumentTypeTheSame(this.documentService.documentType, 'ANNEX')
    );
  }
}
