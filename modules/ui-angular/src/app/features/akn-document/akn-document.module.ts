import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTreeModule } from '@angular/material/tree';

import { AknDocumentRoutingModule } from '@/features/akn-document/akn-document-routing.module';
import { AnnotateService } from '@/features/akn-document/services/annotate.service';
import { LeosLegacyModule } from '@/features/leos-legacy/leos-legacy.module';
import { SharedModule } from '@/shared/shared.module';

import { ActionsToolbarComponent } from './components/actions-toolbar/actions-toolbar.component';
import { AnnexActionsDropdownComponent } from './components/annex-actions-dropdown/annex-actions-dropdown.component';
import { AnnexDocumentComponent } from './components/annex-document/annex-document.component';
import { DocumentAnnotationsComponent } from './components/document-annotations/document-annotations.component';
import { DocumentSearchComponent } from './components/document-search/document-search.component';
import { DocumentTocComponent } from './components/document-toc/document-toc.component';
import { VersionActionsDropdownComponent } from './components/version-actions-dropdown/version-actions-dropdown.component';
import { VersionsPaneGroupComponent } from './components/versions-pane-group/versions-pane-group.component';
import { AknDocumentComponent } from './containers/akn-document/akn-document.component';
import { AnnexEditorComponent } from './containers/annex-editor/annex-editor.component';
import { DocumentEditorComponent } from './containers/document-editor/document-editor.component';
import { VersionsPaneComponent } from './containers/versions-pane/versions-pane.component';

@NgModule({
  declarations: [
    AknDocumentComponent,
    AnnexActionsDropdownComponent,
    AnnexDocumentComponent,
    AnnexEditorComponent,
    ActionsToolbarComponent,
    DocumentSearchComponent,
    DocumentAnnotationsComponent,
    DocumentTocComponent,
    VersionActionsDropdownComponent,
    VersionsPaneComponent,
    VersionsPaneGroupComponent,
    DocumentAnnotationsComponent,
    DocumentEditorComponent,
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    AknDocumentRoutingModule,
    LeosLegacyModule,
    SharedModule,
    MatTreeModule,
  ],
  providers: [AnnotateService],
})
export class AknDocumentModule {}
