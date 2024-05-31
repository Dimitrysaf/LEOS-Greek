import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ForbiddenComponent } from './features/error/components/forbidden/forbidden.component';
import { PageNotFoundComponent } from './features/error/components/page-not-found/page-not-found.component';
import { UnathorizedComponent } from './features/error/components/unathorized/unathorized.component';
import { DocumentUserGuard } from './shared/guards/document-user.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'index.jsp', redirectTo: 'home' },
  {
    path: 'error/page-not-found',
    component: PageNotFoundComponent,
  },
  {
    path: 'error/unauthorized',
    component: UnathorizedComponent,
  },
  {
    path: 'error/forbidden',
    component: ForbiddenComponent,
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./features/landing-page/landing-page.module').then(
        (m) => m.LandingPageModule,
      ),
  },
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
        'financial-statement',
      ];
      const isEditorRoute = url.length === 2 && paths.includes(url[0].path);
      return isEditorRoute ? { consumed: [] } : null;
    },
    canActivateChild: [DocumentUserGuard],
    loadChildren: () =>
      import('./features/akn-document/akn-document.module').then(
        (m) => m.AknDocumentModule,
      ),
  },
  {
    path: '**',
    redirectTo: 'error/not-found',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
