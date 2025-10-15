import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import {AppConfigService} from "@/core/services/app-config.service";

export const adminGuard: CanActivateFn = (route, state) => {
  const configService = inject(AppConfigService);
  const router = inject(Router);

  return configService.config.pipe(
    take(1),
    map(config =>{
      const hasAccess  = config.userAppPermissions.includes('CAN_CREATE_TEMPLATE');
      if (!hasAccess) {
        router.navigate(['/home']);
      }
      return hasAccess;
    })
  );
};
