import { Component, OnInit, ViewChild } from '@angular/core';
import { BorrowerService } from '../services/borrower.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  constructor(private apiService: BorrowerService, private snackBar: MatSnackBar) {}

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
  loader:boolean = true;
  pageSizeOptions = [5,10,20,50,100];

  ngOnInit(): void {
    const data = {
      currentPage: 1,
      perPage: this.pageSize,
    };
    this.getBorrowerListData(data);
  }

  getBorrowerListData(item: any) {
    this.apiService.getBorrowerList(item).subscribe(
      (res: any) => {
        this.loader = false;
        this.borrowerList = new MatTableDataSource(res.opsDashboardDocument);
        this.totalDataCount = res.totalRecord;
        // this.borrowerList.paginator = this.paginator;
        console.log(res);
      },
      (error: any) => {
        this.loader = false;
        console.log(error);
      }
    );
  }

  handlePageEvent(e: any) {
    this.pageSize = e.pageSize;
    this.loader = true;
    console.log(e, 'on page event', this.pageSize);
    this.getBorrowerListData({currentPage: e.pageIndex+1,
      perPage: this.pageSize});
  }

  // applyFilter(event: any) {
  //   let filterValue = event.target.value;
  //   filterValue = filterValue.trim();
  //   filterValue = filterValue.toLowerCase();
  //   this.borrowerList.filter = filterValue;
  // }
}
