import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddVisitService } from '@services/add-visit/add-visit.service';
import { PatientsWithDoctorService } from '@services/home/patients-with-doctor.service/patients-with-doctor.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { showNotification } from '@helpers/show-toast';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'add-visit',
  templateUrl: './add-visit.component.html',
  styleUrls: ['./add-visit.component.scss'],
})
export class AddVisitComponent implements OnInit {
  @Input() data: any;
  @Input() type: string;
  userForm: FormGroup;
  patientId: number;
  patientName: string = '';
  phone: string = '';
  visitType: any[];
  isRecentVisit: boolean = true;
  selectedType: any;
  selectedDate: Date = new Date();
  loading = false;
  searchValue: string;
  currentPage: number = 1;
  pageSize: number = 10;
  retreivedDate:Date;
  finalPatientId:number
  constructor(
    private route: ActivatedRoute,
    private patientsWithDoctorService: PatientsWithDoctorService,
    private spinner: NgxSpinnerService,
    private addVisitService: AddVisitService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.visitType = [
      { label: 'Follow up', value: 1 },
      { label: 'Examination', value: 2 },
    ];
  }

  ngOnInit(): void {
    console.log('the data passed', this.data);
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

    if (this.type === 'edit' && this.data) {
      let {
        patientName,
        patientPhone,
        patientType,
        visitDiscount,
        visitAmount,
        visitType,
        visitDate,
        patientId
      } = this.data;
      this.patientId=patientId;
      this.userForm.patchValue({

        fullName: patientName || '',
        phone: patientPhone || '',
        isPatientInsured: patientType || true,
        isDiscountApplied: visitDiscount=="yes"?true : false||false,
        moneyReceived: visitAmount || 0,
        visitType: visitType || null,
        date: new Date(visitDate) || null,
      });
    }

    this.route.params.subscribe((param) => {
      console.log(param);
      if (param['fullName']) {
        this.patientName = param['fullName'];
      }
      console.log('params', this.patientName);
    });
    this.getVisit();
  }

  getVisit() {
    this.loading = true;
    this.spinner.show();
    this.addVisitService
      .getAllVisits(
        this.pageSize,
        this.currentPage,
        this.isRecentVisit,
        this.patientName
      )
      .subscribe(
        (response) => {
          console.log('data:', response.data.items);
          if (this.patientName) {
            this.phone = response.data.items[0].patientPhone;
            console.log('phone', this.phone);
            this.patientId = response.data.items[0].patientId;
          }
           else {
            this.patientId = 0;
          }

          this.loading = false;
          this.spinner.hide();
        },
        (error) => {
          console.log(error);
          showNotification(
            'danger',
            `Something went wrong , please try again`,
            this.toastr
          );
        }
      );
  }

  addPatientVisit() {
    let requestBody = {
      PatientId: this.patientId,
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
  inputChange() {
    console.log(this.userForm.get('fullName').value);
  }
  updatePatientType(isInsured: boolean, event: Event): void {
    this.userForm.get('isPatientInsured')?.setValue(isInsured);
    event.preventDefault();
    // console.log(
    //   this.userForm.get("date").value,
    //   new Date(this.userForm.get("date").value),
      
    // );

  }
  updateDiscountStatus(isApplied: boolean, event: Event): void {
    this.userForm.get('isDiscountApplied')?.setValue(isApplied);
    event.preventDefault();
  }
}
