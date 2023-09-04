import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-consultaion-Duration-modal',
  templateUrl: './consultaion-Duration-modal.component.html',
  styleUrls: ['./consultaion-Duration-modal.component.scss']
})
export class ConsultaionDurationModalComponent implements OnInit {
  constructor( public bsModalRef: BsModalRef) { }

  @Input() availableDuration: {minute: number, segment: number}[];
  @Input() hourSegment: number;
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
