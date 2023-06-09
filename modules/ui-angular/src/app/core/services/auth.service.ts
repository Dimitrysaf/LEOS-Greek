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
  filter,
  Observable,
  Subject,
  take,
  takeUntil,
} from 'rxjs';
import { apiBaseUrl } from 'src/config';

import { ConfirmReloadDialogComponent } from '@/shared/components/confirm-reload-dialog/confirm-reload-dialog.component';

import { AccessTokenResponse, TokenData } from '../models';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  static readonly TOKEN_KEY = 'tokenData';
  static readonly RENEW_WINDOW = 60_000;
  static readonly RENEW_RANDOMNESS_FACTOR = 10_000;

  accessToken$: Observable<string>;

  private accessTokenBS = new BehaviorSubject<string | null>(null);
  private renewalTimeout: number;
  private destroy$ = new Subject<void>();
  private http: HttpClient; // without interceptors!
  private storage = new LocalStorageService();

  constructor(
    private handler: HttpBackend,
    private dialogService: EuiDialogService,
    private translateService: TranslateService,
  ) {
    this.http = new HttpClient(this.handler);
    this.initAccessToken();
    this.accessToken$ = this.accessTokenBS.pipe(
      filter(Boolean),
      take(1),
      takeUntil(this.destroy$),
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  requiresToken(url: string) {
    return url.startsWith(`${apiBaseUrl}/secured/`);
  }

  private initAccessToken() {
    const { accessToken, expiresIn } = this.loadTokenData();
    if (this.tokenRenewedRecently(expiresIn)) {
      this.setAccessToken(accessToken, expiresIn);
    } else {
      this.renewIfNecessary();
    }
  }

  private setAccessToken(accessToken: string, expiresIn: number) {
    this.accessTokenBS.next(accessToken);
    this.scheduleTokenRenewal(expiresIn);
  }

  private scheduleTokenRenewal(expiresIn: number) {
    clearTimeout(this.renewalTimeout);
    this.renewalTimeout = window.setTimeout(
      () => this.renewIfNecessary(),
      this.getTimeToNextRenewal(expiresIn),
    );
  }

  private renewIfNecessary() {
    const { expiresIn } = this.loadTokenData();
    if (!this.tokenRenewedRecently(expiresIn)) {
      this.renewAccessToken();
    }
  }

  private renewAccessToken() {
    this.http
      .get<AccessTokenResponse>(
        `${apiBaseUrl}/token`,
        process.env.NG_APP_REFRESH_TOKEN
          ? {
              headers: {
                'grant-type': 'jwt-bearer',
                assertion: process.env.NG_APP_REFRESH_TOKEN,
              },
            }
          : undefined,
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ accessToken, expiresIn }) => {
          this.storeTokenData({ accessToken, expiresIn });
          this.setAccessToken(accessToken, expiresIn);
        },
        error: (requestError: HttpErrorResponse) => {
          if (requestError.status === 403) {
            setTimeout(() => {
              this.dialogService.openDialog({
                title: this.translateService.instant(
                  'popup.token.expired.title',
                ),
                bodyComponent: {
                  component: ConfirmReloadDialogComponent,
                },
                accept: () => {
                  location.reload();
                },
              });
            });
          } else {
            console.warn(
              'stub:',
              'Unhandled `accessToken` renewal failure.',
              requestError.message,
            ); // FIXME
            throw requestError;
          }
        },
      });
  }

  private storeTokenData(tokenData: TokenData) {
    this.storage.set(AuthService.TOKEN_KEY, tokenData);
  }

  private loadTokenData(): TokenData {
    return this.storage.get(AuthService.TOKEN_KEY) ?? { expiresIn: 0 };
  }

  private getTimeToNextRenewal(expiresIn: number) {
    const timeToExpiry = expiresIn - Date.now();
    const randomness = Math.random() * AuthService.RENEW_RANDOMNESS_FACTOR;
    const expiryWindow = AuthService.RENEW_WINDOW + Math.round(randomness);
    return Math.max(timeToExpiry - expiryWindow, 0);
  }

  private tokenRenewedRecently(expiresIn: number) {
    const timeToExpiry = expiresIn - Date.now();
    const maxExpiryWindow =
      AuthService.RENEW_WINDOW + AuthService.RENEW_RANDOMNESS_FACTOR;
    return timeToExpiry > maxExpiryWindow;
  }
}
