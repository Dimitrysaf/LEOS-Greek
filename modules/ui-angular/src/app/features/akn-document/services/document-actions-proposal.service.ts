import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EuiDialogService } from '@eui/components/eui-dialog';
import { TranslateService } from '@ngx-translate/core';

import { AppConfigService } from '@/core/services/app-config.service';
import {
  IRibbonToolbarItem,
  IRibbonToolbarSection,
} from '@/features/akn-document/models/document-actions.model';
import { CKEditorService } from '@/features/akn-document/services/ckeditor.service';
import { DocumentActionsService } from '@/features/akn-document/services/document-actions.service';
import { ImportService } from '@/features/akn-document/services/import.service';
import { PageModeService } from '@/features/akn-document/services/page-mode.service';
import { SyncDocumentScrollService } from '@/features/akn-document/services/sync-document-scroll.service';
import { VersionCompareService } from '@/features/akn-document/services/version-compare.service';
import { DocumentService } from '@/shared/services/document.service';
import { EnvironmentService } from '@/shared/services/enviroment.service';

import { ViewVersionService } from './view-version.service';

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
    protected pageModeService: PageModeService,
    protected appConfigService: AppConfigService,
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
      pageModeService,
      appConfigService,
    );
  }

  getInstanceSpecificItem(
    commonItems: IRibbonToolbarItem[] = [],
  ): IRibbonToolbarSection[] {
    return [];
  }
}
