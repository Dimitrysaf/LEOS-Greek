import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, take, tap, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthService } from './auth.service';

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

  /** Appends the **Access Token** as `Authorization` header to the request. */
  private handleWithToken(req: HttpRequest<any>, next: HttpHandler) {
    let accessToken: string | null = null;
    return this.authService.accessToken$.pipe(
      take(1),
      tap((token) => (accessToken = token)),
      switchMap((token) => next.handle(this.addToken(req, token))),
      catchError((e) => this.errorHandler(e, accessToken)),
    );
  }

  /** Adds the `Authorization` header to the request. */
  private addToken(req: HttpRequest<any>, token: string) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
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
