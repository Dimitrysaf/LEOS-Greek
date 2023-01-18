import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  Observable,
  Subject,
  take,
  takeUntil,
} from 'rxjs';

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

  constructor(private handler: HttpBackend) {
    // FIXME: this should happen during login process
    this.storeTokenData({
      refreshToken:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsIm5iZiI6MTY2NTQwMzQ2NiwiaXNzIjoibmdMZW9zQ2xpZW50SWQiLCJleHAiOjE2OTY5Mzk0NjYsImlhdCI6MTY2NTQwMzQ2NiwidXNlciI6ImphbmUifQ.ew5d0wGqGt0WuzPp1vdoy8XoVQr6w6b-wV9-51-7N1Y',
      expiresIn: 0,
    });
    this.http = new HttpClient(handler);
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
    const { refreshToken, expiresIn } = this.loadTokenData();
    if (this.tokenRenewedRecently(expiresIn)) {
      return;
    }
    this.renewAccessToken(refreshToken);
  }

  private renewAccessToken(refreshToken: string) {
    this.http
      .get<AccessTokenResponse>('api/token', {
        headers: {
          'grant-type': 'jwt-bearer',
          assertion: refreshToken,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ accessToken, expiresIn }) => {
          this.storeTokenData({ refreshToken, accessToken, expiresIn });
          this.setAccessToken(accessToken, expiresIn);
        },
        error: (requestError: HttpErrorResponse) => {
          console.warn(
            'stub:',
            'Unhandled `accessToken` renewal failure.',
            requestError.message,
          ); // FIXME
          throw requestError;
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
