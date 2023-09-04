import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IItems, IPagination, IPatientList } from '@interfaces/patientsList/i-patientList';
import { ISmartTableColumn } from '@interfaces/smart-table/i-columns';
import { ISmartTableMessage } from '@interfaces/smart-table/i-message';
import { ISmartTablePagination } from '@interfaces/smart-table/i-pagination';
import { PatientsWithDoctorService } from '@services/home/patients-with-doctor.service/patients-with-doctor.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-patient-List',
  templateUrl: './patient-List.component.html',
  styleUrls: ['./patient-List.component.scss']
})
export class PatientListComponent implements OnInit {

  patientList: IPatientList[] = [];
  patientListItems: IItems[] = [];
  patientListThead: string[];
  mappedPatientList: {
    patientid: number,
    patientname: string,
    patientphone: string
  } []= [];
  columns: ISmartTableColumn[];

  loading = false;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number;
  totalItems: number;
  messages: ISmartTableMessage;
  @ViewChild('ehrButtonTemplateRef') public ehrButtonTemplateRef: TemplateRef<any>;
  searchValue: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private patientsWithDoctorService: PatientsWithDoctorService) { }

  ngOnInit() {
    this.getAllDoctorPatients()
    this.messages = {
      emptyMessage: 'Hmm, There is no patients 😔',
      totalMessage: 'total',
      selectedMessage: 'selected'
    }
  }
  getAllDoctorPatients() {
    this.loading = true;
    this.spinner.show();
    this.patientsWithDoctorService.getAllDoctorPatients(this.searchValue, this.currentPage, this.pageSize)
      .subscribe((response) => {
        this.columns = [
          {prop: "patientId", name: "Patient ID"},
          {prop: "fullName", name: "Patient Name"},
          {prop: "phone", name: "Patient Phone"},
          {prop: "Ehr", name: "", cellTemplate: this.ehrButtonTemplateRef, sortable: false}
        ];
        this.patientListItems = response.data.items;
        this.loading = false;
        this.totalPages = response.data?.pagination?.totalPages;
        this.currentPage = response.data?.pagination?.currentPage;
        this.totalItems = response.data?.pagination?.totalItems;
        this.spinner.hide();
  });
  }

  onPatientClick(selectedPatient) {
    this.router.navigate(['patient-emr',selectedPatient.patientId]);
  }

  onChangePage(pageDetails: ISmartTablePagination){
    this.currentPage = pageDetails.offset + 1;
    this.getAllDoctorPatients();
  }

  searchPatient(value: string){
    this.searchValue = value;
    this.currentPage = 1;
    this.getAllDoctorPatients();
  }
}
