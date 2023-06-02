import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { PinchZoomComponent } from 'ngx-pinch-zoom';
import { BorrowerService } from '../services/borrower.service';
import DROPDOWNS_VALUES from '../../constent/dropDownConstents';
import TYPEOFERROR from '../../constent/typeOfErrorConstents';
import { MatSnackBar } from '@angular/material/snack-bar';
import SNACKBARTIMMER from "../../constent/constent";

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
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.ceDealId = this.route.snapshot.paramMap.get('id');
    this.dropDownValue = DROPDOWNS_VALUES;
    this.documentWithErrorList = TYPEOFERROR;
  }
  borrowerDetailForm!: FormGroup;
  dropDownValue: any = {};
  documentWithErrorList: any = {};
  typeOfDocument = new FormControl([]);
  typeOfErrorSelect = new FormControl([]);
  verified: string = '../../assets/image/verified.png';
  unverified: string = '../../assets/image/unverified.png';
  totaldoc: string = '../../assets/image/total-doc.png';

  categories: string[] = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  borrowerFileInfo: any = [];
  loader: boolean = true;
  currentIndex: number = 0;
  selectedOptions: any;
  uploadedFileURL: string = '';
  imageLoader: boolean = true;
  verifiedCount: number = 0;
  url =
    'https://borrowerfiles.file.core.windows.net/files/testaa_ssa_645a2c419b00e4667e0db030_CE1000408/bank_statements/45bb410b-25cf-460b-94fa-d54bacd1ef28_16_05_23_102857.pdf?sv=2020-02-10&se=2023-05-26T12%3A04%3A03Z&sr=s&sp=r&sig=vph%2BIEO1Sh0YJKev4jUXH7QbjC8lFQOoIZLfqB6xVp0%3D';
  ceDealId!: any;
  isPdfFile: boolean = false;
  borrowerDetailFormInitialValue: any = {};
  zoom: number = 1.0;
  zoomButtonDisable: string = 'zoomOut';
  isEditForm: boolean = false;
  // showFile: boolean = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // const id = 'CE1000408';
    this.apiService.getBorrowerDetails(id).subscribe(
      (data: any) => {
        this.borrowerFileInfo = data?.file;
        if (data.file.length > 0) {
          this.uploadedDocument(data.file[0].id);
        }
        this.borrowerDetailFormInitialValue = {
          ceDealId: data.deal.ceDealId,
          firstName: data.deal.firstName,
          lastName: data.deal.lastName,
          phone: data.deal.phone,
          email: data.deal.email,
          requestedLoanAmount: data.deal.requestedLoanAmount,
          dateOfBirth: data.deal.dateOfBirth,
          pan: data.deal.pan,
          businessAddress: data.deal.businessAddress,
          businessPincode: data.deal.businessPincode,
          city: data.deal.city,
          personalPAN: data.deal.personalPAN,
          gstn: data.deal.gstn,
          applicantsResidentialAddress: data.deal.applicantsResidentialAddress,
          applicantsCityofResidence: data.deal.applicantsCityofResidence,
          applicantsStateofResidence: data.deal.applicantsStateofResidence,
          state: data.deal.state,
          applicantsResidentialPincode: data.deal.applicantsResidentialPincode,
          finalLoanAmount: data.deal.finalLoanAmount,
          loanProduct: data.deal.loanProduct,
          callMode: data.deal.callMode,
          sector: data.deal.sector,
          kindOfLoan: data.deal.kindOfLoan,
          isBusinessGSTRegistered: data.deal.isBusinessGSTRegistered,
          businessTurnover: data.deal.businessTurnover,
          businessType: data.deal.businessType,
        };
        this.storeDataInForm(this.borrowerDetailFormInitialValue);
        this.borrowerDetailForm.disable();
        this.loader = false;
      },
      (error) => {
        this.snackBar.open('Something went wrong!', 'Close', {
          duration: SNACKBARTIMMER,
          verticalPosition: 'top',
          horizontalPosition: 'end',
        });
        console.error(error);
        this.storeDataInForm({});
        this.borrowerDetailForm.disable();
        this.loader = false;
      }
    );
  }

  zoomIn() {
    if (this.isPdfFile) {
      this.zoom = this.zoom + 0.25;
    } else {
      this.pinchZoom?.toggleZoom();
    }
    this.zoomButtonDisable = 'zoomIn';
  }

  zoomOut() {
    if (this.isPdfFile) {
      if (this.zoom > 1) {
        this.zoom = this.zoom - 0.25;
      }
    } else {
      this.pinchZoom?.toggleZoom();
    }
    this.zoomButtonDisable = 'zoomOut';
  }
  restoreZoom() {
    if (!this.isPdfFile && this.pinchZoom?.isZoomedIn) {
      this.pinchZoom.toggleZoom();
    } else {
      this.zoom = 1.0;
    }
    this.zoomButtonDisable = 'zoomOut';
  }
  uploadedDocument(id: any) {
    this.apiService.getUploadedDocument(id).subscribe(
      (res: any) => {
        if (res.extension === '.pdf') {
          if (res.data.length > 0) {
            this.isPdfFile = true;
            this.uploadedFileURL = `data:application/pdf;base64,${res.data}`;
          }
        } else {
          if (res.data.length > 0) {
            this.isPdfFile = false;
            this.uploadedFileURL = `data:image/png;base64,${res.data}`;
          }
        }
        this.imageLoader = false;
      },
      (error) => {
        console.error(error);
        this.snackBar.open('Something went wrong!', 'Close', {
          duration: SNACKBARTIMMER,
          verticalPosition: 'top',
          horizontalPosition: 'end',
        });
      }
    );
  }

  // removeOption(option: string) {
  //   const index = this.selectedOptions.indexOf(option);
  //   if (index >= 0) {
  //     this.selectedOptions.splice(index, 1);
  //   }
  // }

  prevImage(): void {
    this.imageLoader = true;
    this.restoreZoom();
    this.currentIndex =
      this.currentIndex === 0
        ? this.borrowerFileInfo.length - 1
        : this.currentIndex - 1;
    this.uploadedDocument(this.borrowerFileInfo[this.currentIndex].id);
  }

  nextImage(): void {
    this.restoreZoom();
    this.imageLoader = true;
    this.currentIndex =
      this.currentIndex === this.borrowerFileInfo.length - 1
        ? 0
        : this.currentIndex + 1;
    this.uploadedDocument(this.borrowerFileInfo[this.currentIndex].id);
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
      disableClose: true,
      data: {
        approvedDoc: this.verifiedCount,
        totalDoc: this.borrowerFileInfo.length,
        ceDealId: this.ceDealId,
      },
    });
  }

  onCatRemovedTypDocument(cat: string) {
    const categories = this.typeOfDocument.value as never[];
    this.removeFirst(categories, cat);
    this.typeOfDocument.setValue(categories);
    this.getTypeOfErrorList();
  }
  onCatRemovedTypError(cat: string) {
    const categories = this.typeOfErrorSelect.value as never[];
    this.removeFirst(categories, cat);
    this.typeOfErrorSelect.setValue(categories);
    console.log(this.typeOfErrorSelect);
  }

  private removeFirst(array: any[], toRemove: any): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  getVerifiedCount() {
    let count = 0;
    this.borrowerFileInfo?.forEach((info: any) => {
      if (info.verified) {
        count = count + 1;
      }
    });
    this.verifiedCount = count;
    return count;
  }

  storeDataInForm(data: any) {
    this.borrowerDetailForm = this.formBuilder.group({
      ceDealId: [data?.ceDealId, [Validators.required]],
      firstName: [data?.firstName, [Validators.required]],
      lastName: [data?.lastName, [Validators.required]],
      phone: [data?.phone, [Validators.required]],
      email: [data?.email, [Validators.required]],
      requestedLoanAmount: [data?.requestedLoanAmount, [Validators.required]],
      dateOfBirth: [data?.dateOfBirth, [Validators.required]],
      pan: [data?.pan, [Validators.required]],
      businessAddress: [data?.businessAddress, [Validators.required]],
      businessPincode: [data?.businessPincode, [Validators.required]],
      city: [data?.city, [Validators.required]],
      personalPAN: [data?.personalPAN, [Validators.required]],
      gstn: [data?.gstn, [Validators.required]],
      applicantsResidentialAddress: [
        data?.applicantsResidentialAddress,
        [Validators.required],
      ],
      applicantsCityofResidence: [
        data?.applicantsCityofResidence,
        [Validators.required],
      ],
      applicantsStateofResidence: [
        data?.applicantsStateofResidence,
        [Validators.required],
      ],
      state: [data?.state, [Validators.required]],
      applicantsResidentialPincode: [
        data?.applicantsResidentialPincode,
        [Validators.required],
      ],
      finalLoanAmount: [data?.finalLoanAmount, [Validators.required]],
      loanProduct: [data?.loanProduct, [Validators.required]],
      callMode: [data?.callMode, [Validators.required]],
      sector: [data?.sector, [Validators.required]],
      kindOfLoan: [data?.kindOfLoan, [Validators.required]],
      isBusinessGSTRegistered: [
        data?.isBusinessGSTRegistered,
        [Validators.required],
      ],
      businessTurnover: [data?.businessTurnover, [Validators.required]],
      businessType: [data?.businessType, [Validators.required]],
      // Add more form controls as needed
    });
  }

  editFormField() {
    this.borrowerDetailForm.enable();
    this.isEditForm = true;
  }

  resetFormField() {
    this.storeDataInForm(this.borrowerDetailFormInitialValue);
    this.borrowerDetailForm.disable();
    this.isEditForm = false;
  }

  saveFormField() {
    // this.borrowerDetailForm.disable();
    // this.isEditForm = false;
    if (!this.borrowerDetailForm.touched) {
      this.isEditForm = false;
      this.borrowerDetailForm.disable();
      return;
    }
    if (!this.borrowerDetailForm.valid) {
      this.borrowerDetailForm.markAllAsTouched();
      return;
    }
    this.loader = true;
    this.apiService.updateBorrowerList(this.borrowerDetailForm.value).subscribe(
      (res: any) => {
        this.loader = false;
        this.isEditForm = false;
        this.borrowerDetailForm.disable();
        console.log(res);
      },
      (error) => {
        this.snackBar.open('Something went wrong!', 'Close', {
          duration: SNACKBARTIMMER,
          verticalPosition: 'top',
          horizontalPosition: 'end',
        });
        this.loader = false;
      }
    );
    console.log(this.borrowerDetailForm);
  }
  returnZero() {
    return 0;
  }

  getTypeOfErrorList() {
    let errorList: any = [];
    const selectedDoc: any = this.typeOfDocument.value;
    Object.keys(this.documentWithErrorList).forEach((vl: any) => {
      if (selectedDoc?.includes(vl)) {
        errorList = [...errorList, ...this.documentWithErrorList[vl]];
      }
    });
    return errorList;
  }
}
