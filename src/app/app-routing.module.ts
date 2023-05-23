import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MsalGuard } from '@azure/msal-angular';
import { BorrowDetailsComponent } from './borrow-details/borrow-details.component';
import { AuthGuard } from './guard/auth.guard';
import { LoginComponent } from './login/login.component';
// import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [MsalGuard],
  },
  {
    path: 'borrowDetails/:id',
    component: BorrowDetailsComponent,
    canActivate: [MsalGuard],
  },
  //   {
  //   path:'profile',
  //   component: ProfileComponent,
  //   canActivate: [MsalGuard],
  // }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledNonBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
