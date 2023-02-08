import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AknDocumentComponent } from '@/features/akn-document/containers/akn-document/akn-document.component';
import { AnnexEditorComponent } from '@/features/akn-document/containers/annex-editor/annex-editor.component';

const routes: Routes = [
  {
    path: 'annex/:id',
    component: AnnexEditorComponent,
    data: { category: 'annex' },
  },
  // { path: 'coverpage:/id'), component: CoverpageEditorComponent },
  {
    path: 'document/:id',
    component: AknDocumentComponent,
    data: { category: 'akndocument' },
  },
  // { path: 'explanatory:/id'), component: ExplanatoryEditorComponent },
  // { path: 'memorandum:/id'), component: MemorandumEditorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AknDocumentRoutingModule {}
