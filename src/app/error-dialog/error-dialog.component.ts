import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css'],
})
export class ErrorDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  uploadedDocuments: any = [];
  showUploader: boolean = false;
  filesContainsError: any = [];
  ngOnInit(): void {}

  handleUploadDoc(e: any) {
    for (var i = 0; i < e.target.files.length; i++) {
      if (e.target.files[i].name.match(/\.(jpg|jpeg|png|PNG|pdf|docx)$/)) {
        this.uploadedDocuments.push(e.target.files[i]);
      } else {
        this.filesContainsError.push(e.target.files[i].name);
      }
    }
  }

  handleShowUploader() {
    this.showUploader = true;
  }

  removeUploadedFile(index:any){
    this.uploadedDocuments.splice(index, 1);
  }
}
