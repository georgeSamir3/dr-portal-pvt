import { Component, OnInit, ViewChild } from '@angular/core';
import { OverLayComponent } from '@components/over-lay/over-lay.component';
@Component({
  selector: 'last-visit-details',
  templateUrl: './last-visit-details.component.html',
  styleUrls: ['./last-visit-details.component.scss'],
  // template:'<over-lay [data]="title"></over-lay>'
})
export class LastVisitDetailsComponent implements OnInit {
  countries:any[];
  selectedCountry;
  selectedDate: Date = new Date();
  visitType: any[];
  selectedType: any;
  title: string;  constructor() {
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
  assignTitle(title:string): void {
    this.title = title;
    console.log(this.title);
  }

 
}
