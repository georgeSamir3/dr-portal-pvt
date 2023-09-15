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
import { IVisits } from '@interfaces/visits/visits';
@Component({
  selector: 'add-patient-visit',
  templateUrl: './add-patient-visit.component.html',
  styleUrls: ['./add-patient-visit.component.scss'],
})
export class AddPatientVisitComponent implements OnInit {
  patientList: IPatientList[] = [];
  patientListItems: any[] = [];
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
  isRecentVisit: boolean = true;
  showCard: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private patientsWithDoctorService: PatientsWithDoctorService,
    private addVisitService: AddVisitService
  ) {}

  ngOnInit() {
    this.messages = {
      emptyMessage: 'Hmm, There is no patients to display😔',
      totalMessage: 'total',
      selectedMessage: 'selected',
    };
    this.getAllVisits();
  }

  getAllVisits() {
    this.loading = true;
    this.spinner.show();
    this.addVisitService
      .getAllVisits(
        this.pageSize,
        this.currentPage,
        this.isRecentVisit,
        this.searchValue
      )
      .subscribe(
        (response) => {
          console.log(response.data.items);
          if (this.searchValue) {
            this.showTable = false;
            this.searchedPatient = response.data.items;
            console.log('search', this.searchedPatient);
          } else {
            this.showTable = true;
            this.patientListItems = response.data.items;
            console.log(this.patientListItems);
          }
          this.columns = [
            { prop: 'visitType', name: 'Types' },
            { prop: 'patientName', name: 'Name' },
            { prop: 'patientPhone', name: 'Phone' },
            { prop: 'visitDate', name: 'Date' },
            { prop: 'visitDiscount', name: 'Discount' },
            { prop: 'patientType', name: 'Patient Type' },
            { prop: 'visitStatus', name: 'Status' },
            { prop: 'visitAmount', name: 'Amount' },
            // {
            //   prop: 'Ehr',
            //   name: '',
            //   cellTemplate: this.ehrButtonTemplateRef,
            //   sortable: false,
            // },
          ];
          if (this.searchValue) {
            this.totalItems = this.searchedPatient.length;
          } else {
            this.totalItems = response.data?.pagination?.totalItems;
            this.totalPages = response.data?.pagination?.totalPages;
            this.currentPage = response.data?.pagination?.currentPage;
          }
          this.loading = false;
          this.showCard = false;
          this.spinner.hide();
        },
        (error) => {
          this.showTable = false;
          this.showCard = true;
          console.log(
            'searched items',
            this.searchedPatient.length,
            this.showTable,
            this.showCard
          );
          console.log(error);
        }
      );
  }

  searchPatient(value: string) {
    this.searchValue = value;
    this.currentPage = 1;
    this.getAllVisits();
  }
  onChangePage(pageDetails: ISmartTablePagination) {
    this.currentPage = pageDetails.offset + 1;
    this.getAllVisits();
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
