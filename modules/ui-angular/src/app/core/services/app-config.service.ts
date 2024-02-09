import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { apiBaseUrl } from 'src/config';

import { LeosAppConfig, LeosConfig, Permission } from '@/shared';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  config: Observable<
    LeosConfig & {
      userAppPermissions: Permission[];
      leosBuildDate: string;
      leosBuildTimestamp: string;
      leosBuildVersion: string;
      leosSourceRevision: string;
    }
  >;

  constructor(private http: HttpClient, private location: Location) {
    // TODO: Need to populate headers from client input parameters.
    const url = new URL(document.baseURI + this.location.path());
    const urlParams = new URLSearchParams(url.search);
    const systemName = urlParams.get('systemName');

    const httpParams = {};
    if (systemName) {
      httpParams['systemName'] = systemName;
    }

    const options = {
      params: httpParams,
    };

    this.config = this.http
      .get<LeosConfig>(`${apiBaseUrl}/secured/config`, options)
      .pipe(map(createLeosAppConfig))
      .pipe(shareReplay(1));
  }
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
