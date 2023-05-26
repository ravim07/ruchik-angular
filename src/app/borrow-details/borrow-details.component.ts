import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { PinchZoomComponent } from 'ngx-pinch-zoom';
import { BorrowerService } from '../services/borrower.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-borrow-details',
  templateUrl: './borrow-details.component.html',
  styleUrls: ['./borrow-details.component.css'],
})
export class BorrowDetailsComponent implements OnInit {
  @ViewChild('mapElement', { static: true }) mapElementRef:
    | ElementRef
    | undefined;
  typeOfError: boolean = false;
  @ViewChild('pinchZoom') pinchZoom: any = ElementRef<PinchZoomComponent>;
  constructor(
    public dialog: MatDialog,
    private apiService: BorrowerService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.ceDealId = this.route.snapshot.paramMap.get('id');
  }
  categoriesControl = new FormControl([]);
  verified: string = '../../assets/image/verified.png';
  unverified: string = '../../assets/image/unverified.png';
  totaldoc: string = '../../assets/image/total-doc.png';

  categories: string[] = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  borrowerInfo: any = {};
  loader: boolean = true;
  currentIndex: number = 0;
  selectedOptions: any;
  uploadedFileURL: string = '';
  imageLoader: boolean = true;
  verifiedCount: number = 0;
  url =
    'https://borrowerfiles.file.core.windows.net/files/testaa_ssa_645a2c419b00e4667e0db030_CE1000408/bank_statements/45bb410b-25cf-460b-94fa-d54bacd1ef28_16_05_23_102857.pdf?sv=2020-02-10&se=2023-05-26T12%3A04%3A03Z&sr=s&sp=r&sig=vph%2BIEO1Sh0YJKev4jUXH7QbjC8lFQOoIZLfqB6xVp0%3D';
  ceDealId!: any;
  isPdfFile:boolean = false;

  ngOnInit(): void {
    
    const id = this.route.snapshot.paramMap.get('id');
    this.apiService.getBorrowerDetails(id).subscribe(
      (data: any) => {
        this.borrowerInfo = data;
        this.loader = false;
        this.uploadedDocument(data.file[0].id);
      },
      (error) => {
        console.error(error);
        this.loader = false;
      }
    );
  }
  restoreZoom() {
    if (this.isPdfFile && this.pinchZoom?.isZoomedIn) {
      this.pinchZoom.toggleZoom();
    }
  }
  uploadedDocument(id: any) {
    this.apiService.getUploadedDocument(id).subscribe(
      (data: any) => {
        this.uploadedFileURL = data.uri;
        if(this.uploadedFileURL.includes('pdf')) {
          this.isPdfFile = true;
          this.convertUrlToBlob(data.uri);
        } else {
          this.isPdfFile = false;
        }
        this.imageLoader = false;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  removeOption(option: string) {
    const index = this.selectedOptions.indexOf(option);
    if (index >= 0) {
      this.selectedOptions.splice(index, 1);
    }
  }

  prevImage(): void {
    this.imageLoader = true;
    this.restoreZoom();
    this.currentIndex =
      this.currentIndex === 0
        ? this.borrowerInfo.file.length - 1
        : this.currentIndex - 1;
    this.uploadedDocument(this.borrowerInfo.file[this.currentIndex].id);
  }

  nextImage(): void {
    this.restoreZoom();
    this.imageLoader = true;
    this.currentIndex =
      this.currentIndex === this.borrowerInfo.file.length - 1
        ? 0
        : this.currentIndex + 1;
    this.uploadedDocument(this.borrowerInfo.file[this.currentIndex].id);
  }

  ReportError(): void {
    this.typeOfError = true;
  }
  confirm(): void {
    this.typeOfError = false;
  }
  openDialog() {
    this.dialog.open(ErrorDialogComponent, {
      maxWidth: '60vw',
      maxHeight: '60vh',
      height: '60%',
      width: '60%',
      data: {
        approvedDoc: '12',
        totalDoc: '25',
      },
    });
  }

  onCatRemoved(cat: string) {
    const categories = this.categoriesControl.value as never[];
    this.removeFirst(categories, cat);
    this.categoriesControl.setValue(categories); // To trigger change detection
  }

  private removeFirst(array: any[], toRemove: any): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  getVerifiedCount() {
    let count = 0;
    this.borrowerInfo.file.forEach((info: any) => {
      if (info.verified) {
        count = count + 1;
      }
    });
    return count;
  }

  async convertUrlToBlob(url:any) {
    // const url = 'https://example.com/image.jpg'; // Replace with your URL
    // this.http.get(url).subscribe(
    //   (data: any) => {
    //     console.log(data,"data")
    //     // this.borrowerInfo = data;
    //     // this.loader = false;
    //     // this.uploadedDocument(data.file[0].id);
    //   },
    //   (error) => {
    //     console.error(error);
    //     // this.loader = false;
    //   }
    // );
    try {
      const response = await fetch(url);
      if (response.ok) {
        const blob = await response.blob();
        console.log('Blob:', blob);

        // You can now use the 'blob' as needed, such as uploading it or displaying it in an <img> element.
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
