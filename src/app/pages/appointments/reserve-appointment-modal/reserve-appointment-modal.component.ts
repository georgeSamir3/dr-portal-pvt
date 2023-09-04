import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAddNewPatientAndReserveRequest, IReserveAppointments } from '@interfaces/Appointments/i-reserve-appointments';
import { AppointmentsInRangeService } from '@services/Appointments/AppointmentsInRange.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'reserve-appointment-modal',
  templateUrl: './reserve-appointment-modal.component.html',
  styleUrls: ['./reserve-appointment-modal.component.scss']
})
export class ReserveAppointmentModalComponent implements OnInit {

  isAddingPatient: boolean = false;
  patientInfoForm: FormGroup = this.formBuilder.group({
    phoneNumber: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],]
  });
  addPatientInfoForm: FormGroup;
  @Input() appointmentStartDate: string;
  @Output() event = new EventEmitter<IReserveAppointments>();

  constructor(public bsModalRef: BsModalRef, private formBuilder: FormBuilder,
    private appointmentsInRangeService: AppointmentsInRangeService,
    private spinner: NgxSpinnerService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  initializeAddPatientForm(phone: string){
    this.addPatientInfoForm = this.formBuilder.group({
      phoneNumber: [phone, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      fullName: ['', [Validators.required]],
      gender: [null],
      height: [0],
      weight: [0],
      birthdate: ['']
    });
  }

  onReserveAppointment(){
    let phone: string = this.createConnectToPatientRequestBody().Phone;
    if(phone && !this.isAddingPatient){
      this.spinner.show();
      this.getPatientId(phone);
      this.cdr.detectChanges();
    }
    else if(this.isAddingPatient){
      let addBody = this.createAddNewPatientAndReserveBody();
      this.appointmentsInRangeService.addNewPatientAndReserve(addBody).subscribe(
        res => {
          this.event.emit(res.data);
          this.handleModalHide();
          this.isAddingPatient = false;
        }
      );
    }
  }

  createConnectToPatientRequestBody() {
    return {
      Phone: this.patientInfoForm.value.phoneNumber,
    };
  }

  getPatientId(phone: string) {
    this.appointmentsInRangeService.SearchForPatient(phone).subscribe(res =>{
      if(res.data){
        let patientId = res.data.patientId;
        this.appointmentsInRangeService.getPatientDetails(patientId).subscribe(re=>{
          re.data;
        })

        let body = {
          patientId:patientId,
          startDateTime:this.appointmentStartDate
        }
        this.appointmentsInRangeService.reserveAppointment(body).subscribe(
          (response)=>{
            this.event.emit(response.data);
            this.handleModalHide();
          }
        );
      }
      else{
        this.isAddingPatient = true;
        this.initializeAddPatientForm(phone);
      }
    });

  }

  createAddNewPatientAndReserveBody() : IAddNewPatientAndReserveRequest{
    let body: IAddNewPatientAndReserveRequest = {
      birthdate: this.addPatientInfoForm.value.birthdate || null,
      fullName: this.addPatientInfoForm.value.fullName,
      gender: this.addPatientInfoForm.value.gender,
      height: this.addPatientInfoForm.value.height || null,
      weight: this.addPatientInfoForm.value.weight || null,
      phone: this.addPatientInfoForm.value.phoneNumber,
      startDateTime: this.appointmentStartDate
    };
    return body;
  }

  handleModalHide() {
    this.isAddingPatient = false;
    this.patientInfoForm.reset();
    this.bsModalRef.hide();
  }

}
