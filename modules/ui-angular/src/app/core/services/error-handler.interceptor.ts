import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UxAppShellService } from '@eui/core';
import { TranslateService } from '@ngx-translate/core';
import { catchError, Observable, throwError } from 'rxjs';

/**
 * Use this interceptor to prevent error handling from the backend.
 *
 * @use this.http.get(url, { context: new HttpContext().set(IS_ERROR_INTERCEPTION_ENABLED, (err) => err.status !== 500) })
 */
export const IS_ERROR_INTERCEPTION_ENABLED = new HttpContextToken(
  () => (err: HttpErrorResponse) => true,
);

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private uxAppShellService: UxAppShellService,
    private router: Router,
    private translate: TranslateService,
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        const isEnabled = req.context.get(IS_ERROR_INTERCEPTION_ENABLED)(err);

        if (isEnabled) {
          if (err.status === 401) {
            void this.router.navigate(['error/unauthorized'], {
              replaceUrl: true,
            });
          } else if (err.status === 403) {
            void this.router.navigate(['error/forbidden'], {
              replaceUrl: true,
            });
          } else if (err.status === 404) {
            void this.router.navigate(['error/page-not-found'], {
              replaceUrl: true,
            });
          } else if (err.status >= 400) {
            if (err.error instanceof Blob) {
              err.error.text().then((text) => {
                this.notifyError(text);
              });
            } else {
              this.notifyError(`${err.error}`);
            }
          }
        }

        return throwError(() => err);
      }),
    );
  }

  private notifyError(message: string) {
    this.translate
      .get('global.notifications.title.error')
      .subscribe((title) => {
        this.uxAppShellService.isBlockDocumentActive = false;
        this.uxAppShellService.growl({
          severity: 'danger',
          summary: title,
          detail: message,
          sticky: true,
        });
      });
  }
}
