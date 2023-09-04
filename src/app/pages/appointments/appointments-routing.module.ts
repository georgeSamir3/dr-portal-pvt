import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentsCalendarComponent } from './appointments-calendar/appointments-calendar.component';
import { DaysOffComponent } from './appointments-settings/days-off/days-off/days-off.component';

const routes: Routes = [
  {
    path: 'appointments',
    component: AppointmentsCalendarComponent,
  },
  {
    path: 'daysoff',
    component: DaysOffComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule { }

export const AppointmentsModuleRoutingComponents = [
  AppointmentsCalendarComponent
];
