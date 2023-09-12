import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IItems, IPatientList } from '@interfaces/patientsList/i-patientList';
import { ISmartTableColumn } from '@interfaces/smart-table/i-columns';
import { ISmartTableMessage } from '@interfaces/smart-table/i-message';
import { ISmartTablePagination } from '@interfaces/smart-table/i-pagination';
import { PatientsWithDoctorService } from '@services/home/patients-with-doctor.service/patients-with-doctor.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RouterLink } from '@angular/router';
import { AddVisitService } from '@services/add-visit/add-visit.service';
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
  showTable: boolean = true;
  searchedPatient: IItems[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private patientsWithDoctorService: PatientsWithDoctorService,
    private addVisitService: AddVisitService
  ) {}

  ngOnInit() {
    this.getAllDoctorPatients();
    this.messages = {
      emptyMessage: 'Hmm, There is no patients to display😔',
      totalMessage: 'total',
      selectedMessage: 'selected',
    };
    // this.getAllVisits()
  }
  getAllVisits() {
    this.addVisitService.getAllVisits().subscribe((response) => {
      console.log(response);
    });
  }
  getAllDoctorPatients() {
    this.loading = true;
    this.spinner.show();
    this.patientsWithDoctorService
      .getAllDoctorPatients(this.searchValue, this.currentPage, this.pageSize)
      .subscribe((response) => {
        if (this.searchValue) {
          this.showTable = false;
          this.searchedPatient = response.data.items;
        } else {
          this.showTable = true;
          this.patientListItems = response.data.items;
        }

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

        if (this.searchValue) {
          this.totalItems = this.searchedPatient.length;
        } else {
          this.totalItems = response.data?.pagination?.totalItems;
          this.totalPages = response.data?.pagination?.totalPages;
          this.currentPage = response.data?.pagination?.currentPage;
        }

        this.loading = false;
        this.spinner.hide();
      });
    console.log(this.patientListItems);
  }

  searchPatient(value: string) {
    this.searchValue = value;
    this.currentPage = 1;
    this.getAllDoctorPatients();
    console.log('search item', this.searchedPatient);
  }
  onChangePage(pageDetails: ISmartTablePagination) {
    this.currentPage = pageDetails.offset + 1;
    this.getAllDoctorPatients();
  }
  showPopUp(event: MouseEvent, selectedPatient: any) {
    this.selectedPatientId = selectedPatient.patientId;
    console.log(selectedPatient);
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
