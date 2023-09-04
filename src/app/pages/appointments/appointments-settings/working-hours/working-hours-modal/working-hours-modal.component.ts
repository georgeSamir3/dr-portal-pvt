import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-working-hours-modal',
  templateUrl: './working-hours-modal.component.html',
  styleUrls: ['./working-hours-modal.component.scss']
})
export class WorkingHoursModalComponent implements OnInit {
  adjustForm:FormGroup = this.fb.group({
    dayOfWeek:['',Validators.required],
    startTime:['',Validators.required],
    endTime:['',Validators.required]
  })

  constructor(private fb:FormBuilder, public bsModalRef: BsModalRef) { }

  @Input() availableDays: {dayNo: number, dayName: string}[];
  @Output() event: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Input() ErrorMessage: string;
  selectedOption: number = null;
  // res:any;

  ngOnInit() {
  }

  handleModalHide() {
    this.bsModalRef.hide();
  }

  onContinue(){
    this.event.emit(this.adjustForm.value);
    this.handleModalHide();
  }

}
