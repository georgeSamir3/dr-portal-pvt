import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientsWithDoctorService } from '@services/home/patients-with-doctor.service/patients-with-doctor.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'add-visit',
  templateUrl: './add-visit.component.html',
  styleUrls: ['./add-visit.component.scss'],
})
export class AddVisitComponent implements OnInit {
  patientName: string = '';
  phone:string='';
  visitType: any[];
  selectedType: any;
  selectedDate: Date = new Date();
  loading = false;
  searchValue: string;
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(
    private route: ActivatedRoute,
    private patientsWithDoctorService: PatientsWithDoctorService,
    private spinner: NgxSpinnerService
  ) {
    this.visitType = [
      { label: 'Follow up', value: 'Follow up' },
      { label: 'London', value: 'London' },
      { label: 'Paris', value: 'Paris' },
    ];
  }

  ngOnInit(): void {
    console.log("object");
    this.route.params.subscribe((params) => {
      this.patientName = params['fullName'];
      console.log("patient name",this.patientName);
    });
    
    this.getDoctorPatient()
  }
  getDoctorPatient() {
    this.loading = true;
    this.spinner.show();
    this.patientsWithDoctorService.getAllDoctorPatients(
      this.patientName,
      this.currentPage,
      this.pageSize
    ).subscribe((response) => {
      this.phone=response.data.items[0].phone
      this.patientName=response.data.items[0].fullName
      // console.log(response.data.items[0].phone);
      // console.log(response.data.items[0].fullName);
    })
  }
}
