/* eslint-disable no-console */
import { Location } from '@angular/common';
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
  interval, lastValueFrom,
  Observable,
  Subject,
  Subscription,
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
  accessToken$: Observable<TokenData>;

  /** The current **Access Token**. */
  private accessTokenBS = new BehaviorSubject<TokenData | null>(null);
  private destroy$ = new Subject<void>();
  private http: HttpClient; // without interceptors!
  private monitorExpirySub?: Subscription;

  constructor(
    private handler: HttpBackend,
    private location: Location,
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
      this.monitorExpirySub?.unsubscribe();
      this.showExpiredTokenPopup();
    } else {
      console.debug(
        '[auth.service] markTokenAsExpired - already updated in localStorage',
      ); // DEBUG
    }
  }

  /**
   * Reads the stored **Token Data** from the local storage or creates an empty
   * "expired" one. It is shared across all tabs running the application (same
   * origin and path).
   */
  loadTokenData(): TokenData {
    return this.storage.get(AuthService.TOKEN_KEY) ?? { expiresIn: 0 };
  }

  /**
   * Synchronously wait for the return of the get Token API call to store the token
   */
  async renewAccessTokenAsync() {
    try {
      const tokenResponse = await this.callAccessTokenAsync();
      const tokenData : TokenData = { accessToken: tokenResponse.accessToken, expiresIn:tokenResponse.expiresIn };
      this.storeTokenData(tokenData);
      console.debug('[auth.service] renewAccessTokenAsync - token renewed', tokenData); // DEBUG
    } catch (error) {
      console.debug(
        '[auth.getRenewTokenSync] getRenewTokenSync - token renewal failed',
        error,
      ); // DEBUG
      this.handleRenewTokenError(error);
    }

  }

  /**
   * Returns 'true' if current time + AuthService.RENEW_WINDOW is more than token's expiration time
   *
   * @param expiresIn
   * @private
   */
  isTokenToRenew(expiresIn: number) {
    const now_plus_RENEW_WINDOW = Date.now() + AuthService.RENEW_WINDOW;
    return now_plus_RENEW_WINDOW > expiresIn;
  }

  getClientContext() {
    const url = new URL(document.baseURI + this.location.path());
    const urlParams = new URLSearchParams(url.search);
    return urlParams.get('clientContext');
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
    this.monitorExpirySub = interval(AuthService.EXPIRY_CHECK_INTERVAL)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const { expiresIn } = this.loadTokenData();

        if (this.isTokenToRenew(expiresIn)) {
          console.debug(
            '[auth.service] monitorExpiryInStorage - renew expiring token',
          );
          this.renewAccessToken();
        }

      });
  }

  private showErrorPopup(msg) {
    return this.dialogService.openDialog({
      //title: this.translateService.instant('global.notifications.title.error'),
      //content: msg,
      title: this.translateService.instant('popup.token.expired.title'),
      content: this.translateService.instant('popup.token.expired.description'),
      hasCloseButton: false,
      hasDismissButton: false,
      accept: () => {
        location.reload();
      },
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

  private setAccessToken( tokenData : TokenData) {
    this.accessTokenBS.next(tokenData);
  }

  /**
   * Renews the **Access Token**. Depending on the outcome, it either
   * 1. on success: persists the token in local storage, or
   * 2. on failure: shows a popup for known errors or throws error
   */
  private renewAccessToken() {
    const headers = {};
    if (process.env.NG_APP_REFRESH_TOKEN) {
      headers['grant-type'] = 'jwt-bearer';
      headers['assertion'] = process.env.NG_APP_REFRESH_TOKEN;
    }

    const clientContext = this.getClientContext();
    if (clientContext) {
      headers["Client-Context"] = clientContext;
    }

    this.http
      .get<AccessTokenResponse>(`${apiBaseUrl}/token`, { headers })
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
   * call get token API and return a Promise
   */
  private async callAccessTokenAsync(): Promise<AccessTokenResponse>  {
    const options = process.env.NG_APP_REFRESH_TOKEN
      ? {
        headers: {
          'grant-type': 'jwt-bearer',
          assertion: process.env.NG_APP_REFRESH_TOKEN,
        },
      }
      : undefined;
    return await lastValueFrom(this.http.get<AccessTokenResponse>(`${apiBaseUrl}/token`, options));
  }

  /**
   * Handles the **Access Token** renewal failure. It either shows a popup for
   * known errors or it throws an `HttpErrorResponse`.
   */
  private handleRenewTokenError(requestError: HttpErrorResponse) {
    this.monitorExpirySub?.unsubscribe();
    if (requestError.status === 403) {
      setTimeout(() => {
        this.showExpiredTokenPopup();
      });
    } else if (requestError.status >= 400) {
      if (requestError.error instanceof Blob) {
        requestError.error.text().then((text) => {
          this.showErrorPopup(text);
        });
      } else {
        this.showErrorPopup(`${requestError.error}`);
      }
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

}
