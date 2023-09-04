import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlService } from '@services/api-url/api-url.service';
import { IResponse } from '@interfaces/i-response';
import { IPatient } from '@interfaces/home/i-patient';
import { GenericResponse } from '@models/home/response.model';
import { IPatientList } from '@interfaces/patientsList/i-patientList';


@Injectable({
  providedIn: 'root',
})
export class PatientsWithDoctorService {
  getAllDoctorPatientsUrl='api/PortalPatients/GetAllDoctorPatients';
  constructor(private http: HttpClient) {}

  getAllDoctorPatients(searchValue: string, currentPage: number, pageSize: number): Observable<GenericResponse<IPatientList>> {
    let params = new HttpParams()
    .set('pageSize', pageSize.toString())
    .set('currentPage', currentPage.toString())

    if(searchValue)
      params = params.set('search', searchValue);
    return this.http.get<GenericResponse<IPatientList>>(
      this.getAllDoctorPatientsUrl, {params});
  }
}
