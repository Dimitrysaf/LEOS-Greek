import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTreeModule } from '@angular/material/tree';
import { EuiAllModule } from '@eui/components';
import { UxAllModule } from '@eui/components/legacy';
import { TranslateModule } from '@ngx-translate/core';
import { NgForTrackByPropertyModule } from 'ng-for-track-by-property';

import { AknDocumentComponent } from './components/akn-document/akn-document.component';
import { DocumentAnnotationsComponent } from './components/document-annotations/document-annotations.component';
import { DocumentTocComponent } from './components/document-toc/document-toc.component';
import { ProposalCreateDraftComponent } from './components/proposal-create-draft/proposal-create-draft.component';
import { ProposalCreateFormComponent } from './components/proposal-create-form/proposal-create-form.component';
import { ProposalCreateTemplateSelectorComponent } from './components/proposal-create-template-selector/proposal-create-template-selector.component';
import { ShowOnInstanceDirective } from './directives/showOnInstance.directive';

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
    DocumentTocComponent,
    AknDocumentComponent,
    DocumentAnnotationsComponent,
    ShowOnInstanceDirective,
  ],
  exports: [
    UxAllModule,
    EuiAllModule,
    NgForTrackByPropertyModule,
    TranslateModule,
    FormsModule,
    DragDropModule,
    MatTreeModule,
    DocumentTocComponent,
    AknDocumentComponent,
    DocumentAnnotationsComponent,
    ShowOnInstanceDirective,
    ProposalCreateDraftComponent,
    ProposalCreateFormComponent,
    ProposalCreateTemplateSelectorComponent,
  ],
})
export class SharedModule {}
