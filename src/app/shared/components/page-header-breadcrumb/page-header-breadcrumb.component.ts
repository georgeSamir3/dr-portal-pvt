import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'page-header-breadcrumb',
  templateUrl: './page-header-breadcrumb.component.html',
  styleUrls: ['./page-header-breadcrumb.component.scss']
})
export class PageHeaderBreadcrumbComponent implements OnInit {
  @Input() pageTitle;
  @Input() breadcrumbList;

  constructor() { }

  ngOnInit(): void {
  }

}
