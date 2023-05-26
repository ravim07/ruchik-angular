import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BorrowerService {

  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) { }
  getBorrowerDetails(id: any) {
    return this.http.get(
      `${this.apiURL}BorrowerInfo/Borrower/GetBorrowerInfo/${id}`
    );
  }

  getUploadedDocument(id: any) {
    return this.http.get(`${this.apiURL}Document/Document/ViewFile/${id}`);
  }

  getBorrowerList(data:any){
    return this.http.get(`${this.apiURL}BorrowerInfo/Borrower/DataAssociateDashboardDocuments?currentPage=${data.currentPage}&perPage=${data.perPage}`)
  }
}
