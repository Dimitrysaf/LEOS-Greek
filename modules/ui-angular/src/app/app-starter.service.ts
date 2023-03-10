import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  CONFIG_TOKEN,
  EuiAppConfig,
  I18nService,
  UserDetails,
  UserPreferences,
  UserService,
} from '@eui/core';
import { Observable, of, zip } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

import { User } from './shared';

@Injectable({
  providedIn: 'root',
})
export class AppStarterService {
  defaultUserPreferences: UserPreferences;

  constructor(
    protected userService: UserService,
    protected i18nService: I18nService,
    @Inject(CONFIG_TOKEN) private config: EuiAppConfig,
    protected http: HttpClient,
  ) {}

  start(): Observable<any> {
    return zip(
      this.initUserService().pipe(
        switchMap((userStatus) => this.i18nService.init()),
      ),
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
    return this.http.get<User>('api/secured/users/current').pipe(
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
