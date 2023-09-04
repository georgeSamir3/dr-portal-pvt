import { Component, OnInit } from '@angular/core';
import {
  Router,
  Event,
  NavigationEnd,
} from '@angular/router';
import { Location } from '@angular/common';
import { NavigationModel } from '@models/navigation.model';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  userName;
  sidenavOpen: boolean = true;
  location: Location;
  navigationModel: NavigationModel;

  constructor(
    location: Location,
    private router: Router,
    private authService: AuthService
  ) {
    this.navigationModel = new NavigationModel();
    this.location = location;

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (window.innerWidth < 1200) {
          document.body.classList.remove('g-sidenav-pinned');
          document.body.classList.add('g-sidenav-hidden');
          this.sidenavOpen = false;
        }
      }
    });
  }

  ngOnInit() {
    this.userName = localStorage.getItem('fullName');
  }

  onLogOut() {
    this.authService.logoutLocalStorageClear();
    this.router.navigateByUrl('auth/login');
  }

  openSidebar() {
    if (document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.remove('g-sidenav-pinned');
      document.body.classList.add('g-sidenav-hidden');
      this.sidenavOpen = false;
    } else {
      document.body.classList.add('g-sidenav-pinned');
      document.body.classList.remove('g-sidenav-hidden');
      this.sidenavOpen = true;
    }
  }

  toggleSidenav() {
    if (document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.remove('g-sidenav-pinned');
      document.body.classList.add('g-sidenav-hidden');
      this.sidenavOpen = false;
    } else {
      document.body.classList.add('g-sidenav-pinned');
      document.body.classList.remove('g-sidenav-hidden');
      this.sidenavOpen = true;
    }
  }
}
