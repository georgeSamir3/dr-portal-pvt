import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBreadcrumbItem } from '@interfaces/i-breadcrumb-item';
import { MedicationTypeEnum } from '@enums/home/medication-type.enum';
import { EmrMedicationsService } from '@services/home/emr-medications/emr-medications.service';
import { IPatientMedication } from '@interfaces/home/i-patient-medication';
import { IDoctorMedication } from '@interfaces/home/i-doctor-medication';
import { ChannelTypeEnum } from '@enums/home/channel-type.enum';
import { IEmrPrescription } from '@interfaces/home/i-emr-prescription';
import { PrescriptionTypeEnum } from '@enums/home/prescription-type.enum';
import {
  EhrTypeEnum,
  UploadedPrescriptionType,
} from '@enums/home/ehr-type.enum';

@Component({
  selector: 'emr-medications',
  templateUrl: './emr-medications.component.html',
  styleUrls: ['./emr-medications.component.scss'],
})
export class EmrMedicationsComponent implements OnInit {
  pageTitle: string = 'EHR Medications';
  breadcrumbList: IBreadcrumbItem[] = [{ text: 'EHR Medications', link: '' }];
  patientId: string = '';
  prescriptionList: IEmrPrescription[] = [];
  prescriptionThead = [
    'CREATION DATE',
    'CHANNEL',
    'NO. OF MEDICATIONS',
    'Doctor NAME / PRESCRIPTION TITLE',
    'NOTE',
    'EHR TYPE',
  ];
  prescriptionCreatorType: number = null;
  pageSize: number = 20;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private emrMedicationsService: EmrMedicationsService
  ) {
    this.patientId = this.route.snapshot.params.patientId;
    this.prescriptionCreatorType = PrescriptionTypeEnum.all;
  }

  ngOnInit(): void {
    this.getEmrPrescriptions(
      this.patientId,
      PrescriptionTypeEnum.all,
      this.currentPage,
      this.pageSize
    );
  }

  get prescriptionTypeEnum() {
    return PrescriptionTypeEnum;
  }

  getEmrPrescriptions(
    patientId,
    prescriptionCreatorType,
    currentPage,
    pageSize
  ) {
    this.emrMedicationsService
      .getPatientEhrPrescriptions(
        patientId,
        prescriptionCreatorType,
        currentPage,
        pageSize
      )
      .subscribe((response) => {
        if (this.prescriptionList?.length) {
          this.prescriptionList = this.prescriptionList.concat(
            response?.data?.items
          );
        } else {
          this.prescriptionList = response?.data?.items;
        }

        this.currentPage = response?.data?.pagination.currentPage;
        this.totalPages = response?.data?.pagination.totalPages;
      });
  }

  onGetPrescriptions(filterType) {
    this.currentPage = 1;
    this.prescriptionList = [];
    this.prescriptionCreatorType = filterType;
    this.getEmrPrescriptions(
      this.patientId,
      filterType,
      this.currentPage,
      this.pageSize
    );
  }

  handlePrescriptionPagination() {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;

      this.getEmrPrescriptions(
        this.patientId,
        this.prescriptionCreatorType,
        this.currentPage,
        this.pageSize
      );
    }
  }

  getChannelType(channelId) {
    if (channelId == ChannelTypeEnum.application) return 'Application';
    else if (channelId == ChannelTypeEnum.admin) return 'Admin';
    else if (channelId == ChannelTypeEnum.portal) return 'Portal';
    return '--';
  }

  getEhrType(ehrTypeIds, uploadedPrescriptionTypeId) {
    if (ehrTypeIds[0] === EhrTypeEnum.UploadedPrescriptionTypeId) {
      if (
        uploadedPrescriptionTypeId ==
        UploadedPrescriptionType.TpaRequestUploadedPrescriptionTypeId
      )
        return 'Approvals, Reimbursement';
      else if (
        uploadedPrescriptionTypeId ==
        UploadedPrescriptionType.PrescriptionFulfillmentUploadedPrescriptionTypeId
      )
        return 'Prescriptions , Prescriptiontests';
      else if(uploadedPrescriptionTypeId == UploadedPrescriptionType.UploadedPrescriptionUploadedPrescriptionTypeId)
        return 'Prescription File';
    } else {
      let ehrTypeArr = [];
      ehrTypeIds.forEach((id) => {
        if (id === EhrTypeEnum.DoctorPrescriptionTypeId)
          ehrTypeArr.push('Doctor Prescription');
        else if (id === EhrTypeEnum.TestRequestTypeId)
          ehrTypeArr.push('Test Request');
        else if (id === EhrTypeEnum.PatientMedicationTypeId)
          ehrTypeArr.push('Patient Medication');
        else if (id === EhrTypeEnum.DiagnosisTypeId)
          ehrTypeArr.push('Diagnosis');
        else if (id === EhrTypeEnum.AllergyTypeId) ehrTypeArr.push('Allergy');
        else if (id === EhrTypeEnum.DiseaseTypeId) ehrTypeArr.push('Disease');
      });

      return ehrTypeArr.join(', ');
    }

    return '--';
  }

  onEmrPrescriptionDetails(
    isClickable,
    prescriptionSourceType,
    prescriptionId
  ) {
    if (isClickable) {
      this.router.navigate([
        'patient-emr',
        this.patientId,
        'medications',
        prescriptionSourceType,
        prescriptionId,
      ]);
    }
  }
}
