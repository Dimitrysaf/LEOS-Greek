import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { preInitApp } from '@eui/core';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const USE_SERVICE_WORKER = true; // Set to false when you want to remove it

if ('serviceWorker' in navigator) {
  if (USE_SERVICE_WORKER) {
    // Unregister all existing service workers first
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      const unregisterPromises = registrations.map(registration => registration.unregister());
      return Promise.all(unregisterPromises);
    }).then(() => {
      // Register the new service worker
      const baseHref = document.getElementsByTagName('base')[0]?.href || '/';
      const swPath = new URL('ecasSw.js', baseHref).pathname;
      return navigator.serviceWorker.register(swPath);
    }).then((registration) => {
      registration.update();
    });
  } else {
    // Unregister all service workers
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  }
}




preInitApp(environment).then(() =>
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err)),
);
