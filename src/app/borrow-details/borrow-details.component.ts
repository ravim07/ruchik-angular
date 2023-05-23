import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { PinchZoomComponent } from 'ngx-pinch-zoom';

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
    private apiService: AuthService,
    private route: ActivatedRoute
  ) {}

  aadharCardImg: string = '../../assets/image/aadharCard.jpg';
  panCardImg: string = '../../assets/image/pan-card.jpg';
  passport: string = '../../assets/image/passport.jpg';
  verified: string = '../../assets/image/verified.png';
  unverified: string = '../../assets/image/unverified.png';
  totaldoc: string = '../../assets/image/total-doc.png';
  zoomInImage: string = '../../assets/image/zoom-in.png';
  zoomOutImage: string = '../../assets/image/zoom-out.png';

  images: string[] = [this.aadharCardImg, this.panCardImg, this.passport];
  categoriesControl = new FormControl([]);
  categories: string[] = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  borrowerInfo: any = {};
  loader: boolean = true;
  currentIndex: number = 0;
  selectedOptions: any;
  uploadedImage: string = '';
  imageLoader: boolean = true;

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
    if (this.pinchZoom.isZoomedIn) {
      this.pinchZoom.toggleZoom();
    }
  }
  uploadedDocument(id: any) {
    this.apiService.getUploadedDocument(id).subscribe(
      (data: any) => {
        this.uploadedImage = data.uri;
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
}
