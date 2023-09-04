import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChannelTypeEnum } from '@enums/home/channel-type.enum';
import { PrescriptionSourceTypeEnum } from '@enums/home/prescription-source-type.enum';
import { TestType } from '@enums/home/test-type.enum';
import { showNotification } from '@helpers/show-toast';
import { IAttachmentsFilesDTO, IEhrTestRequestInformationDTO, IEhrTestRequestLocationDTO, IFileDTO, IMedicalTestDetailDTO, IMedicalTestDetails, IPatientPersonalDetailsDTO } from '@interfaces/Emr/i-medical-tests-details';
import { IInvoiceInformation, IPaymentInformation } from '@interfaces/home/i-test-request-details';
import { IBreadcrumbItem } from '@interfaces/i-breadcrumb-item';
import { EmrMedicalTestsService } from '@services/home/emr-medical-tests/emr-medical-tests.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { isPdfFile } from '@helpers/check-file-type';

@Component({
  selector: 'medical-test-details',
  templateUrl: './medical-test-details.component.html',
  styleUrls: ['./medical-test-details.component.scss'],
})
export class MedicalTestDetailsComponent implements OnInit {
  pageTitle: string = 'Medical Test Details';
  breadcrumbList: IBreadcrumbItem[] = [
    { text: 'Medical Test Details', link: '' },
  ];
  ehrTransactionId;
  emrDiscriminator;
  medicalTestDetails: IMedicalTestDetails;
  patientPersonalDetails: IPatientPersonalDetailsDTO;
  testRequestInformation: IEhrTestRequestInformationDTO;
  testRequestPlace: IEhrTestRequestLocationDTO;
  medicalTests: IMedicalTestDetailDTO;
  radiologies: IMedicalTestDetailDTO;
  physiotherapies: string[];
  paymentInformation: IPaymentInformation;
  invoice: IInvoiceInformation;
  modalRef: BsModalRef;
  sourceType;
  medicalTestFiles: string[];
  medicalTestFilesAsPdf: string[] = [];
  medicalTestFilesAsImages: string[] = [];

  constructor(
    private medicalTestRequestService: EmrMedicalTestsService,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.ehrTransactionId = this.activatedRoute.snapshot.queryParams.medicalTestId;
    this.sourceType = this.activatedRoute.snapshot.queryParams.sourceType;

    if(this.sourceType == PrescriptionSourceTypeEnum.details)
      this.getMedicalTestDetails(this.ehrTransactionId);
    else
      this.getMedicalTestFiles(this.ehrTransactionId)
  }

  get medicalTestSourceTypeEnum() {
    return PrescriptionSourceTypeEnum;
  }

  get channelTypeEnum() {
    return ChannelTypeEnum
  }

  getMedicalTestDetails(ehrTransactionId) {
    this.medicalTestRequestService
      .getMedicalTestDetails(ehrTransactionId)
      .subscribe((response) => {
        this.medicalTestDetails = response.data;
        this.patientPersonalDetails = this.medicalTestDetails?.patientPersonalDetails;
        this.testRequestInformation = this.medicalTestDetails?.testRequestInformation;
        this.testRequestPlace = this.medicalTestDetails?.testRequestLocation;
        this.medicalTests = this.medicalTestDetails?.medicalTests;
        this.radiologies = this.medicalTestDetails?.radiologies;
        this.physiotherapies = this.medicalTestDetails?.physiotherapies?.testRequestDetails.map(p => p.test.name);
        this.paymentInformation = this.medicalTestDetails?.paymentInformation;
        this.invoice = this.medicalTestDetails?.paymentInformation?.invoice;
      });
  }

  getMedicalTestFiles(ehrTransactionId) {
    this.medicalTestRequestService
      .getMedicalTestFiles(ehrTransactionId)
      .subscribe((response) => {
        this.medicalTestFiles = response.data?.filePaths;

          if (this.medicalTestFiles?.length) {
            this.medicalTestFiles.forEach((file) => {
              if (isPdfFile(file)) {
                this.medicalTestFilesAsPdf.push(file);
              } else {
                this.medicalTestFilesAsImages.push(file);
              }
            });
          }
      });
  }

  checkChannel() {
    if (this.testRequestInformation?.channel?.id == this.channelTypeEnum.application) {
      return 'Application';
    } else if (this.testRequestInformation?.channel?.id == this.channelTypeEnum.admin) {
      return 'Admin';
    } else if (this.testRequestInformation?.channel?.id == this.channelTypeEnum.portal) {
      return 'Portal';
    }

    return '--';
  }

  checkPromocode() {
    if (this.invoice?.promoCode) {
      return `(${this.invoice.promoCode})`;
    }

    return null;
  }

  downloadFile(fileUrl) {
    this.medicalTestRequestService
      .downloadTestFile(fileUrl)
      .subscribe((response) => {
        let fileName = fileUrl.split('/').pop();
        let a = document.createElement('a');
        let objectUrl = URL.createObjectURL(response);
        a.href = objectUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(objectUrl);
      });
  }

  onDownloadTestResult(resultPaths:IFileDTO[], testRequestFiles: IFileDTO[]) {
    resultPaths.forEach(f => this.downloadFile(f.path));
    testRequestFiles.forEach(f => this.downloadFile(f.path));
  }

  // downloadTestRequestResults(testType: number) {
  //   if(testType == TestType.Lab){

  //   }
  //   else if(testType == TestType.Scan){

  //   }
  //   this.medicalTestRequestService
  //     .downloadTestRequestResults(this.ehrTransactionId, this.emrDiscriminator)
  //     .subscribe((response) => {
  //       if (response?.data?.results?.length) {
  //         response.data.results.forEach((resultUrl) => {
  //           if (resultUrl) {
  //             this.downloadFile(resultUrl);
  //           } else {
  //             showNotification(
  //               'danger',
  //               'There is no results to download!',
  //               this.toastr
  //             );
  //           }
  //         });
  //       } else {
  //         showNotification(
  //           'danger',
  //           'There is no results to download!',
  //           this.toastr
  //         );
  //       }
  //     });
  // }
}
