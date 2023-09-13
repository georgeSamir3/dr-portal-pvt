import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { GenericResponse } from '@interfaces/Generic/i-response';
import { IVisits } from '@interfaces/visits/visits';

@Injectable({
  providedIn: 'root',
})
export class AddVisitService {
  addVisitApi =
    'api/Visits/AddVisit';
  getVisits =
    'api/Visits/RetrieveVisitsHistory';
  LastVisit =
    'api/Visits/RetrieveLatestVisit';
  constructor(private http: HttpClient) {}
 
  addVisit(body: {
    // DoctorId: number;
    PatientId:number,
    VisitTypeId: number;
    Date: Date;
    IsPatientInsured: boolean;
    MoneyRecieved: number;
    PatientFullName: string;
    PatientPhone: string;
  }): Observable<GenericResponse<IVisits>> {
    return this.http.post<GenericResponse<IVisits>>(this.addVisitApi, body);
  }

  getAllVisits(): Observable<GenericResponse<IVisits>> {
    return this.http.get<GenericResponse<IVisits>>(this.getVisits);
  }
  getLastVisit(): Observable<GenericResponse<IVisits>> {
    return this.http.get<GenericResponse<IVisits>>(this.LastVisit);
  }
}
