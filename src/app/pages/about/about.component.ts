import { Component, OnInit } from '@angular/core';
import { IBreadcrumbItem } from '@interfaces/i-breadcrumb-item';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  pageTitle: string = 'About Us';
  breadcrumbList: IBreadcrumbItem[] = [{ text: 'About Us', link: '' }];

  constructor() { }

  ngOnInit(): void {
  }

}
