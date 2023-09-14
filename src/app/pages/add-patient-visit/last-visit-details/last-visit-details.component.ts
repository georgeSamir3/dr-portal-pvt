import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OverLayComponent } from '@components/over-lay/over-lay.component';
import { AddVisitService } from '@services/add-visit/add-visit.service';
@Component({
  selector: 'last-visit-details',
  templateUrl: './last-visit-details.component.html',
  styleUrls: ['./last-visit-details.component.scss'],
  // template:'<over-lay [data]="title"></over-lay>'
})
export class LastVisitDetailsComponent implements OnInit {
  lastVisitForm: FormGroup;
  lastVisitDetails: any;
  edit='edit'
  revisit='revisit'
  userForm: FormGroup;
  patientId: number;
  
  selectedCountry;
  selectedDate: Date = new Date();
  visitType: any[];
  selectedType: any;
  title: string;
  constructor(
    private addVisitService: AddVisitService,
    private route: ActivatedRoute
  ) {
    this.visitType = [
      { label: 'Follow up', value: 'Follow up' },
      { label: 'London', value: 'London' },
      { label: 'Paris', value: 'Paris' },
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
    this.lastVisitForm = new FormGroup({
      // countries: new FormControl([]),
      selectedDate: new FormControl(),
      visitType: new FormControl([]),
      selectedType: new FormControl(),
      title: new FormControl(),
    });
    this.route.params.subscribe((param) => {
      console.log(param);
      if (param['patientId']) {
        this.patientId = param['patientId'];
        // this.getAllVisits();
      }
      console.log('params', this.patientId);
    });
    this.getLastVisit();
  }
  assignTitle(title: string): void {
    this.title = title;
    console.log(this.title);
  }
  getLastVisit() {
    this.addVisitService.getLastVisit(this.patientId).subscribe(
      (response) => {
        this.lastVisitDetails = response.data;
        console.log(this.lastVisitDetails);
      },
      (error) => {
        console.log('error retreiving data:' + error);
      }
    );
  }
  addPatientVisit() {
    const requestBody = {
      DoctorId: 0,
      PatientId: 0,
      VisitTypeId: this.selectedType,
      Date: this.selectedDate,
      IsPatientInsured: this.userForm.get('isPatientInsured').value,
      MoneyReceived: this.userForm.get('moneyReceived').value,
      PatientFullName: this.userForm.get('fullName').value,
      PatientPhone: this.userForm.get('phone').value,
    };

    this.addVisitService.addVisit(requestBody).subscribe(
      (response) => {
        console.log('Visit added successfully:', response);
        // this.router.navigateByUrl('/');
      },
      (error) => {
        console.error('Error adding visit:', error);
      }
    );
  }
}
