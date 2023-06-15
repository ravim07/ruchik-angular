import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  MsalBroadcastService,
  MsalService,
} from '@azure/msal-angular';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import {
  InteractionStatus
} from '@azure/msal-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'PFA-frontend';

  constructor(
    private broadcastService: MsalBroadcastService,
    private msalService: MsalService,
  ) {}
  isUserLoggedIn: boolean = false;
  isIframe = false;
  private readonly _destroying$ = new Subject<void>();
  loader: boolean = true;

  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;

    this.broadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.isUserLoggedIn =
          this.msalService.instance.getAllAccounts().length > 0;
          this.loader = false;
      });
  }


  logout() {
    localStorage.clear();
    // location.href = `https://login.microsoftonline.com/b691ecf0-5e83-41f9-8039-8d8a0006368a/oauth2/v2.0/logout?post_logout_redirect_uri=http://localhost:4200`;
    this.msalService.logoutRedirect({
      postLogoutRedirectUri: environment.postLogoutRedirectUri,
    });
  }
  // logout() { // Add log out function here
  //   localStorage.clear();
  //   this.msalService.logoutPopup({
  //     // mainWindowRedirectUri: "/"
  //     mainWindowRedirectUri: window.location.origin
  //   });
  // }

  setLoginDisplay() {
    this.isUserLoggedIn = this.msalService.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
