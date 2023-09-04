import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TableColumn } from '@swimlane/ngx-datatable';
import { IPatientEmrDetails } from '@interfaces/home/i-patient-emr-details';
import { IPatientVitalsData } from '@interfaces/home/i-patient-vitals-data';
import { ISmartTableMessage } from 'src/app/_interfaces/smart-table/i-message';
import { ISmartTablePagination } from 'src/app/_interfaces/smart-table/i-pagination';
import { PatientEmrDetailsService } from '@services/home/patient-emr/patient-emr-details.service';

@Component({
  selector: 'app-vitals-data',
  templateUrl: './vitals-data.component.html',
  styleUrls: ['./vitals-data.component.scss']
})
export class VitalsDataComponent implements OnInit {

  patientId: number = 0;
  patientEmrDetails: IPatientEmrDetails;
  patientVitalsDate: IPatientVitalsData[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number;
  columns: TableColumn[];
  messages: ISmartTableMessage = {
    emptyMessage: 'Hmm, There is no vital Signs',
    totalMessage: 'total',
    selectedMessage: ''
  };


  constructor(
    private patientEmrDetailsService: PatientEmrDetailsService,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
  ) {
    this.patientId = this.activatedRoute.snapshot.params.patientId
  }


  ngOnInit(): void {
    this.getPatientVitals(this.patientId, this.currentPage, this.pageSize)
  }

  getPatientVitals(patientId, currentPage, pageSize) {
    this.patientEmrDetailsService.getPatientAllVitals(patientId, currentPage, pageSize)
      .subscribe(response => {
        this.patientVitalsDate = response.data.items;
        this.totalItems = response.data.pagination.totalItems;
        this.initializeColumn();
      })

  }

  initializeColumn() {
    this.columns = [
      {
        prop: 'creationDate',
        name: 'Request Date',
        pipe: { transform: (val) => this.datePipe.transform(val, "MMM d, y, h:mm a") },
        width: 200
      },
      { prop: 'height', name: 'Height', pipe: { transform: (val) => val ? val : "--" } },
      { prop: 'weight', name: 'Weight', pipe: { transform: (val) => val ? val : "--" } },
      { prop: 'isSmoker', name: 'Smoker', pipe: { transform: (val) => val === true ? 'Yes' : val === false ? 'No' : '--' } },
      { prop: 'isAlcoholic', name: 'Alcoholic', pipe: { transform: (val) => val === true ? 'Yes' : val === false ? 'No' : '--' } },
      { prop: 'heartRate', name: 'Heart Rate', pipe: { transform: (val) => val ? val : "--" } },
      { prop: 'temperature', name: 'Temperature', pipe: { transform: (val) => val ? val : "--" } },
      { prop: 'respiratoryRate', name: 'Respiratory Rate', pipe: { transform: (val) => val ? val : "--" } },
      { prop: 'oxygenSaturation', name: 'Oxygen Saturation', pipe: { transform: (val) => val ? val : "--" } },
      { prop: 'bloodPressure', name: 'Blood Pressure', pipe: { transform: (val) => val ? val : "--" } },
      { prop: 'bloodType', name: 'Blood Type', pipe: { transform: (val) => val ? val : "--" } },
      { prop: 'emergencyContact', name: 'Emergency Contact', pipe: { transform: (val) => val ? val : "--" } },
    ];
  }


  onChangePage(pageDetails: ISmartTablePagination) {
    this.currentPage = pageDetails.offset + 1;
    this.getPatientVitals(this.patientId, this.currentPage, this.pageSize);
  }

}
