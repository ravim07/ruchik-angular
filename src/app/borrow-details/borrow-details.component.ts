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
import DOCUMENTTYPE from '../../constent/typeOfDocumentwithError';
import { SharedService } from '../services/shared.service';

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
    private dialog: MatDialog,
    private apiService: BorrowerService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {
    this.ceDealId = this.route.snapshot.paramMap.get('id');
    this.dropDownValue = DROPDOWNS_VALUES;
    this.documentWithErrorList = DOCUMENTTYPE;
  }
  dialogRef: any;
  documentId: any;
  borrowerDetailForm!: FormGroup;
  dropDownValue: any = {};
  documentWithErrorList: any = [];
  typeOfDocument = new FormControl([]);
  typeOfErrorSelect: any = new FormControl([], Validators.required)
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
  dataAccordingToDocument: any = {
    errorMessage: [],
    inputFields: [],
  };

  messageForBorrower = this.formBuilder.group({
    message: ['', [Validators.required]],
  });

  errorList: any = [];

  documentCatWithErrMsg: any = [];

  dynamicInputForm: any = new FormGroup({});

  buttonLoader: boolean = false;
  errorMessageForErrorSelect: boolean = false;
  saveButtonLoader: boolean = false;
  reportErrorSaveButtonLoader: boolean = false;

  disableOnNoDocument: boolean = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // const id = 'CE1000408';
    this.apiService.getBorrowerDetails(id).subscribe({
      next: (data: any) => {
        this.borrowerFileInfo = data?.file;
        this.documentId = data.deal.id
        if (data.file.length > 0) {
          this.getUploadedDocument(data.file[0].id);
        }
        else {
          this.disableOnNoDocument = true;
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
      error: (error) => {
        this.disableOnNoDocument = true;
        this.sharedService.showErrorMessage();
        console.error(error);
        this.storeDataInForm({});
        this.borrowerDetailForm.disable();
        this.loader = false;
      },
    });
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

  getUploadedDocument(id: any) {
    this.apiService.getUploadedDocument(id).subscribe({
      next: (res: any) => {
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
      error: (error) => {
        console.error(error);
        this.sharedService.showErrorMessage();
      },
    });
  }

  prevImage(): void {
    this.imageLoader = true;
    this.restoreZoom();
    this.currentIndex =
      this.currentIndex === 0
        ? this.borrowerFileInfo.length - 1
        : this.currentIndex - 1;
    this.getUploadedDocument(this.borrowerFileInfo[this.currentIndex].id);
  }

  nextImage(): void {
    this.restoreZoom();
    this.imageLoader = true;
    this.currentIndex =
      this.currentIndex === this.borrowerFileInfo.length - 1
        ? 0
        : this.currentIndex + 1;
    this.getUploadedDocument(this.borrowerFileInfo[this.currentIndex].id);
  }

  openReportErrorDialog(): void {
    this.typeOfError = true;
  }
  handleReportError(): void {
    if (!this.messageForBorrower.valid || !this.typeOfErrorSelect.valid) {
      this.messageForBorrower.markAllAsTouched();
      this.typeOfErrorSelect.markAllAsTouched();
      return;
    }
    this.errorList = [...this.typeOfErrorSelect.value];
    
    let data = {
      id: this.borrowerFileInfo[this.currentIndex].id,
      documentCategory: this.documentCatWithErrMsg[0].documentCategory,
      documentType: this.documentCatWithErrMsg[0].documentType,
      errorMessageList: this.errorList,
      ErrorMessage: this.messageForBorrower.value.message,
    };
    this.reportErrorSaveButtonLoader =  true;
    this.apiService.addErrorReport(data).subscribe({
      next: (res: any) => {
        this.sharedService.showDataSaveSuccessMessage();
        this.typeOfError = false;
        this.reportErrorSaveButtonLoader = false;
      },
      error: (err) => {
        this.sharedService.showErrorMessage();
        this.reportErrorSaveButtonLoader = false;
        console.log(err);
      },
    });
    // this.typeOfErrorSelect.reset();
  }
  openDialog() {
    this.dialogRef = this.dialog.open(ErrorDialogComponent, {
      panelClass: 'custom-modal-class',
      disableClose: true,
      data: {
        approvedDoc: this.verifiedCount,
        totalDoc: this.borrowerFileInfo.length,
        ceDealId: this.ceDealId,
        errorList: this.errorList,
        docCatListWithErrMsg: this.documentCatWithErrMsg,
        docId: this.documentId,
      },
    });
  }

  onRemovedTypDocument(cat: string) {
    const categories = this.typeOfDocument.value as never[];
    this.removeSelectedChip(categories, cat);
    this.typeOfDocument.setValue(categories);
    this.onItemSelected(this.typeOfDocument);
  }
  onRemovedTypError(cat: string) {
    const categories = this.typeOfErrorSelect.value as never[];
    this.removeSelectedChip(categories, cat);
    this.typeOfErrorSelect.setValue(categories);
    console.log(this.typeOfErrorSelect);
  }

  onItemSelected(event: any) {
    let errorMessages: any = [];
    let fieldsValue: any = [];
    let documentWithCategory: any = [];

    // For getting the input fields and error message as per the selected document type
    event.value.forEach((vl: any) => {
      const selectedDocValue = this.documentWithErrorList.find(
        (doc: any) => doc.documentCategory === vl
      );

      errorMessages = [...errorMessages, ...selectedDocValue.errorMessage];
      fieldsValue = [...fieldsValue, ...selectedDocValue.fields];

      documentWithCategory = [
        ...documentWithCategory,
        {
          documentCategory: selectedDocValue.documentCategory,
          message: selectedDocValue.errorMessage,
          documentType: selectedDocValue.documentType,
        },
      ];
    });
    this.dataAccordingToDocument.errorMessages = Array.from(
      new Set([...errorMessages])
    );

    if (this.typeOfErrorSelect.value.length > 0) {
      let result = this.typeOfErrorSelect.value.filter((item: any) =>
        this.dataAccordingToDocument.errorMessages.includes(item)
      );
      this.typeOfErrorSelect.value = [...result];
    }
    console.log(this.typeOfErrorSelect.value);
    this.documentCatWithErrMsg = [...documentWithCategory];
    let cloneFieldsValue: any = [];
    let uniqueObj: any = {};
    fieldsValue.forEach((vl: any) => {
      let value = vl['key'];
      if (!uniqueObj[value]) {
        uniqueObj = { ...uniqueObj, [value]: true };
        cloneFieldsValue.push(vl);
      }
    });

    // for remove the document type
    if (
      cloneFieldsValue.length < this.dataAccordingToDocument.inputFields.length
    ) {
      let cloneDataAccordingToDocument = [
        ...this.dataAccordingToDocument.inputFields,
      ];

      this.dataAccordingToDocument.inputFields = cloneFieldsValue;
      //for remove the form control
      cloneDataAccordingToDocument.forEach((fld: any, i: number) => {
        let index = cloneFieldsValue.findIndex((vl: any) => vl.key === fld.key);
        if (index === -1) {
          this.dynamicInputForm.removeControl(fld.key);
        }
      });
    } else {
      //On adding the document type
      cloneFieldsValue.forEach((vl: any) => {
        let index = this.dataAccordingToDocument.inputFields.findIndex(
          (field: any) => field.key === vl.key
        );
        if (index === -1) {
          this.dataAccordingToDocument.inputFields.push(vl);
          this.dynamicInputForm.addControl(
            vl.key,
            new FormControl('', Validators.required)
          );
        }
      });
    }
  }

  removeSelectedChip(array: any[], toRemove: any): void {
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
    if (!this.borrowerDetailForm.touched) {
      this.isEditForm = false;
      this.borrowerDetailForm.disable();
      return;
    }
    if (!this.borrowerDetailForm.valid) {
      this.borrowerDetailForm.markAllAsTouched();
      return;
    }
    this.saveButtonLoader = true;
    this.apiService
      .updateBorrowerList({id: this.documentId, ...this.borrowerDetailForm.value})
      .subscribe({
        next: (res: any) => {
          this.saveButtonLoader = false;
          this.isEditForm = false;
          this.borrowerDetailForm.disable();
          this.sharedService.showDataSaveSuccessMessage();
          console.log(res);
        },
        error: (error) => {
          this.sharedService.showErrorMessage();
          this.saveButtonLoader = false;
        },
      });
    console.log(this.borrowerDetailForm);
  }
  returnZero() {
    return 0;
  }

  confirmInputFields() {
    if (!this.dynamicInputForm.valid) {
      this.dynamicInputForm.markAllAsTouched();
      return;
    }
    this.buttonLoader = true;
    this.apiService
      .updateDynamicField(this.ceDealId, this.dynamicInputForm.value)
      .subscribe({
        next: (res: any) => {
          console.log(res, 'response');
          this.buttonLoader = false;
          this.sharedService.showDataSaveSuccessMessage();
        },
        error: (error) => {
          this.sharedService.showErrorMessage();
          this.buttonLoader = false;
        },
      });
  }
}
