import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs';
import { GenericResponse } from '@interfaces/Generic/i-response';
import { IVisits } from '@interfaces/visits/visits';

@Injectable({
  providedIn: 'root'
})
export class AddVisitService {
addVisitApi="http://arwa213621-001-site1.atempurl.com/api/Visits/AddVisit"
  constructor(private http:HttpClient) { }
  
  addVisit(body:{
    DoctorId: number;
    PatientId: number;
    VisitTypeId: number;
    Date: string;
    IsPatientInsured: boolean;
    MoneyRecieved: number;
    PatientFullName: string;
    PatientPhone: string;
  }):Observable<GenericResponse <IVisits>>{
    return this.http.post<GenericResponse <IVisits>>(this.addVisitApi,body);
  }
}