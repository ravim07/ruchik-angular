import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import {
  MSAL_GUARD_CONFIG,
  MsalBroadcastService,
  MsalGuardConfiguration,
  MsalService,
} from '@azure/msal-angular';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import {
  InteractionStatus,
  PopupRequest,
  RedirectRequest,
} from '@azure/msal-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'PFA-frontend';

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private broadcastService: MsalBroadcastService,
    private msalService: MsalService,
    private router: Router
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
      .subscribe((eee) => {
        this.isUserLoggedIn =
          this.msalService.instance.getAllAccounts().length > 0;
          this.loader = false;
      });
  }

  login() {
    if (this.msalGuardConfig.authRequest) {
      this.msalService.loginRedirect({
        ...this.msalGuardConfig.authRequest,
      } as RedirectRequest);
      this.router.navigate(['/home'])
    } else {
      this.msalService.loginRedirect();
    }
  }

  // login() {
  //   if (this.msalGuardConfig.authRequest){
  //     this.msalService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest)
  //       .subscribe({
  //         next: (result) => {
  //           console.log(result);
  //           this.setLoginDisplay();
  //         },
  //         error: (error) => console.log(error)
  //       });
  //   } else {
  //     this.msalService.loginPopup()
  //       .subscribe({
  //         next: (result) => {
  //           console.log(result);
  //           this.setLoginDisplay();
  //         },
  //         error: (error) => console.log(error)
  //       });
  //   }
  // }

  // logout() {
  //   this.msalService.logoutRedirect({
  //     postLogoutRedirectUri: 'http://localhost:4200',
  //   });
  // }
  logout() { // Add log out function here
    localStorage.clear();
    this.msalService.logoutPopup({
      mainWindowRedirectUri: "/"
    });
  }

  setLoginDisplay() {
    this.isUserLoggedIn = this.msalService.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
