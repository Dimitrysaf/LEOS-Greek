import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@/shared/shared.module';

import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { UnathorizedComponent } from './components/unathorized/unathorized.component';

@NgModule({
  declarations: [
    UnathorizedComponent,
    ForbiddenComponent,
    PageNotFoundComponent,
  ],
  imports: [CommonModule, SharedModule],
})
export class ErrorModule {}
