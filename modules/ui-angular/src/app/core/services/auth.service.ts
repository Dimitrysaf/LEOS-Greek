import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { EuiDialogService } from '@eui/components/eui-dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  interval,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { apiBaseUrl } from 'src/config';

import { ConfirmReloadDialogComponent } from '@/shared/components/confirm-reload-dialog/confirm-reload-dialog.component';

import { AccessTokenResponse, TokenData } from '../models';
import { AppLocalStorageService } from './app-local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  static readonly TOKEN_KEY = 'tokenData';
  /** Minimum time remaining before the **Access Token** is auto-renewed, in ms. */
  static readonly RENEW_WINDOW = 1000 * 60 * 5; // 5 min
  static readonly EXPIRY_CHECK_INTERVAL = 1000 * 60 * 5; // 5 min

  /**
   * Emits the current **Access Token**, after it is set.
   * - The most recent value is emitted immediately.
   * - Nothing is emitted until the token is set.
   * - Any subsequent values are emitted, iff they are not equal to their
   * current value.
   * ```
   * src  -a--a--b---|
   * sub1 ^----------!
   * exp1 -a-----b---
   * sub2 -^---------!
   * exp2 -a-----b---
   * sub2 --^--------!
   * exp2 --a----b---
   * sub3 --------^--!
   * exp3 --------b--
   * ```
   */
  accessToken$: Observable<string>;

  /** The current **Access Token**. */
  private accessTokenBS = new BehaviorSubject<string | null>(null);
  private destroy$ = new Subject<void>();
  private http: HttpClient; // without interceptors!

  constructor(
    private handler: HttpBackend,
    private dialogService: EuiDialogService,
    private translateService: TranslateService,
    private storage: AppLocalStorageService,
  ) {
    this.http = new HttpClient(this.handler);
    this.initAccessToken();
    this.watchAccessTokenStorage();
    this.monitorExpiryInStorage();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  requiresToken(url: string) {
    return url.startsWith(`${apiBaseUrl}/secured/`);
  }

  markTokenAsExpired(token: string | null) {
    const storedTokenData = this.loadTokenData();
    console.debug(
      '[auth.service] markTokenAsExpired - expired: "%s", localStorage: "%s"',
      token,
      JSON.stringify(storedTokenData),
    ); // DEBUG
    if (token === storedTokenData?.accessToken) {
      console.debug('[auth.service] markTokenAsExpired - removing'); // DEBUG
      this.storage.remove(AuthService.TOKEN_KEY);
      this.showExpiredTokenPopup();
    } else {
      console.debug(
        '[auth.service] markTokenAsExpired - already updated in localStorage',
      ); // DEBUG
    }
  }

  /**
   * Initializes the **Access Token**. If found in storage and not expired, then
   * it gets reused, else it gets renewed.
   */
  private initAccessToken() {
    console.debug('[auth.service] initAccessToken'); // DEBUG
    this.accessToken$ = this.accessTokenBS.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      filter(Boolean),
    );
    const tokenData = this.loadTokenData();
    const isExpired = this.isExpired(tokenData.expiresIn);
    if (isExpired) {
      console.debug(
        '[auth.service] initAccessToken - missing or expired tokenData from localStorage - renewing',
        tokenData,
      ); // DEBUG
      this.renewAccessToken();
    } else {
      console.debug(
        '[auth.service] initAccessToken - using existing tokenData from localStorage',
        tokenData,
      ); // DEBUG
      this.setAccessToken(tokenData);
    }
  }

  private isExpired(expiresIn: number) {
    return expiresIn < Date.now();
  }

  /**
   * Syncs any **Access Token** storage changes to the service state.
   * This can happen either from this app instance or from another tab.
   */
  private watchAccessTokenStorage() {
    this.storage
      .observe(AuthService.TOKEN_KEY)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const tokenData = this.loadTokenData();
        console.debug(
          '[auth.service] watchAccessTokenStorage - tokenData changed',
          tokenData,
        ); // DEBUG
        this.setAccessToken(tokenData);
      });
  }

  /**
   * Periodically checks the **Access Token** expiry in the local storage.
   * - If expired, it displays a message to the user.
   * - If close to expiring, it renews the token.
   */
  private monitorExpiryInStorage() {
    const sub = interval(AuthService.EXPIRY_CHECK_INTERVAL)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const { expiresIn } = this.loadTokenData();

        if (this.isExpired(expiresIn)) {
          sub.unsubscribe();
          console.debug(
            '[auth.service] monitorExpiryInStorage - expired token',
          ); // DEBUG
          this.showExpiredTokenPopup();
        } else if (!this.tokenRenewedRecently(expiresIn)) {
          console.debug(
            '[auth.service] monitorExpiryInStorage - renew expiring token',
          ); // DEBUG
          this.renewAccessToken();
        }
      });
  }

  private showExpiredTokenPopup() {
    return this.dialogService.openDialog({
      title: this.translateService.instant('popup.token.expired.title'),
      bodyComponent: {
        component: ConfirmReloadDialogComponent,
      },
      accept: () => {
        location.reload();
      },
    });
  }

  private setAccessToken({ accessToken }: TokenData) {
    this.accessTokenBS.next(accessToken);
  }

  /**
   * Renews the **Access Token**. Depending on the outcome, it either
   * 1. on success: persists the token in local storage, or
   * 2. on failure: shows a popup for known errors or throws error
   */
  private renewAccessToken() {
    const options = process.env.NG_APP_REFRESH_TOKEN
      ? {
          headers: {
            'grant-type': 'jwt-bearer',
            assertion: process.env.NG_APP_REFRESH_TOKEN,
          },
        }
      : undefined;
    this.http
      .get<AccessTokenResponse>(`${apiBaseUrl}/token`, options)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ accessToken, expiresIn }) => {
          console.debug('[auth.service] renewAccessToken - token renewed', {
            accessToken,
            expiresIn,
          }); // DEBUG
          this.storeTokenData({ accessToken, expiresIn });
        },
        error: (requestError: HttpErrorResponse) => {
          console.debug(
            '[auth.service] renewAccessToken - token renewal failed',
            requestError,
          ); // DEBUG
          this.handleRenewTokenError(requestError);
        },
      });
  }

  /**
   * Handles the **Access Token** renewal failure. It either shows a popup for
   * known errors or it throws an `HttpErrorResponse`.
   */
  private handleRenewTokenError(requestError: HttpErrorResponse) {
    if (requestError.status === 403) {
      setTimeout(() => {
        this.showExpiredTokenPopup();
      });
    } else {
      console.warn(
        'stub:',
        'Unhandled `accessToken` renewal failure.',
        requestError.message,
      ); // FIXME
      throw requestError;
    }
  }

  /**
   * Persists the **Token Data** in the local storage. It is shared across all
   * tabs running the application (same origin and path).
   */
  private storeTokenData(tokenData: TokenData) {
    this.storage.set(AuthService.TOKEN_KEY, tokenData);
  }

  /**
   * Reads the stored **Token Data** from the local storage or creates an empty
   * "expired" one. It is shared across all tabs running the application (same
   * origin and path).
   */
  private loadTokenData(): TokenData {
    return this.storage.get(AuthService.TOKEN_KEY) ?? { expiresIn: 0 };
  }

  /**
   * Returns `true` if the **Access Token** is expiring soon.
   */
  private tokenRenewedRecently(expiresIn: number) {
    const timeToExpiry = expiresIn - Date.now();
    return timeToExpiry < AuthService.RENEW_WINDOW;
  }
}
