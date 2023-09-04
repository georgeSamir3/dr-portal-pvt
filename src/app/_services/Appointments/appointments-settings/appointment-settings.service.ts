import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAppointmentsSettings, IConsulationDuration, IDaysOffSettings, IWorkingHoursSettings } from '@interfaces/Appointments/appointments-settings/i-appointments-settings';
import { IWorkingHours } from '@interfaces/Appointments/i-appointments-inRange';
import { GenericResponse } from '@interfaces/Generic/i-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentSettingsService {
  addDayOffUrl = 'api/PortalDaysOff/AddDayOff'
  changeConsultaionDurationUrl = 'api/PortalDoctors/ChangePhysicalConsultationDuration'
  addWorkingHoursUrl='api/PortalWorkingHours/AddWorkingHours'

constructor(private http: HttpClient) { }

  addDayOff(addDaysbody:{dayOfWeek:number}): Observable<GenericResponse<IDaysOffSettings>> {
    return this.http.post<GenericResponse<IDaysOffSettings>>(this.addDayOffUrl, addDaysbody);
  }

  changeConsultaionDuration(changeConsultbody:{physicalConsultationDuration:number}): Observable<GenericResponse<IConsulationDuration>>{
    return this.http.post<GenericResponse<IConsulationDuration>>(this.changeConsultaionDurationUrl, changeConsultbody);
  }

  addWorkingHours(addWorkingHoursbody:{dayOfWeek:number,startTime:string,endTime:string}): Observable<GenericResponse<IWorkingHours>>{
    return this.http.post<GenericResponse<IWorkingHours>>(this.addWorkingHoursUrl, addWorkingHoursbody);
  }

}
