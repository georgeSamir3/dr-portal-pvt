import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'last-visit-details',
  templateUrl: './last-visit-details.component.html',
  styleUrls: ['./last-visit-details.component.scss']
})
export class LastVisitDetailsComponent implements OnInit {
  countries:any[];
  selectedCountry;
  selectedDate: Date = new Date();
  visitType: any[];
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
