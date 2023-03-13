import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { I18nService, UserService } from '@eui/core';
import { Observable, zip } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { apiBaseUrl } from 'src/config';

import { AppConfigService } from '@/core/services/app-config.service';

import { User } from './shared';

@Injectable({
  providedIn: 'root',
})
export class AppStarterService {
  constructor(
    protected configService: AppConfigService,
    protected userService: UserService,
    protected i18nService: I18nService,
    protected http: HttpClient,
  ) {}

  start(): Observable<any> {
    return zip(
      this.configService.config,
      this.initUserService(),
      (config, user) => this.i18nService.init(/*config.user.lang*/),
    );
  }

  /**
   * Fetches user details,
   * create user: UserState object
   * then initialise to the UserService on run time
   */
  initUserService(): Observable<any> {
    return zip(this.fetchUserDetails()).pipe(
      switchMap(([userDetails]) => this.userService.init(userDetails)),
    );
  }

  /**
   * Fetches user details
   */
  private fetchUserDetails(): Observable<any> {
    return this.http.get<User>(`${apiBaseUrl}/secured/users/current`).pipe(
      map((user) => ({
        ...user,
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.name,
      })),
    );
  }
}
