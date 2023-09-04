import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-days-off',
  templateUrl: './days-off.component.html',
  styleUrls: ['./days-off.component.scss']
})
export class DaysOffComponent implements OnInit{

  constructor(public bsModalRef: BsModalRef) { }

  @Input() availableDays: {dayNo: number, dayName: string}[];
  @Output() event = new EventEmitter<number>();
  selectedOption: number = null;

  ngOnInit() {

  }

  handleModalHide() {
    this.bsModalRef.hide();
  }

  onContinue(){
    this.event.emit(this.selectedOption);
    this.handleModalHide();
  }
}
