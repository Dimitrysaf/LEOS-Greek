import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { preInitApp } from '@eui/core';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

if ('serviceWorker' in navigator) {
  const baseHref = document.getElementsByTagName('base')[0]?.href || '/';
  const swPath = new URL('sw.js', baseHref).pathname;
  navigator.serviceWorker.register(swPath).then(() => {
    console.log('Service Worker registered');
  });
}


preInitApp(environment).then(() =>
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err)),
);
