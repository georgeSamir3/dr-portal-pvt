import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentsCalendarComponent } from './appointments-calendar/appointments-calendar.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarHeaderComponent } from './calendar-utils/calendar-header/calendar-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DateTimePickerComponent } from './calendar-utils/date-time-picker/date-time-picker.component';
import { DaysOffComponent } from './appointments-settings/days-off/days-off/days-off.component';
import { ConsultaionDurationModalComponent } from './appointments-settings/consultation-duration/consultaion-Duration-modal/consultaion-Duration-modal.component';
import { WorkingHoursModalComponent } from './appointments-settings/working-hours/working-hours-modal/working-hours-modal.component';
import { ReserveAppointmentModalComponent } from './reserve-appointment-modal/reserve-appointment-modal.component';


@NgModule({
  declarations: [
    AppointmentsCalendarComponent,
    CalendarHeaderComponent,
    DateTimePickerComponent,
    DaysOffComponent,
    ConsultaionDurationModalComponent,
    WorkingHoursModalComponent,
    ReserveAppointmentModalComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgbModalModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    AppointmentsRoutingModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),


  ],
  exports: [
    CalendarHeaderComponent,
    DateTimePickerComponent
  ]
})
export class AppointmentsModule { }
