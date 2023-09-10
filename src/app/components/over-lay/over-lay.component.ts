import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'over-lay',
  templateUrl: './over-lay.component.html',
  styleUrls: ['./over-lay.component.scss']
})
export class OverLayComponent implements OnInit {
  countries:any[];
  selectedCountry;
  constructor() {
    this.countries=[
      {label:"EG +20",value:"+20" },
      {label:"EG +20",value:"+20" },
      {label:"EG +20",value:"+20" },
    ]
   }

  ngOnInit(): void {
  }

}
