import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'over-lay',
  templateUrl: './over-lay.component.html',
  styleUrls: ['./over-lay.component.scss'],
})
export class OverLayComponent implements OnInit {
  overlayForm: FormGroup;
  @Input() data: string;
  countries: any[];
  selectedCountry;
  visitType: any[];
  selectedDate: Date = new Date();
  selectedType: any;

  constructor() {
    (this.countries = [
      { label: 'EG +20', value: '+20' },
      { label: 'EG +20', value: '+20' },
      { label: 'EG +20', value: '+20' },
    ]),
      (this.visitType = [
        { label: 'Follow up', value: 'Follow up' },
        { label: 'London', value: 'London' },
        { label: 'Paris', value: 'Paris' },
      ]);
  }

  ngOnInit(): void {
    this.overlayForm = new FormGroup({
      countries: new FormControl([]),
      selectedCountry: new FormControl(),
      visitType: new FormControl([]),
      selectedDate: new FormControl(),
      selectedType: new FormControl(),
      isPatientInsured:new FormControl(true),
      isDiscountApplied: new FormControl(false),
      moneyReceived:new FormControl()
    });
  }
  updatePatientType(isInsured: boolean, event: Event): void {
    this.overlayForm.get('isPatientInsured')?.setValue(isInsured);
    event.preventDefault()
  }
  updateDiscountStatus(isApplied: boolean, event: Event): void {
    this.overlayForm.get('isDiscountApplied')?.setValue(isApplied);
    event.preventDefault()
  }
}
