import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isPermissionExist } from '@helpers/permissions';
import { IRouteInfo } from '@interfaces/i-route-info';
import { NavigationModel } from '@models/navigation.model';

const misc: any = {
  sidebar_mini_active: true,
};

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  isCollapsed: boolean = true;
  menuItems: IRouteInfo[];
  navigationModel: NavigationModel;

  constructor(private router: Router) {
    this.navigationModel = new NavigationModel();
  }

  ngOnInit(): void {
    this.menuItems = this.navigationModel.routes.filter((menuItem) => {
      if (
        menuItem.path.includes('home') ||
        menuItem.path.includes('appointments') ||
        menuItem.path.includes('patientList') ||
        menuItem.path.includes('drug-drug-interaction')||
        menuItem.path.includes('add-patient-visit')
      ) {
        return menuItem;
      }
      if (
        menuItem.path.includes('drug-drug-interaction') ||
        (isPermissionExist('DoctorGliptus') &&
          menuItem.path.includes('gliptus-pms'))
      ) {
        return menuItem;
      }
    });

    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }


  onMouseEnterSidenav() {
    if (!document.body.classList.contains('g-sidenav-pinned')) {
      // document.body.classList.add('g-sidenav-show');
    }
  }

  onMouseLeaveSidenav() {
    if (!document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.remove('g-sidenav-show');
    }
  }

  minimizeSidebar() {
    const sidenavToggler =
      document.getElementsByClassName('sidenav-toggler')[0];
    const body = document.getElementsByTagName('body')[0];
    if (body.classList.contains('g-sidenav-pinned')) {
      misc.sidebar_mini_active = true;
    } else {
      misc.sidebar_mini_active = false;
    }
    if (misc.sidebar_mini_active === true) {
      body.classList.remove('g-sidenav-pinned');
      body.classList.add('g-sidenav-hidden');
      sidenavToggler.classList.remove('active');
      misc.sidebar_mini_active = false;
    } else {
      body.classList.add('g-sidenav-pinned');
      body.classList.remove('g-sidenav-hidden');
      sidenavToggler.classList.add('active');
      misc.sidebar_mini_active = true;
    }
  }
}
