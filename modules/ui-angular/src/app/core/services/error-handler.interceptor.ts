import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UxAppShellService } from '@eui/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private uxAppShellService: UxAppShellService,
    private router: Router,
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        // this.uxAppShellService.growl();
        this.uxAppShellService.isBlockDocumentActive = false;
        switch (err.status) {
          //unathorized
          case 401:
            this.router.navigate(['error/unauthorized'], { replaceUrl: true });
            break;
          //forbidden
          case 403:
            this.router.navigate(['error/forbidden'], { replaceUrl: true });
            break;
          //not found
          case 404:
            this.router.navigate(['error/page-not-found'], {
              replaceUrl: true,
            });
            break;
          case 400:
          case 500: {
            this.uxAppShellService.growl({
              severity: 'danger',
              summary: 'Error',
              detail: `${err.error}`,
              life: 4000,
            });
            break;
          }
        }
        return throwError(err);
      }),
    );
  }
}
