import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTreeModule } from '@angular/material/tree';
import { EuiAllModule } from '@eui/components';
import { UxAllModule } from '@eui/components/legacy';
import { TranslateModule } from '@ngx-translate/core';
import { NgForTrackByPropertyModule } from 'ng-for-track-by-property';

import { DraggableSplitterComponent } from '@/features/akn-document/containers/draggable-splitter/draggable-splitter.component';

import { AknDocumentComponent } from './components/akn-document/akn-document.component';
import { CoEditionDetectedDialogComponent } from './components/co-edition-detected-dialog/co-edition-detected-dialog.component';
import { CoEditionInfoComponent } from './components/co-edition-info/co-edition-info.component';
import { ConfirmDeleteDialogComponent } from './components/confirm-delete-dialog/confirm-delete-dialog.component';
import { DocumentAnnotationsComponent } from './components/document-annotations/document-annotations.component';
import { MilestoneTocComponent } from './components/milestone-toc/milestone-toc.component';
import { ProposalCreateDraftComponent } from './components/proposal-create-draft/proposal-create-draft.component';
import { ProposalCreateFormComponent } from './components/proposal-create-form/proposal-create-form.component';
import { ProposalCreateTemplateSelectorComponent } from './components/proposal-create-template-selector/proposal-create-template-selector.component';
import { ProposalMilestoneViewComponent } from './components/proposal-milestone-view/proposal-milestone-view.component';
import { ShowOnInstanceDirective } from './directives/showOnInstance.directive';
import { UserHasPermissionDirective } from './directives/userHasPermission.directive';
import { EscapeHtmlPipe } from './pipes/escape-html.pipe';
import { HtmlToPlaintextPipe } from './pipes/html-to-plaintext.pipe';
import { UnescapeHtmlPipe } from './pipes/unescape-html.pipe';

@NgModule({
  imports: [
    UxAllModule,
    EuiAllModule,
    NgForTrackByPropertyModule,
    TranslateModule,
    FormsModule,
    DragDropModule,
    MatTreeModule,
  ],
  declarations: [
    AknDocumentComponent,
    DocumentAnnotationsComponent,
    ShowOnInstanceDirective,
    UserHasPermissionDirective,
    ProposalCreateDraftComponent,
    ProposalCreateFormComponent,
    ProposalCreateTemplateSelectorComponent,
    ConfirmDeleteDialogComponent,
    CoEditionInfoComponent,
    CoEditionDetectedDialogComponent,
    MilestoneTocComponent,
    DraggableSplitterComponent,
    ProposalMilestoneViewComponent,
    HtmlToPlaintextPipe,
    EscapeHtmlPipe,
    UnescapeHtmlPipe,
  ],
  exports: [
    UxAllModule,
    EuiAllModule,
    NgForTrackByPropertyModule,
    TranslateModule,
    FormsModule,
    DragDropModule,
    MatTreeModule,
    AknDocumentComponent,
    DocumentAnnotationsComponent,
    ShowOnInstanceDirective,
    UserHasPermissionDirective,
    ProposalCreateDraftComponent,
    ProposalCreateFormComponent,
    ProposalCreateTemplateSelectorComponent,
    ConfirmDeleteDialogComponent,
    CoEditionInfoComponent,
    CoEditionDetectedDialogComponent,
    DraggableSplitterComponent,
    ProposalMilestoneViewComponent,
    HtmlToPlaintextPipe,
    EscapeHtmlPipe,
    UnescapeHtmlPipe,
  ],
})
export class SharedModule {}
