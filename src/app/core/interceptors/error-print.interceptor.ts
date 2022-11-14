import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationService } from '../notification.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class ErrorPrintInterceptor implements HttpInterceptor {
  constructor(private readonly notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        error: (error: unknown) => {
          const url = new URL(request.url);
          let message;

          switch ((error as HttpErrorResponse).status.toString()) {
            case '401':
              message = `Authorization header is not provided.`;
              break;
            case '403':
              message = `Access is denied.`;
              break;
            default:
              message = 'Check the console for the details.';
              break;
          }

          this.notificationService.showError(
            `Request to "${url.pathname}" failed. ${message}`,
            0
          );
        },
      })
    );
  }
}
