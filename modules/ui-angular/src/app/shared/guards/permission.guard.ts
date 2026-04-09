import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AppConfigService} from "@/core/services/app-config.service";
import {map, take} from "rxjs/operators";

export const permissionGuard: CanActivateFn = (route, state) => {
  const configService = inject(AppConfigService);
  const router = inject(Router);

  return configService.config.pipe(
    take(1),
    map(config =>{
      const requiredPermissions = route.data['permissions'] || [];
      const hasAccess  = requiredPermissions.some(p => config.userAppPermissions.includes(p));
      if (!hasAccess) {
        router.navigate(['/home']);
      }
      return hasAccess;
    })
  );
};
