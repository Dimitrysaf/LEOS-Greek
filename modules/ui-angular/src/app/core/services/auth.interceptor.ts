import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
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

  private handleWithToken(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.accessToken$.pipe(
      switchMap((token) => next.handle(this.addToken(req, token))),
      catchError(this.errorHandler),
    );
  }

  private addToken(req: HttpRequest<any>, token: string) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private errorHandler(requestError: HttpErrorResponse) {
    if (requestError?.status === 401) {
      console.warn(
        'stub:',
        'Unhandled `accessToken` renewal failure.',
        requestError.message,
      ); // FIXME
    }
    return throwError(() => requestError);
  }
}
