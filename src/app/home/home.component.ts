import { Component, OnInit, ViewChild } from '@angular/core';
import { BorrowerService } from '../services/borrower.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Subscription, debounceTime } from 'rxjs';
import SNACKBARTIMMER from '../../constent/constent';
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
    private snackBar: MatSnackBar
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
  dataAssociate = [];

  ngOnInit(): void {
    const data = {
      currentPage: 1,
      perPage: this.pageSize,
      searchText: this.searchText,
      sortBy: this.sortBy,
    };
    this.getBorrowerListData(data);
  }

  getBorrowerListData(item: any) {
    this.apiService.getBorrowerList(item).subscribe(
      (res: any) => {
        this.loader = false;
        this.borrowerList = new MatTableDataSource(res.opsDashboardDocument);
        this.totalDataCount = res.totalRecord;
        this.dataAssociate = res.opsDashboardDocument.map(
          (vl: any) => vl.dataAssociate
        );
      },
      (error: any) => {
        this.loader = false;
        this.snackBar.open('Something went wrong!', 'Close', {
          duration: SNACKBARTIMMER,
          verticalPosition: 'top',
          horizontalPosition: 'end',
        });
        console.log(error);
      }
    );
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
