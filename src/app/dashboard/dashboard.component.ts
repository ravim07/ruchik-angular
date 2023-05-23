import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  firstName: string;
  userId: number|string;
  lastName: string;
  creationDate: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {userId: 'CE1000434', firstName: 'John', lastName: 'deo', creationDate: "12/02/2017"},
  {userId: 1002, firstName: 'John', lastName: 'dark', creationDate: '12/02/2017'},
  {userId: 1003, firstName: 'John', lastName: 'singh', creationDate: '12/02/2017'},
  {userId: 1004, firstName: 'jack', lastName: 'jackson', creationDate: '12/02/2017'},
  {userId: 1005, firstName: 'Paul', lastName: 'sen', creationDate: '12/02/2017'}
];
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }


  displayedColumns: string[] = ['userId', 'firstName', 'lastName', 'creationDate'];
  dataSource = ELEMENT_DATA;

  ngOnInit(): void {
  }

}
