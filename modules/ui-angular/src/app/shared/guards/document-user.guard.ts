import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { filter, map, Observable, switchMap } from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';

import { DocumentService } from '../services/document.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentUserGuard implements CanActivateChild {
  constructor(
    private appConfig: AppConfigService,
    private doc: DocumentService,
  ) {}

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    if (childRoute.params.id) {
      return this.appConfig.config
        .pipe(
          filter(Boolean),
          switchMap((config) =>
            this.doc.getDocumentForUser(
              childRoute.params.id,
              config.user.login,
            ),
          ),
        )
        .pipe(map((val) => val && val != null));
    }
    return false;
  }
}
