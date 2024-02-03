import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxEnvModule } from '@ngx-env/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppStarterService } from './app-starter.service';
import { CoreModule } from './core/core.module';
import { DocumentUserGuard } from './shared/guards/document-user.guard';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    AppRoutingModule,
    NgxEnvModule,
  ],
  providers: [
    DocumentUserGuard,
    AppStarterService,
    {
      provide: APP_INITIALIZER,
      useFactory: (appStarterService) => () =>
        new Promise<void>((resolve) => {
          appStarterService.start().subscribe(() => resolve());
        }),
      deps: [AppStarterService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
