import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  date: Date = new Date();

  constructor() {}

  ngOnInit() {
    let html = document.getElementsByTagName('html')[0];
    // html.classList.add("auth-layout");
    let body = document.getElementsByTagName('body')[0];
    body?.classList.add('bg-gradient');
    let navbar = document.getElementsByClassName('navbar-horizontal')[0];
    navbar?.classList.add('navbar-light');
    navbar?.classList.add('navbar-transparent');
  }

  ngOnDestroy() {
    let html = document.getElementsByTagName('html')[0];
    // html.classList.remove("auth-layout");
    let body = document.getElementsByTagName('body')[0];
    body?.classList.remove('bg-gradient');
    let navbar = document.getElementsByClassName('navbar-horizontal')[0];
    navbar?.classList.remove('navbar-light');
    navbar?.classList.remove('navbar-transparent');
  }
}
