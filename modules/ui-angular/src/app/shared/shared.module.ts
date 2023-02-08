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
  ],
})
export class SharedModule {}
