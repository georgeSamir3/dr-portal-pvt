import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { IDiagnose } from '@interfaces/home/i-disgnose';
import { IPatient } from '@interfaces/home/i-patient';

@Component({
  selector: 'print-headers',
  templateUrl: './print-headers.component.html',
  styleUrls: ['./print-headers.component.scss']
})
export class PrintHeadersComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() patient:IPatient;
  @Input() doctorName:string;
  @Input() selectedDiagnoses:IDiagnose[];
}
