import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelTypeEnum } from '@enums/home/channel-type.enum';
import { isPermissionExist } from '@helpers/permissions';
import { IPatient } from '@interfaces/home/i-patient';
import { IPatientEmrDetails } from '@interfaces/home/i-patient-emr-details';
import { IBreadcrumbItem } from '@interfaces/i-breadcrumb-item';
import { IResponse } from '@interfaces/i-response';
import { HomeService } from '@services/home/home.service';
import { PatientEmrDetailsService } from '@services/home/patient-emr/patient-emr-details.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ConvoyPermission } from 'src/app/_constants/permissions';

@Component({
  selector: 'patient-emr',
  templateUrl: './patient-emr.component.html',
  styleUrls: ['./patient-emr.component.scss'],
})
export class PatientEmrComponent implements OnInit {
  pageTitle: string = "Patient's EHR";
  breadcrumbList: IBreadcrumbItem[] = [{ text: "Patient's EHR", link: '' }];
  patientId: string = '';
  modalRef: BsModalRef;
  patientEmrDetails: IPatientEmrDetails;

  connectToPatientDate: {
    Phone: string,
    LimitlessCareCardId: string,
    CompanyEmployeeId: string
  } = {
      Phone: '',
      LimitlessCareCardId: '',
      CompanyEmployeeId: ''
    };

  patientConvoy: {
    patientConvoyId: string;
  } = { patientConvoyId: '' }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientEmrDetailsService: PatientEmrDetailsService,
    public homeService: HomeService,

  ) {
    this.patientId = this.route.snapshot.params.patientId;
  }

  ngOnInit(): void {
    this.getPatientEmrDetails(this.patientId);
  }

  getPatientEmrDetails(patientId) {
    this.patientEmrDetailsService
      .getPatientEhrDetails(patientId)
      .subscribe(
        {
          next: (response) => {
            this.patientEmrDetails = response.data;
            this.connectToPatientDate.Phone = this.patientEmrDetails.demographicInformation.phone
            this.connectToPatientDate.LimitlessCareCardId = this.patientEmrDetails.demographicInformation.limitlessCareCardId
            this.connectToPatientDate.CompanyEmployeeId = this.patientEmrDetails.demographicInformation.companyEmployeeId
          },
          complete: () => {
            if (this.isConvoy()) {
              this.patientConvoy.patientConvoyId = this.patientEmrDetails.demographicInformation.convoyId.substring(5)
              this.homeService.connectToConvoyPatient(this.patientConvoy).subscribe((response) => {
                this.homeService.patientData = response.data;
              });
              return;
            }
            this.homeService.connectToPatient(this.connectToPatientDate).subscribe((response: IResponse<IPatient>) => {
              this.homeService.patientData = response.data;
            });
          }


        }
      );
  }

  getChannelType(channelId) {
    if (channelId == ChannelTypeEnum.application) return 'Application';
    else if (channelId == ChannelTypeEnum.admin) return 'Admin';
    else if (channelId == ChannelTypeEnum.portal) return 'Portal';
    return '--';
  }
  onEmrHospitalDetails(
    hospitalProcedureSourceType,
    hospitalProcedureId
  ) {
    this.router.navigate([
      'patient-emr',
      this.patientId,
      'hospital-Procedures',
      hospitalProcedureSourceType,
      hospitalProcedureId,
    ]);
  }
  reDirectToCreatePrescriptionPage() {
    this.router.navigate(['create-e-prescription', this.route.snapshot.params.patientId]);
  }


  @HostListener('window:beforeunload', ['$event'])
  onbeforeunload(event) {
    localStorage.setItem('patient', JSON.stringify(this.homeService.patientData))
  }

  isConvoy() {
    return isPermissionExist(ConvoyPermission);
  }

}
