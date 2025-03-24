import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocumentEditorComponent } from '@/features/akn-document/containers/document-editor/document-editor.component';

const routes: Routes = [
  {
    path: 'annex/:id',
    component: DocumentEditorComponent,
    canDeactivate: [(component: DocumentEditorComponent) => component.canDeactivate()],
    data: { category: 'annex' },
  },
  {
    path: 'financial-statement/:id',
    component: DocumentEditorComponent,
    canDeactivate: [(component: DocumentEditorComponent) => component.canDeactivate()],
    data: { category: 'stat_digit_financ_legis' },
  },
  {
    path: 'memorandum/:id',
    component: DocumentEditorComponent,
    canDeactivate: [(component: DocumentEditorComponent) => component.canDeactivate()],
    data: { category: 'memorandum' },
  },
  {
    path: 'document/:id',
    component: DocumentEditorComponent,
    canDeactivate: [(component: DocumentEditorComponent) => component.canDeactivate()],
    data: { category: 'bill' },
  },
  {
    path: 'coverpage/:id',
    component: DocumentEditorComponent,
    canDeactivate: [(component: DocumentEditorComponent) => component.canDeactivate()],
    data: { category: 'coverPage' },
  },
  {
    path: 'explanatory/:id',
    component: DocumentEditorComponent,
    canDeactivate: [(component: DocumentEditorComponent) => component.canDeactivate()],
    data: { category: 'council_explanatory' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AknDocumentRoutingModule {}
