import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { showNotification } from '@helpers/show-toast';
import { AddVisitService } from '@services/add-visit/add-visit.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'over-lay',
  templateUrl: './over-lay.component.html',
  styleUrls: ['./over-lay.component.scss'],
})
export class OverLayComponent implements OnInit {
  overlayForm: FormGroup;
  @Input() data: string;
  // countries: any[];
  selectedCountry;
  visitType: any[];
  selectedDate: Date = new Date();
  selectedType: any;
  userForm:FormGroup
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private addVisitService: AddVisitService
  ) {
    this.visitType = [
      { label: 'Follow up', value: 'Follow up' },
      { label: 'London', value: 'London' },
      { label: 'Paris', value: 'Paris' },
    ];
  }

  ngOnInit(): void {
    console.log("this is data being passed",this.data);
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
      selectedType: new FormControl(),
    });
    this.overlayForm = new FormGroup({
      countries: new FormControl([]),
      selectedCountry: new FormControl(),
      visitType: new FormControl([]),
      selectedDate: new FormControl(),
      selectedType: new FormControl(),
      isPatientInsured: new FormControl(true),
      isDiscountApplied: new FormControl(false),
      moneyReceived: new FormControl(),
    });
  }
  updatePatientType(isInsured: boolean, event: Event): void {
    this.overlayForm.get('isPatientInsured')?.setValue(isInsured);
    event.preventDefault();
  }
  updateDiscountStatus(isApplied: boolean, event: Event): void {
    this.overlayForm.get('isDiscountApplied')?.setValue(isApplied);
    event.preventDefault();
  }

  addPatientVisit() {
    let requestBody = {
      PatientId: 0,
      VisitTypeId: this.userForm.get('selectedType').value.value,
      Date: this.userForm.get('date').value.toLocaleDateString('en-US'),
      IsPatientInsured: this.userForm.get('isPatientInsured').value,
      MoneyReceived: this.userForm.get('moneyReceived').value,
      PatientFullName: this.userForm.get('fullName').value,
      PatientPhone: this.userForm.get('phone').value,
    };

    this.addVisitService.addVisit(requestBody).subscribe(
      (response) => {
        console.log('Visit added successfully:', response);
        this.router.navigateByUrl('/');
        showNotification(
          'success',
          `Patient visit added succesully`,
          this.toastr
        );
      },
      (error) => {
        console.error('Error adding visit:', error);
        showNotification(
          'danger',
          `Something went wrong , please try again`,
          this.toastr
        );
      }
    );
  }
}
