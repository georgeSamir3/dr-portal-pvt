import { IRouteInfo } from '@interfaces/i-route-info';

export class NavigationModel {
  routes: IRouteInfo[];

  constructor() {
    this.routes = [
      {
        path: 'home',
        title: 'Home',
        type: 'link',
        icontype: 'fas fa-home text-primary',
        isCollapsed: true,
      },
      {
        path: 'patientList',
        title: 'Patients List',
        type: 'link',
        icontype: 'fas fa-users text-primary',
        isCollapsed: true,
      },
      {
        path: 'appointments',
        title: 'Appointments',
        type: 'link',
        icontype: 'fas fa-calendar-check text-primary',
        isCollapsed: true,
      },
      {
        path: 'gliptus-pms',
        title: 'Gliptus PMS',
        type: 'link',
        icontype: 'ni-briefcase-24 text-primary',
        isCollapsed: true,
      },
      {
        path: 'drug-drug-interaction',
        title: 'Drug Drug Interaction',
        type: 'link',
        icontype: 'ni-briefcase-24 text-primary',
        isCollapsed: true,
      },
      {
        path: 'add-patient-visit',
        title: 'Patient Visit',
        type: 'link',
        icontype: 'ni-briefcase-24 text-primary',
        isCollapsed: true,
      },
      
      // {
      //   path: '/settings',
      //   title: 'Settings',
      //   type: 'sub',
      //   icontype: 'fas fa-cog text-primary',
      //   collapse: 'settings',
      //   isCollapsed: true,
      //   children: [
      //     {
      //       path: 'workinghours',
      //       title: 'Working Hours',
      //       type: 'link',
      //     },
      //     {
      //       path: 'daysoff',
      //       title: 'Days Off',
      //       type: 'link',
      //     },
      //     {
      //       path: 'consultaionduration',
      //       title: 'Consultaion Duration',
      //       type: 'link',
      //     },
      //   ],
      // },
    ];
  }
}
