import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs';
import { IAppointmentsInRange, IDeleteAppointments, IPatientDetails, ISearchPatient } from '@interfaces/Appointments/i-appointments-inRange';
import { GenericResponse } from '@interfaces/Generic/i-response';
import { IAddNewPatientAndReserveRequest, IReserveAppointments } from '@interfaces/Appointments/i-reserve-appointments';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsInRangeService {
  getAppointmentsInRangeUrl='api/PortalPhysicalAppointments/GetDoctorPhysicalAppointmentsDataInRange?';
  reserveAppointmentsUrl='api/PortalPhysicalAppointments/ReservePhysicalAppointment';
  deleteAppointmentUrl='api/PortalPhysicalAppointments/DeletePhysicalAppointment';
  searchPatientUrl='api/PortalPatients/SearchForPatient';
  GetPatientDetailsUrl='api/PortalPatients/GetPatientDetails';
  addNewPatientAndReserveUrl: string='api/PortalPhysicalAppointments/AddNewPatientAndReserve';

  constructor(private http: HttpClient) { }

  getAppointmentsInRange(StartDateTime, EndDateTime): Observable<GenericResponse<IAppointmentsInRange>> {
    let params = new HttpParams()
      .set('StartDateTime', StartDateTime)
      .set('EndDateTime', EndDateTime)

    return this.http.get<GenericResponse<IAppointmentsInRange>>(this.getAppointmentsInRangeUrl, { params: params });
  }

  reserveAppointment(body:{
      patientId:number,
      startDateTime:string
    }): Observable<GenericResponse<IReserveAppointments>> {

    return this.http.post<GenericResponse<IReserveAppointments>>(this.reserveAppointmentsUrl, body);
  }

  deleteAppointment(PhysicalAppointmentId): Observable<GenericResponse<IDeleteAppointments>>{
    return this.http.delete<GenericResponse<IDeleteAppointments>>(`${this.deleteAppointmentUrl}/${PhysicalAppointmentId}`)
  }

  SearchForPatient(phone:string):Observable<GenericResponse<ISearchPatient>> {
    let params = new HttpParams().set('phone',phone);
    return this.http.get<GenericResponse<ISearchPatient>>(this.searchPatientUrl,{params});
  }

  getPatientDetails(patientId:number){
    return this.http.get<GenericResponse<IPatientDetails>>(`${this.GetPatientDetailsUrl}/${patientId}`);
  }

  addNewPatientAndReserve(body: IAddNewPatientAndReserveRequest): Observable<GenericResponse<IReserveAppointments>>{
    return this.http.post<GenericResponse<IReserveAppointments>>(this.addNewPatientAndReserveUrl, body);
  }
}
