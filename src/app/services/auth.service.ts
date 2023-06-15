import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getAccessToken() {
    const tokensKeys = `msal.token.keys.${[environment.clientId]}`;
    let acessTokenKey:any = localStorage.getItem(tokensKeys)
    acessTokenKey = JSON.parse(acessTokenKey);
    let accessToken:any = localStorage.getItem(acessTokenKey?.idToken[0]);
    accessToken = JSON.parse(accessToken);
    return accessToken.secret
  }

}
