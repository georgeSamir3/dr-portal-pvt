import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddVisitService } from '@services/add-visit/add-visit.service';
import { PatientsWithDoctorService } from '@services/home/patients-with-doctor.service/patients-with-doctor.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'add-visit',
  templateUrl: './add-visit.component.html',
  styleUrls: ['./add-visit.component.scss'],
})
export class AddVisitComponent implements OnInit {
  patientName: string = '';
  phone: string = '';
  visitType: any[];
  isPatientInsured: boolean = true;
  isDiscountApplied: boolean = false;
  selectedType: any;
  selectedDate: Date = new Date();
  loading = false;
  moneyReceived: number=0;
  searchValue: string;
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(
    private route: ActivatedRoute,
    private patientsWithDoctorService: PatientsWithDoctorService,
    private spinner: NgxSpinnerService,
    private addVisitService: AddVisitService,
    private router: Router
  ) {
    this.visitType = [
      { label: 'Follow up', value: 'Follow up' },
      { label: 'London', value: 'London' },
      { label: 'Paris', value: 'Paris' },
    ];
  }

  ngOnInit(): void {
    console.log('object');
    // this.route.params.subscribe((params) => {
    //   this.patientName = params['fullName'];
    //   console.log("patient name",this.patientName);
    // });
    this.route.params.subscribe((param) => {
      console.log(param);
      this.patientName = param['fullName'];
      console.log('patient name', this.patientName);
    });

    this.getDoctorPatient();
  }
  getDoctorPatient() {
    this.loading = true;
    this.spinner.show();
    this.patientsWithDoctorService
      .getAllDoctorPatients(this.patientName, this.currentPage, this.pageSize)
      .subscribe((response) => {
        console.log(response);
        if (this.patientName) {
          this.phone = response.data.items[0].phone;
          this.patientName = response.data.items[0].fullName;
        }

        // console.log(response.data.items[0].phone);
        // console.log(response.data.items[0].fullName);
      });
  }
  addPatientVisit() {
    const requestBody = {
      DoctorId: 0,
      PatientId: 0,
      VisitTypeId: this.selectedType,
      Date: this.selectedDate.toISOString(),
      IsPatientInsured: this.isPatientInsured,
      MoneyRecieved: this.moneyReceived,
      PatientFullName: this.patientName,
      PatientPhone: this.phone,
    };

    this.addVisitService.addVisit(requestBody).subscribe(
      (response) => {
        console.log('Visit added successfully:', response);
        this.router.navigateByUrl('/');
        // this.patientName = '';
        // this.phone = '';
        // this.selectedType = null;
        // this.selectedDate = new Date();
      },
      (error) => {
        console.error('Error adding visit:', error);
      }
    );
  }
}
