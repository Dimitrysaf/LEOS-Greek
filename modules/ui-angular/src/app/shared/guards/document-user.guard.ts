import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { filter, map, Observable, of, switchMap } from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';

import { Permission } from '../models/roles.model';
import { DocumentService } from '../services/document.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentUserGuard implements CanActivateChild {
  private permissionsRequired: Permission[] = ['CAN_READ'];

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
      return this.appConfig.config.pipe(
        filter(Boolean),
        switchMap((config) => {
          if (
            config.userAppPermissions &&
            config.userAppPermissions.length > 0 &&
            this.permissionsRequired.every((required) =>
              config.userAppPermissions.includes(required),
            )
          ) {
            return of(true);
          }
          return this.doc
            .getDocumentForUser(childRoute.params.id, config.user.login)
            .pipe(map((val) => val && val != null));
        }),
      );
    }
    return false;
  }
}
