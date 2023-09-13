import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddVisitService } from '@services/add-visit/add-visit.service';
import { PatientsWithDoctorService } from '@services/home/patients-with-doctor.service/patients-with-doctor.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'add-visit',
  templateUrl: './add-visit.component.html',
  styleUrls: ['./add-visit.component.scss'],
})
export class AddVisitComponent implements OnInit {
  userForm: FormGroup;
  patientId: number;
  patientName: string = '';
  phone: string = '';
  visitType: any[];
  // isPatientInsured: boolean = true;
  // isDiscountApplied: boolean = false;
  selectedType: any;
  selectedDate: Date = new Date();
  loading = false;
  // moneyReceived: number = 0;
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
      { label: 'Follow up', value: 1 },
      { label: 'Examination', value: 2 },
    ];
  }

  ngOnInit(): void {
    this.userForm = new FormGroup({
      fullName: new FormControl('', Validators.required),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
      ]),
      isPatientInsured: new FormControl(true, Validators.required),
      isDiscountApplied: new FormControl(false, Validators.required),
      moneyReceived: new FormControl(0, [
        Validators.required,
        Validators.min(1),
      ]),
      visitType: new FormControl(
        [
          { label: 'Follow up', value: 'Follow up' },
          { label: 'Examination', value: 'Examination' },
        ],
        Validators.required
      ),
      date: new FormControl(Date, Validators.required),
    });

    console.log('object');
    this.route.params.subscribe((param) => {
      console.log(param);
      if (param['fullName']) {
        this.patientName = param['fullName'];
        console.log('patient name', this.patientName);
        // this.getDoctorPatient();
      }
    });

    this.getDoctorPatient();
  }
  getDoctorPatient() {
    console.log('this name', this.patientName);
    this.loading = true;
    this.spinner.show();
    this.patientsWithDoctorService
      .getAllDoctorPatients(this.patientName, this.currentPage, this.pageSize)
      .subscribe((response) => {
        console.log(response);
        if (this.patientName) {
          this.phone = response.data.items[0].phone;
          this.patientName = response.data.items[0].fullName;
          this.patientId=response.data.items[0].patientId
        }
        else{
          this.patientId=0  
        }
        console.log('this phone', this.phone);
        console.log('this id', this.patientId);
        console.log('this name', this.patientName);
      });
  }
  addPatientVisit() {
    const requestBody = {
      // DoctorId: 0,
      PatientId: this.patientId,
      VisitTypeId: this.selectedType,
      Date: this.userForm.get('date').value.toLocaleDateString('en-US'),
      IsPatientInsured: this.userForm.get('isPatientInsured').value,
      MoneyRecieved: this.userForm.get('moneyReceived').value,
      PatientFullName: this.userForm.get('fullName').value,
      PatientPhone: this.userForm.get('phone').value,
    };

    this.addVisitService.addVisit(requestBody).subscribe(
      (response) => {
        console.log('Visit added successfully:', response);
        this.router.navigateByUrl('/');
      },
      (error) => {
        console.error('Error adding visit:', error);
      }
    );
  }
  inputChange() {
    console.log(this.userForm.get('fullName').value);
  }
  updatePatientType(isInsured: boolean, event: Event): void {
    this.userForm.get('isPatientInsured')?.setValue(isInsured);
    event.preventDefault();
    console.log(
      this.userForm.get('date').value.toLocaleDateString('en-US')
    );
  }
  updateDiscountStatus(isApplied: boolean, event: Event): void {
    this.userForm.get('isDiscountApplied')?.setValue(isApplied);
    event.preventDefault();
  }
}
