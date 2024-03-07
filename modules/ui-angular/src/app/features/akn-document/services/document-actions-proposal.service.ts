import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EuiDialogService } from '@eui/components/eui-dialog';
import { EuiDropdownButtonMenuItem } from '@eui/components/eui-dropdown-button-menu';
import { TranslateService } from '@ngx-translate/core';

import { AppConfigService } from '@/core/services/app-config.service';
import {
  IRibbonToolbarItem,
  IRibbonToolbarSection,
  IRibbonToolbarType,
} from '@/features/akn-document/models/document-actions.model';
import { CKEditorService } from '@/features/akn-document/services/ckeditor.service';
import { DocumentActionsService } from '@/features/akn-document/services/document-actions.service';
import { ImportService } from '@/features/akn-document/services/import.service';
import { MergeContributionsService } from '@/features/akn-document/services/merge-contributions.service';
import { PageModeService } from '@/features/akn-document/services/page-mode.service';
import { SyncDocumentScrollService } from '@/features/akn-document/services/sync-document-scroll.service';
import { VersionCompareService } from '@/features/akn-document/services/version-compare.service';
import { ViewVersionService } from '@/features/akn-document/services/view-version.service';
import {
  EXPORT_DROPDOWN_EXPORT_CLEAN_VERSION_ID,
  EXPORT_SECTION_DROPDOWN_ID,
  EXPORT_SECTION_ID,
} from '@/shared/constants/document-actions.constants';
import { DocumentService } from '@/shared/services/document.service';
import { EnvironmentService } from '@/shared/services/enviroment.service';
import { LeosLightService } from '@/shared/services/leos-light.service';

@Injectable()
export class DocumentActionsProposalService extends DocumentActionsService {
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
    protected versionCompareService: VersionCompareService,
    protected viewVersionService: ViewVersionService,
    protected syncScrollService: SyncDocumentScrollService,
    protected mergeContributionService: MergeContributionsService,
    protected pageModeService: PageModeService,
    protected appConfigService: AppConfigService,
    protected leosLightService: LeosLightService,
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
      versionCompareService,
      viewVersionService,
      syncScrollService,
      mergeContributionService,
      pageModeService,
      appConfigService,
      leosLightService
    );
  }

  getInstanceSpecificItem(
    commonItems: IRibbonToolbarItem[] = [],
  ): IRibbonToolbarSection[] {
    return [];
  }

  addExportSectionProposalItems(commonItems: IRibbonToolbarItem[]) {
    const exportSection = this.findItemById(EXPORT_SECTION_ID, commonItems);
    if (!exportSection || exportSection.type !== IRibbonToolbarType.SECTION)
      return;
    const exportDropdown = this.findItemById(
      EXPORT_SECTION_DROPDOWN_ID,
      exportSection.children,
    );
    if (!exportDropdown || exportDropdown.type !== IRibbonToolbarType.DROPDOWN)
      return;
    // if (this.isClonedProposal()) {
    //   const exportCleanExportItem = this.buildCleanExportButtonItem();
    //   exportDropdown.items.push(exportCleanExportItem);
    // }
  }
}
