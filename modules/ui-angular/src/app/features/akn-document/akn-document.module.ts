import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { RouteReuseStrategy } from '@angular/router';

import { AknDocumentRoutingModule } from '@/features/akn-document/akn-document-routing.module';
import { DownloadEconsiliumModalComponent } from '@/features/akn-document/components/download-econsilium-modal/download-econsilium-modal.component';
import { RevisionActionsDropdownComponent } from '@/features/akn-document/components/revision-actions-dropdown/revision-actions-dropdown.component';
import { RevisionPaneGroupComponent } from '@/features/akn-document/components/revision-pane-group/revision-pane-group.component';
import { RevisionPaneComponent } from '@/features/akn-document/containers/revision-pane/revision-pane.component';
import { LeosLegacyModule } from '@/features/leos-legacy/leos-legacy.module';
import { CN } from '@/shared/constants';
import { SharedModule } from '@/shared/shared.module';

import { AknRouteReUseStrategy } from './akn-route-strategy';
import { ActionsToolbarComponent } from './components/actions-toolbar/actions-toolbar.component';
import { AnnexActionsDropdownComponent } from './components/annex-actions-dropdown/annex-actions-dropdown.component';
import { AnnexDocumentComponent } from './components/annex-document/annex-document.component';
import { DocumentSearchComponent } from './components/document-search/document-search.component';
import { ImportFromJournalDialogComponent } from './components/import-from-journal-dialog/import-from-journal-dialog.component';
import { NodeTocActionsComponent } from './components/node-toc-actions/node-toc-actions.component';
import { SaveVersionDialogComponent } from './components/save-version-dialog/save-version-dialog.component';
import { TocActionsButtonsComponent } from './components/toc-actions-buttons/toc-actions-buttons.component';
import { TocEditorComponent } from './components/toc-editor/toc-editor.component';
import { VersionActionsDropdownComponent } from './components/version-actions-dropdown/version-actions-dropdown.component';
import { VersionsPaneGroupComponent } from './components/versions-pane-group/versions-pane-group.component';
import { DocumentEditorComponent } from './containers/document-editor/document-editor.component';
import { DocumentTocComponent } from './containers/document-toc/document-toc.component';
import { VersionsPaneComponent } from './containers/versions-pane/versions-pane.component';
import { CKEditorService } from './services/ckeditor.service';
import { TableOfContentMandateEditService } from './services/table-of-content-edit.mandate.service';
import { TableOfContentProposalEditService } from './services/table-of-content-edit.proposal.service';
import { TableOfContentEditService } from './services/table-of-content-edit.service';
import { ValidateTocMandateService } from './services/validate-node-drop.mandate.service';
import { ValidateTocProposalService } from './services/validate-node-drop.proposal.service';
import { ValidateTocService } from './services/validate-node-drop.service';

@NgModule({
  declarations: [
    AnnexActionsDropdownComponent,
    AnnexDocumentComponent,
    ActionsToolbarComponent,
    DocumentSearchComponent,
    VersionActionsDropdownComponent,
    VersionsPaneComponent,
    VersionsPaneGroupComponent,
    DocumentEditorComponent,
    DownloadEconsiliumModalComponent,
    ImportFromJournalDialogComponent,
    TocActionsButtonsComponent,
    TocEditorComponent,
    DocumentTocComponent,
    NodeTocActionsComponent,
    SaveVersionDialogComponent,
    RevisionPaneComponent,
    RevisionPaneGroupComponent,
    RevisionActionsDropdownComponent,
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    AknDocumentRoutingModule,
    LeosLegacyModule,
    SharedModule,
    MatTreeModule,
    MatTooltipModule,
  ],
  providers: [
    CKEditorService,
    { provide: RouteReuseStrategy, useClass: AknRouteReUseStrategy },
    {
      provide: ValidateTocService,
      useClass:
        process.env.NG_APP_LEOS_INSTANCE.toLowerCase() === CN.toLowerCase()
          ? ValidateTocMandateService
          : ValidateTocProposalService,
    },
    {
      provide: TableOfContentEditService,
      useClass:
        process.env.NG_APP_LEOS_INSTANCE.toLowerCase() === CN.toLowerCase()
          ? TableOfContentMandateEditService
          : TableOfContentProposalEditService,
    },
  ],
})
export class AknDocumentModule {}
