import { Component, Inject, OnInit } from '@angular/core';
import {
  MSAL_GUARD_CONFIG,
  MsalBroadcastService,
  MsalGuardConfiguration,
  MsalService,
} from '@azure/msal-angular';
import {
  EventMessage,
  EventType,
  InteractionStatus,
  PopupRequest,
  RedirectRequest,
} from '@azure/msal-browser';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private msalBroadcastService: MsalBroadcastService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private broadcastService: MsalBroadcastService,
    private msalService: MsalService
  ) {}
  isUserLoggedIn: boolean = false;

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
      )
      .subscribe((result: EventMessage) => {});

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        console.log('asdfasdfoasfdasd/////1222');
      });
  }

  setLoginDisplay() {
    this.isUserLoggedIn = this.msalService.instance.getAllAccounts().length > 0;
  }

  login() {
    if (this.msalGuardConfig.authRequest) {

      // this.msalService.handleRedirectObservable().subscribe((response: any) => {
      //   if (response !== null && response.account !== null) {
      //     // Redirect response is valid
      //     console.log(response)
      //     const accessToken = response.accessToken;
      //     // Use the access token in your application
      //   }
      // });


      this.msalService.loginRedirect({
        ...this.msalGuardConfig.authRequest,
      } as RedirectRequest).subscribe({
        next:(result)=> {
          console.log(result);
        },
        error: (error) => console.log(error)
      });
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
}
