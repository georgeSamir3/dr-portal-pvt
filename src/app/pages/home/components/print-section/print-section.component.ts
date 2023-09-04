import { Component, Input, OnInit } from '@angular/core';
import {
  RXHeaderInfo,
  RXPatientInfo,
  RXDiagnoses,
  RXData,
  RXDoctorInfo,
  RXFooterInfo,
} from '@interfaces/home/i-print-section';

@Component({
  selector: 'print-section',
  templateUrl: './print-section.component.html',
  styleUrls: ['./print-section.component.scss'],
})
export class PrintSectionComponent implements OnInit {
  @Input() headerInfo: RXHeaderInfo;
  @Input() patientInfo: RXPatientInfo;
  @Input() rxDiagnoses: RXDiagnoses[];
  @Input() rxData: RXData[];
  @Input() doctorInfo: RXDoctorInfo;
  @Input() footerInfo: RXFooterInfo;
  @Input() rxMedicines: any[];
  @Input() notes: string;

  constructor() {}

  ngOnInit(): void {}
}
