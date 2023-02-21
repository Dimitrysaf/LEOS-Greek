import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { RoleEntry } from '@/shared';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  config = of({
    title:
      process.env.NG_APP_LEOS_INSTANCE === 'ec'
        ? 'EdiT Drafting'
        : process.env.NG_APP_LEOS_INSTANCE === 'cn'
        ? 'EdiT Revision'
        : 'LEOS',
    roles: [],
  } as LeosAppConfig);
  // TODO: Use proper API when implemented
  // config = this.http
  //   .get<LeosAppConfig>('api/secured/getConfig')
  //   .pipe(shareReplay(1));

  constructor(private http: HttpClient) {}
}

export type LeosAppConfig = {
  title: string;
  roles: RoleEntry[];
};
