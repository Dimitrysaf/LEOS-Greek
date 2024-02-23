/* eslint-disable no-console */
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, from, Observable, throwError} from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import {TokenData} from "@/core/models";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return this.authService.requiresToken(req.url)
      ? this.handleWithToken(req, next)
      : next.handle(req);
  }

  /**
   * Add token
   * - if localstore token is valid then it is used
   * - if token has expired: renew the token in synchronous manner
   */
  private async addTokenToRequest (request: HttpRequest<any>) {
    let tokenData = this.authService.loadTokenData();
    let expiresIn = tokenData.expiresIn;
    if (this.authService.isTokenToRenew(expiresIn)) {
      console.debug(
        '[auth.service] monitorExpiryInStorage - renew expiring token before connection',
      );
      await this.authService.renewAccessTokenAsync();
      //get the renewed token
      tokenData = this.authService.loadTokenData();
    }
    return this.addToken(request, tokenData);
  }

  /** Appends the **Access Token** as `Authorization` header to the request. */
  handleWithToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Make addTokenToRequest asynchronous and return an Observable
    return from(this.addTokenToRequest(request)).pipe(
      switchMap((authRequest:HttpRequest<any>) => {
        // Pass on the cloned request instead of the original request
        return next.handle(authRequest).pipe(
          catchError((e) => this.errorHandler(e, this.authService.loadTokenData().accessToken))
        );
      })
    );
  }

  /** Adds the `Authorization` header to the request. */
  private addToken(req: HttpRequest<any>, token: TokenData) {
    let accessToken = token.accessToken;
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  private errorHandler(
    requestError: HttpErrorResponse,
    accessToken: string | null,
  ) {
    console.debug(
      '[auth.interceptor] errorHandler - request failed',
      requestError,
    ); // DEBUG
    if (requestError?.status === 401) {
      console.debug(
        '[auth.interceptor] errorHandler - 401 markTokenAsExpired',
        accessToken,
      ); // DEBUG
      // API request failed with 401 Unauthorized - Access Token must be invalid
      this.authService.markTokenAsExpired(accessToken);
    }
    return throwError(() => requestError);
  }
}
