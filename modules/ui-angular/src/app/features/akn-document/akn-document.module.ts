import { CommonModule } from '@angular/common';
import { InjectionToken, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { RouteReuseStrategy } from '@angular/router';

import { AknDocumentRoutingModule } from '@/features/akn-document/akn-document-routing.module';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DownloadEconsiliumComponent } from '@/features/akn-document/components/download-econsilium/download-econsilium.component';
import { DownloadEconsiliumModalComponent } from '@/features/akn-document/components/download-econsilium-modal/download-econsilium-modal.component';
import { RevisionPaneGroupComponent } from '@/features/akn-document/components/revision-pane-group/revision-pane-group.component';
import { RibbonToolbarDropdownComponent } from '@/features/akn-document/components/ribbon-toolbar-dropdown/ribbon-toolbar-dropdown.component';
import { SearchVersionsPaneComponent } from '@/features/akn-document/components/search-versions-pane/search-versions-pane.component';
import { RevisionPaneComponent } from '@/features/akn-document/containers/revision-pane/revision-pane.component';
import { DocumentActionsService } from '@/features/akn-document/services/document-actions.service';
import { DocumentActionsMandateService } from '@/features/akn-document/services/document-actions-mandate.service';
import { DocumentActionsProposalService } from '@/features/akn-document/services/document-actions-proposal.service';
import { TocInlineEditMenuMandateService } from '@/features/akn-document/services/toc-inline-edit-menu.mandate.service';
import { TocInlineEditMenuProposalService } from '@/features/akn-document/services/toc-inline-edit-menu.proposal.service';
import { TocInlineEditMenuService } from '@/features/akn-document/services/toc-inline-edit-menu.service';
import { TrackChangesActionsService } from '@/features/akn-document/services/track-changes-actions.service';
import { ValidateTocMandateService } from '@/features/akn-document/services/validate-node-drop.mandate.service';
import { LeosLegacyModule } from '@/features/leos-legacy/leos-legacy.module';
import { MergeActionsComponent } from '@/shared/components/merge-actions/merge-actions.component';
import { CN } from '@/shared/constants';
import { SharedModule } from '@/shared/shared.module';

import { AknRouteReUseStrategy } from './akn-route-strategy';
import { DocumentComponent } from './components/annex-document/document.component';
import { DocumentActionsDropdownComponent } from './components/document-actions-dropdown/document-actions-dropdown.component';
import { DocumentSearchComponent } from './components/document-search/document-search.component';
import { ImportFromJournalComponent } from './components/import-from-journal/import-from-journal.component';
import { ImportFromJournalDialogComponent } from './components/import-from-journal-dialog/import-from-journal-dialog.component';
import { RibbonToolbarBaseComponent } from './components/ribbon-toolbar-base/ribbon-toolbar-base.component';
import { RibbonToolbarButtonComponent } from './components/ribbon-toolbar-button/ribbon-toolbar-button.component';
import { RibbonToolbarCheckboxComponent } from './components/ribbon-toolbar-checkbox/ribbon-toolbar-checkbox.component';
import { RibbonToolbarLabelComponent } from './components/ribbon-toolbar-label/ribbon-toolbar-label.component';
import { RibbonToolbarSectionComponent } from './components/ribbon-toolbar-section/ribbon-toolbar-section.component';
import { SaveVersionComponent } from './components/save-version/save-version.component';
import { SaveVersionDialogComponent } from './components/save-version-dialog/save-version-dialog.component';
import { TocActionMenuComponent } from './components/toc-action-menu/toc-action-menu.component';
import { TocActionsButtonsComponent } from './components/toc-actions-buttons/toc-actions-buttons.component';
import { TocEditorComponent } from './components/toc-editor/toc-editor.component';
import { TrackChangesActionsComponent } from './components/track-changes-actions/track-changes-actions.component';
import { VersionActionsDropdownComponent } from './components/version-actions-dropdown/version-actions-dropdown.component';
import { VersionsPaneGroupComponent } from './components/versions-pane-group/versions-pane-group.component';
import { DocumentEditorComponent } from './containers/document-editor/document-editor.component';
import { DocumentTocComponent } from './containers/document-toc/document-toc.component';
import { RibbonToolbarContainerComponent } from './containers/ribbon-toolbar-container/ribbon-toolbar-container.component';
import { VersionsPaneComponent } from './containers/versions-pane/versions-pane.component';
import { BlockDocumentEditorService } from './services/block-document-editor.service';
import { CKEditorService } from './services/ckeditor.service';
import { TableOfContentMandateEditService } from './services/table-of-content-edit.mandate.service';
import { TableOfContentProposalEditService } from './services/table-of-content-edit.proposal.service';
import { TableOfContentEditService } from './services/table-of-content-edit.service';
import { ValidateTocProposalService } from './services/validate-node-drop.proposal.service';
import { ValidateTocService } from './services/validate-node-drop.service';

export const DOCUMENT_ACTIONS_SERVICE =
  new InjectionToken<DocumentActionsService>('DocumentActionsService');

@NgModule({
  declarations: [
    DocumentComponent,
    DocumentSearchComponent,
    VersionActionsDropdownComponent,
    VersionsPaneComponent,
    VersionsPaneGroupComponent,
    SearchVersionsPaneComponent,
    DocumentEditorComponent,
    DownloadEconsiliumModalComponent,
    ImportFromJournalDialogComponent,
    TocActionsButtonsComponent,
    TocEditorComponent,
    DocumentTocComponent,
    SaveVersionDialogComponent,
    RevisionPaneComponent,
    RevisionPaneGroupComponent,
    TrackChangesActionsComponent,
    RibbonToolbarContainerComponent,
    RibbonToolbarButtonComponent,
    RibbonToolbarCheckboxComponent,
    RibbonToolbarSectionComponent,
    RibbonToolbarDropdownComponent,
    RibbonToolbarBaseComponent,
    TrackChangesActionsComponent,
    MergeActionsComponent,
    TocActionMenuComponent,
    SaveVersionComponent,
    DocumentActionsDropdownComponent,
    ImportFromJournalComponent,
    DownloadEconsiliumComponent,
    RibbonToolbarLabelComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AknDocumentRoutingModule,
    LeosLegacyModule,
    SharedModule,
    MatTreeModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  providers: [
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
    {
      provide: TocInlineEditMenuService,
      useClass:
        process.env.NG_APP_LEOS_INSTANCE.toLowerCase() === CN.toLowerCase()
          ? TocInlineEditMenuMandateService
          : TocInlineEditMenuProposalService,
    },
    {
      provide: DOCUMENT_ACTIONS_SERVICE,
      useClass:
        process.env.NG_APP_LEOS_INSTANCE.toLowerCase() === CN.toLowerCase()
          ? DocumentActionsMandateService
          : DocumentActionsProposalService,
    },
    TrackChangesActionsService,
    CKEditorService,
    BlockDocumentEditorService,
  ],
  exports: [TrackChangesActionsComponent, MergeActionsComponent],
})
export class AknDocumentModule {}
