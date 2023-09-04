import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrescriptionSourceTypeEnum } from '@enums/home/prescription-source-type.enum';
import { showNotification } from '@helpers/show-toast';
import { IEhrPrescriptionDetails } from '@interfaces/home/i-ehr-prescription-details';
import { IBreadcrumbItem } from '@interfaces/i-breadcrumb-item';
import { EmrMedicationsService } from '@services/home/emr-medications/emr-medications.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ehr-prescription-details',
  templateUrl: './ehr-prescription-details.component.html',
  styleUrls: ['./ehr-prescription-details.component.scss'],
})
export class EhrPrescriptionDetailsComponent implements OnInit {
  pageTitle: string = 'EHR Prescription Details';
  breadcrumbList: IBreadcrumbItem[] = [
    { text: 'EHR Medications', link: '' },
    { text: 'EHR Prescription Details', link: '' },
  ];
  patientId: number;
  prescriptionId: number;
  prescriptionSourceType: number;
  prescriptionDetails: IEhrPrescriptionDetails;
  prescriptionFiles: string[] = [];
  prescriptionFilesAsImages: string[] = [];
  prescriptionFilesAsPDFs: string[] = [];

  constructor(
    private emrMedicationsService: EmrMedicationsService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.patientId = +this.activatedRoute.snapshot.params.patientId;
    this.prescriptionId = +this.activatedRoute.snapshot.params.prescriptionId;
    this.prescriptionSourceType =
      +this.activatedRoute.snapshot.params.prescriptionSourceType;

    if (
      this.prescriptionSourceType == this.prescriptionSourceTypeEnum.details
    ) {
      this.getPatientEmrPrescriptionDetails(
        this.prescriptionId,
        this.patientId
      );
    } else if (
      +this.prescriptionSourceType == this.prescriptionSourceTypeEnum.files
    ) {
      this.getPatientEmrPrescriptionFiles(this.prescriptionId, this.patientId);
    } else {
      showNotification(
        'danger',
        'Something went wrong with source type!',
        this.toastr
      );
    }
  }

  get prescriptionSourceTypeEnum() {
    return PrescriptionSourceTypeEnum;
  }

  getPatientEmrPrescriptionDetails(prescriptionId, patientId) {
    this.emrMedicationsService
      .getPatientEhrPrescriptionDetails(prescriptionId, patientId)
      .subscribe(
        (response) => {
          this.prescriptionDetails = response.data;
        },
        (error) => {
          showNotification(
            'danger',
            `${
              error.error
                ? error?.error?.errorList[0]?.message
                : error?.errors?.title
            }`,
            this.toastr
          );
        }
      );
  }

  getPatientEmrPrescriptionFiles(prescriptionId, patientId) {
    this.emrMedicationsService
      .getPatientEhrPrescriptionFiles(prescriptionId, patientId)
      .subscribe(
        (response) => {
          this.prescriptionFiles = response.data?.attachmentUrls;

          if (this.prescriptionFiles?.length) {
            this.prescriptionFiles.forEach((file) => {
              if (this.checkFileType(file)) {
                this.prescriptionFilesAsPDFs.push(file);
              } else {
                this.prescriptionFilesAsImages.push(file);
              }
            });
          }
        },
        (error) => {
          showNotification(
            'danger',
            `${
              error.error
                ? error?.error?.errorList[0]?.message
                : error?.errors?.title
            }`,
            this.toastr
          );
        }
      );
  }

  checkFileType(src) {
    const pattern = /.+.pdf$/;
    return pattern.test(src);
  }

  downloadFile(fileUrl) {
    this.emrMedicationsService.downloadFile(fileUrl, (response) => {
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
}
