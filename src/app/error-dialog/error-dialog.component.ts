import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import DOCUMENTTYPE from '../../constent/typeOfDocumentwithError';
import { FormControl, Validators } from '@angular/forms';
import { BorrowerService } from '../services/borrower.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css'],
})
export class ErrorDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: BorrowerService,
    private dialogRef: MatDialogRef<ErrorDialogComponent>,
    private sharedService: SharedService
  ) {
    this.documentWithErrorList = DOCUMENTTYPE;
  }

  documentWithErrorList: any = [];
  showUploader: boolean = false;
  errorDocList: any = [];
  buttonLoader: boolean = false;
  missingDocument: any = new FormControl([], Validators.required)
  ngOnInit(): void {
    let docType = this.data.docCatListWithErrMsg;
    let errorList = this.data.errorList;
    for (let i = 0; docType.length > i; i++) {
      for (let j = 0; docType[i].message.length > j; j++) {
        let index = errorList.indexOf(docType[i].message[j]);
        if (index > -1) {
          this.errorDocList = [
            ...this.errorDocList,
            { cat: docType[i].documentCategory, type: docType[i].message[j] },
          ];
        }
      }
    }
  }

  handleShowUploader() {
    this.showUploader = true;
  }

  onRemovedTypDocument(cat: string) {
    const categories = this.missingDocument.value as never[];
    this.removeSelectedChip(categories, cat);
    this.missingDocument.setValue(categories);
  }
  removeSelectedChip(array: any[], toRemove: any): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  submitMissingDocument() {
    if(!this.showUploader){
      this.dialogRef.close();
      return
    }
    if (!this.missingDocument.valid) {
      this.missingDocument.markAllAsTouched();
      return;
    }
    this.buttonLoader = true;
    this.apiService
      .addMissingDocument({
        id: this.data.docId,
        listPendingDocuments: this.missingDocument.value,
      })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.dialogRef.close();
          this.buttonLoader = false;
          this.sharedService.showDataSaveSuccessMessage();
        },
        error: (err) => {
          this.buttonLoader = false;
          this.sharedService.showErrorMessage();
          console.log(err);
        },
      });
  }
}
