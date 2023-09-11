import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'over-lay',
  templateUrl: './over-lay.component.html',
  styleUrls: ['./over-lay.component.scss']
})
export class OverLayComponent implements OnInit {
  @Input() data: string;
  countries:any[];
  selectedCountry;
  visitType: any[];
  selectedDate: Date = new Date();
  selectedType: any;

  constructor() {
    this.countries=[
      {label:"EG +20",value:"+20" },
      {label:"EG +20",value:"+20" },
      {label:"EG +20",value:"+20" },
    ],
    this.visitType = [
      { label: 'Follow up', value: 'Follow up' },
      { label: 'London', value: 'London' },
      { label: 'Paris', value: 'Paris' },
    ];
   }

  ngOnInit(): void {
  }

}
