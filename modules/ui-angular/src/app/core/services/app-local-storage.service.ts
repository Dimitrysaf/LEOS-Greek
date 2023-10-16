import { Injectable } from '@angular/core';

import { NamespacedLocalStorageService } from './namespaced-local-storage.service';

/**
 * App specific local storage service. Internally it uses the current app path
 * from the base URI as key prefix.
 *
 * - Stored items will be accessible to all tabs of the same app.
 * - Stored items will also be accessible to all tabs of the same origin, using
 * the localStorage API directly.
 */
@Injectable({
  providedIn: 'root',
})
export class AppLocalStorageService extends NamespacedLocalStorageService {
  constructor() {
    const appPath = new URL(document.baseURI).pathname;
    super(appPath);
  }
}
