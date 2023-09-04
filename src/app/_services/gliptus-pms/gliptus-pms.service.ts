import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponse } from '@interfaces/i-response';
import { IGliptusPatientList, PatientData, VisitsCount } from '@models/gliptus-pms/gliptus-pms';
import { GenericResponse, SuccessResponse } from '@models/home/response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GliptusPmsService {

  constructor(private http: HttpClient) { }

  getPatientGliptusData(phone: string): Observable<IResponse<PatientData>> {
    const url = `api/PortalGliptusPatients/GetPatientGliptus?phone=${phone}`;
    return this.http.get<IResponse<PatientData>>(url);
  }

  addPatientGliptus(patientData: PatientData): Observable<SuccessResponse> {
    const url = 'api/PortalGliptusPatients/AddPatientGliptus';
    return this.http.post<SuccessResponse>(url, patientData)
  }

  getVisitsCount() {
    const url = '/api/PortalGliptusPatients/GetVisitsCount';
    return this.http.get<IResponse<VisitsCount>>(url)
  }

  getGliptusPatientList(currentPage: number, pageSize: number): Observable<GenericResponse<IGliptusPatientList>> {
    const url = '/api/PortalGliptusPatients/GetAllGliptusPatients';
    let params = new HttpParams()
    .set('pageSize', pageSize.toString())
    .set('currentPage', currentPage.toString())
    return this.http.get<GenericResponse<IGliptusPatientList>>(url, {params})
  }

}
