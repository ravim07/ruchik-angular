import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getBorrowerDetails(id: any) {
    return this.http.get(
      `${this.apiURL}api/BorrowerInfo/Borrower/GetBorrowerInfo/${id}`
    );
  }

  getUploadedDocument(id: any) {
    return this.http.get(`${this.apiURL}api/Document/Document/ViewFile/${id}`);
  }
}
