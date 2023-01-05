import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'workspace', pathMatch: 'full' },
  { path: 'index.jsp', redirectTo: 'workspace' },
  {
    path: 'workspace',
    loadChildren: () =>
      import('./features/proposals/proposals.module').then(
        (m) => m.ProposalsModule,
      ),
  },
  {
    path: 'collection',
    loadChildren: () =>
      import('./features/proposal-view/proposal-view.module').then(
        (m) => m.ProposalViewModule,
      ),
  },
  {
    matcher: (url) => {
      const paths = [
        'annex',
        'coverpage',
        'document',
        'explanatory',
        'memorandum',
      ];
      const isEditorRoute = url.length === 2 && paths.includes(url[0].path);
      return isEditorRoute ? { consumed: [] } : null;
    },
    loadChildren: () =>
      import('./features/akn-document/akn-document.module').then(
        (m) => m.AknDocumentModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
