import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTreeModule } from '@angular/material/tree';

import { AknDocumentRoutingModule } from '@/features/akn-document/akn-document-routing.module';
import { DownloadEconsiliumModalComponent } from '@/features/akn-document/components/download-econsilium-modal/download-econsilium-modal.component';
import { LeosLegacyModule } from '@/features/leos-legacy/leos-legacy.module';
import { SharedModule } from '@/shared/shared.module';

import { ActionsToolbarComponent } from './components/actions-toolbar/actions-toolbar.component';
import { AnnexActionsDropdownComponent } from './components/annex-actions-dropdown/annex-actions-dropdown.component';
import { AnnexDocumentComponent } from './components/annex-document/annex-document.component';
import { DocumentSearchComponent } from './components/document-search/document-search.component';
import { ImportFromJournalDialogComponent } from './components/import-from-journal-dialog/import-from-journal-dialog.component';
import { NodeTocActionsComponent } from './components/node-toc-actions/node-toc-actions.component';
import { TocActionsButtonsComponent } from './components/toc-actions-buttons/toc-actions-buttons.component';
import { TocEditorComponent } from './components/toc-editor/toc-editor.component';
import { VersionActionsDropdownComponent } from './components/version-actions-dropdown/version-actions-dropdown.component';
import { VersionsPaneGroupComponent } from './components/versions-pane-group/versions-pane-group.component';
import { DocumentEditorComponent } from './containers/document-editor/document-editor.component';
import { DocumentTocComponent } from './containers/document-toc/document-toc.component';
import { VersionsPaneComponent } from './containers/versions-pane/versions-pane.component';
import { SaveVersionDialogComponent } from './components/save-version-dialog/save-version-dialog.component';

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
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    AknDocumentRoutingModule,
    LeosLegacyModule,
    SharedModule,
    MatTreeModule,
  ],
  providers: [],
})
export class AknDocumentModule {}
