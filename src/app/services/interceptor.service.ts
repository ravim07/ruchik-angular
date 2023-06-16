import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private broadcastService: MsalBroadcastService,
    private msalService: MsalService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.auth.getAccessToken();
    const cloneRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next.handle(cloneRequest).pipe(
      catchError((err) => {
        if (err.status === 401) {
          this.logout();
          location.reload();
        }
        return throwError(() => {
          console.log(err);
        });
      })
    );
  }

  logout() {
    localStorage.clear();
    // location.href = `https://login.microsoftonline.com/b691ecf0-5e83-41f9-8039-8d8a0006368a/oauth2/v2.0/logout?post_logout_redirect_uri=http://localhost:4200`;
    this.msalService.logoutRedirect({
      postLogoutRedirectUri: environment.postLogoutRedirectUri,
    });
  }
}
