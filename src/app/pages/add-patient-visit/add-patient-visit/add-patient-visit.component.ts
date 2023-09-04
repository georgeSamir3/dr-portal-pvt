import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IItems, IPatientList } from '@interfaces/patientsList/i-patientList';
import { ISmartTableColumn } from '@interfaces/smart-table/i-columns';
import { ISmartTableMessage } from '@interfaces/smart-table/i-message';
import { ISmartTablePagination } from '@interfaces/smart-table/i-pagination';
import { PatientsWithDoctorService } from '@services/home/patients-with-doctor.service/patients-with-doctor.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'add-patient-visit',
  templateUrl: './add-patient-visit.component.html',
  styleUrls: ['./add-patient-visit.component.scss'],
})
export class AddPatientVisitComponent implements OnInit {
  patientList: IPatientList[] = [];
  patientListItems: IItems[] = [];
  patientListThead: string[];
  mappedPatientList: {
    patientid: number;
    patientname: string;
    patientphone: string;
  }[] = [];
  columns: ISmartTableColumn[];
  loading = false;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number;
  totalItems: number;
  searchValue: string;
  messages: ISmartTableMessage;
  @ViewChild('ehrButtonTemplateRef')
  public ehrButtonTemplateRef: TemplateRef<any>;
  showOverlay: boolean = false;
  overlayStyle: { [key: string]: string } = {};
  selectedPatientId: number | null = null;



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private patientsWithDoctorService: PatientsWithDoctorService
  ) {}

  ngOnInit() {
    this.getAllDoctorPatients();
    this.messages = {
      emptyMessage: 'Hmm, There is no patients to display😔',
      totalMessage: 'total',
      selectedMessage: 'selected',
    };
  }
  getAllDoctorPatients() {
    this.loading = true;
    this.spinner.show();
    this.patientsWithDoctorService
      .getAllDoctorPatients(this.searchValue, this.currentPage, this.pageSize)
      .subscribe((response) => {
        this.columns = [
          { prop: 'patientId', name: 'Patient ID' },
          { prop: 'fullName', name: 'Patient Name' },
          { prop: 'phone', name: 'Patient Phone' },
          {
            prop: 'Ehr',
            name: '',
            cellTemplate: this.ehrButtonTemplateRef,
            sortable: false,
          },
        ];
        this.patientListItems = response.data.items;
        this.loading = false;
        this.totalPages = response.data?.pagination?.totalPages;
        this.currentPage = response.data?.pagination?.currentPage;
        this.totalItems = response.data?.pagination?.totalItems;
        this.spinner.hide();
      });
  }

  searchPatient(value: string) {
    this.searchValue = value;
    this.currentPage = 1;
    this.getAllDoctorPatients();
  }
  onChangePage(pageDetails: ISmartTablePagination) {
    this.currentPage = pageDetails.offset + 1;
    this.getAllDoctorPatients();
  }
  showPopUp(event:MouseEvent,selectedPatient:any) {
    this.selectedPatientId = selectedPatient.patientId;
    console.log(selectedPatient)
    const buttonElement = event.target as HTMLElement;
    const buttonRect = buttonElement.getBoundingClientRect();
    const buttonTop = buttonRect.top + window.pageYOffset;
    const buttonLeft = buttonRect.left + window.pageXOffset;

    this.overlayStyle = {
      // top: `${buttonTop}px`,
      // left: `${buttonLeft}px`,
      // position:`absolute`,
    };

    this.showOverlay = !this.showOverlay;
  }
}