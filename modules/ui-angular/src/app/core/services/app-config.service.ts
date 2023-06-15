import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import { apiBaseUrl } from 'src/config';

import { LeosAppConfig, LeosConfig } from '@/shared';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  config = this.http
    .get<LeosConfig>(`${apiBaseUrl}/secured/config`)
    .pipe(map(createLeosAppConfig))
    .pipe(shareReplay(1));

  constructor(private http: HttpClient) {}
}

const createLeosAppConfig = (config: LeosConfig): LeosAppConfig => ({
  ...processConfig(config),
  userAppPermissions: resolveAppPermissions(config),
  leosBuildDate: process.env.NG_APP_LEOS_VERSION_BUILD_DATE,
  leosBuildTimestamp: process.env.NG_APP_LEOS_BUILD_TIMESTAMP,
  leosBuildVersion: process.env.NG_APP_LEOS_VERSION,
  leosSourceRevision: process.env.NG_APP_LEOS_SOURCE_REVISION,
});

const resolveAppPermissions = (config: LeosConfig) => {
  const roles = config.user.roles;
  const permissions = roles.flatMap((r) => config.permissionsMap[r]);
  return [...new Set(permissions)];
};

/** FIXME: Process config server response, injecting missing props. */
const processConfig = (config: LeosConfig) => {
  const newConfig = { ...config };
  const logError = (key: string, expected: string, value: string) =>
    console.error(
      `Expected ${key} to be ${expected}, but it has the value of "${value}".` +
        ' Remove code in AppConfigService.processConfig.',
    );
  if (config.user.lang === undefined) {
    newConfig.user = {
      ...config.user,
      lang: null,
    };
  } else {
    logError('config.user.lang', 'undefined', JSON.stringify(config.user.lang)); // FIXME
  }

  return newConfig;
};
