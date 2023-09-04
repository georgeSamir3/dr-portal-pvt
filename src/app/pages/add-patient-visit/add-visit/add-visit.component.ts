import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'add-visit',
  templateUrl: './add-visit.component.html',
  styleUrls: ['./add-visit.component.scss'],
})
export class AddVisitComponent implements OnInit {
  userId: string = '';
  visitType: any[];
  selectedType: any;
  selectedDate:Date=new Date()
  constructor(private route: ActivatedRoute) {
    this.visitType = [
      { label: 'Follow up', value: 'Follow up' },
      { label: 'London', value: 'London' },
      { label: 'Paris', value: 'Paris' },
      // Add more options as needed
    ];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = params['userId'];
    });
  }
}
