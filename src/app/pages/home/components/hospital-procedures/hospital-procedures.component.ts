import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ChannelTypeEnum } from 'src/app/_enums/home/channel-type.enum';
import { PrescriptionTypeEnum } from 'src/app/_enums/home/prescription-type.enum';
import { IEmrHospitalProcedures } from '@interfaces/Emr/i-emr-hospital-procedure';
import { EhrPrescriptionFilesServiceService } from 'src/app/_services/home/emr-hospital-procedures/ehr-prescription-files-service.service';
import { PatientEmrDetailsService } from 'src/app/_services/home/patient-emr/patient-emr-details.service';

@Component({
  selector: 'app-hospital-procedures',
  templateUrl: './hospital-procedures.component.html',
  styleUrls: ['./hospital-procedures.component.scss']
})
export class HospitalProceduresComponent implements OnInit {

  patientId: string = '';
  hospitalList: IEmrHospitalProcedures[] = [];
  hospitalThead = [
    'CREATION DATE',
    'CHANNEL',
    'NOTE',
  ];
  hospitalProcedureCreatorType: number = null;
  pageSize: number = 20;
  currentPage: number = 1;
  totalPages: number = 1;
  modalRef: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientEmrDetailsService: PatientEmrDetailsService,
  ) {
    this.patientId = this.route.snapshot.params.patientId;
    this.hospitalProcedureCreatorType = PrescriptionTypeEnum.all;
  }

  ngOnInit() {
    this.getEmrHospitalProcedures(
      this.patientId,
      PrescriptionTypeEnum.all,
      this.currentPage,
      this.pageSize
    );
  }
  get prescriptionTypeEnum() {
    return PrescriptionTypeEnum;
  }
  getEmrHospitalProcedures(
    patientId,
    prescriptionCreatorType,
    currentPage,
    pageSize
  ) {
    this.patientEmrDetailsService
      .getPatientEhrHospitalProcedures(
        patientId,
        prescriptionCreatorType,
        currentPage,
        pageSize
      )
      .subscribe((response) => {
        this.hospitalList = this.hospitalList.concat(
          response?.data?.items
        );
        this.currentPage = response?.data?.pagination.currentPage;
        this.totalPages = response?.data?.pagination.totalPages;
      });
  }

  onGetHospitalProcedures(filterType) {
    this.currentPage = 1;
    this.hospitalList = [];
    this.hospitalProcedureCreatorType = filterType;
    this.getEmrHospitalProcedures(
      this.patientId,
      filterType,
      this.currentPage,
      this.pageSize
    );
  }

  handleHospitalPagination() {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;

      this.getEmrHospitalProcedures(
        this.patientId,
        this.hospitalProcedureCreatorType,
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
}
