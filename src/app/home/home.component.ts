import { Component, OnInit, ViewChild } from '@angular/core';
import { BorrowerService } from '../services/borrower.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { SharedService } from '../services/shared.service';
// import { MatSort, Sort } from '@angular/material/sort';

export interface BorrowerList {
  firstName: string;
  lastName: string;
  ceDealId: number | string;
  creationTime: string;
  businessName: string;
  dataAssociate: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  borrowerList!: MatTableDataSource<BorrowerList>;
  searchSubscription: Subscription;
  searchSubject = new Subject<string>();
  // @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: BorrowerService,
    private sharedService: SharedService
  ) {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(300))
      .subscribe((searchTerm: string) => {
        this.performSearch(searchTerm);
      });
  }

  displayedColumns: string[] = [
    'ceDealId',
    'firstName',
    'lastName',
    'businessName',
    'dataAssociate',
    'creationTime',
  ];
  // dataSource = ELEMENT_DATA;
  pageSize: number = 5;
  totalDataCount: number = 0;
  loader: boolean = true;
  pageSizeOptions = [5, 10, 20, 50, 100];
  searchText = '';
  sortBy = '';
  dataAssociate: any = [];
  noDataFound: boolean = false;

  ngOnInit(): void {
    const data = {
      currentPage: 1,
      perPage: this.pageSize,
      searchText: this.searchText,
      sortBy: this.sortBy,
    };
    this.getBorrowerListData(data);
    this.getAssociateData();
  }

  getAssociateData(){
    this.loader = true;
    this.apiService.getAssociateList().subscribe({
      next: (res: any) => {
        this.loader = false;
        this.dataAssociate = res.map(
          (vl: any) => vl.name
        );
      },
      error: (err) => {
        this.loader = false;
        this.sharedService.showErrorMessage();
        console.log(err);
      },
    });
  }

  getBorrowerListData(item: any) {
    this.loader = true
    this.apiService.getBorrowerList(item).subscribe({
      next: (res: any) => {
        this.loader = false;
        this.borrowerList = new MatTableDataSource(res.opsDashboardDocument);
        this.totalDataCount = res.totalRecord;
      },
      error: (err) => {
        this.loader = false;
        this.sharedService.showErrorMessage();
        console.log(err);
      },
    });
  }

  handlePageEvent(e: any) {
    this.pageSize = e.pageSize;
    this.loader = true;
    this.getBorrowerListData({
      currentPage: e.pageIndex + 1,
      perPage: this.pageSize,
      searchText: this.searchText,
      sortBy: this.sortBy,
    });
  }

  applyFilter(event: any) {
    this.searchText = event.target.value;
    this.searchText = this.searchText.trim();
    this.searchSubject.next(this.searchText);
  }

  performSearch(searchText: string) {
    this.getBorrowerListData({
      currentPage: 1,
      perPage: this.pageSize,
      searchText: searchText,
      sortBy: this.sortBy,
    });
  }

  filterByDataAssociate(event: any) {
    this.loader = true;
    this.searchSubject.next(event.value);
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }
}
