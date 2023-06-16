import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BorrowerService {
  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}
  getBorrowerDetails(id: any) {
    return this.http.get(
      `${this.apiURL}BorrowerInfo/Borrower/GetBorrowerInfo/${id}`
    );
  }

  getUploadedDocument(id: any) {
    return this.http.get(`${this.apiURL}Document/Document/ViewFile/${id}`);
  }

  getBorrowerList({ currentPage, perPage, searchText, sortBy }: any) {
    return this.http.get(
      `${this.apiURL}BorrowerInfo/Borrower/DataAssociateDashboardDocuments?currentPage=${currentPage}&perPage=${perPage}&searchQuery=${searchText}&sortBy=${sortBy}`
    );
  }

  updateBorrowerList(data: any) {
    return this.http.post(
      `${this.apiURL}BorrowerInfo/Borrower/UpdateDealDetails`,
      data
    );
  }

  updateDynamicField(id: number, data: any) {
    return this.http.post(
      `${this.apiURL}BorrowerInfo/Borrower/UpdateDADynamicField/${id}`,
      data
    );
  }

  addMissingDocument(data: any){
    return this.http.post(
      `${this.apiURL}BorrowerInfo/Borrower/OpsMarkError`,
      data
    );
  }

  addErrorReport(data: any){
    return this.http.post(
      `${this.apiURL}Document/Document/ErrorMarkDocument`,
      data
    );
  }

  getAssociateList(){
    return this.http.get(
      `${this.apiURL}AccountInfo/Account/GetDateAssociates`
    );
  }
}
