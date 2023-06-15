import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import SNACKBARTIMMER from 'src/constent/constent';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  userId= new Subject<number>();
  constructor(private snackBar: MatSnackBar) { }

  showErrorMessage() {
    this.snackBar.open('Something went wrong!', 'Close', {
      duration: SNACKBARTIMMER,
      verticalPosition: 'top',
      horizontalPosition: 'end',
    });
  }

  showDataSaveSuccessMessage(){
    this.snackBar.open('Data saved successfully!', 'Close', {
      duration: SNACKBARTIMMER,
      verticalPosition: 'top',
      horizontalPosition: 'end',
    });
  }
}
