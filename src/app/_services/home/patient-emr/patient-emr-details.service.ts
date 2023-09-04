import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlService } from '@services/api-url/api-url.service';
import { IResponse } from '@interfaces/i-response';
import { IPatientEmrDetails } from '@interfaces/home/i-patient-emr-details';


@Injectable({
  providedIn: 'root',
})
export class PatientEmrDetailsService {
  constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {}

  getPatientEhrDetails(patientId): Observable<IResponse<IPatientEmrDetails>> {
    let params = new HttpParams().set('patientId', patientId);

    return this.http.get<IResponse<IPatientEmrDetails>>(
      this.apiUrlService.getPatientEhrDetailsUrl,
      { params: params }
    );
  }
  getPatientEhrHospitalProcedures(patientId, creatorTypeId, currentPage, pageSize): Observable<any> {
    let params = new HttpParams()
      .set('patientId', patientId)
      .set('creatorTypeId', creatorTypeId)
      .set('currentPage', currentPage)
      .set('pageSize', pageSize);

    return this.http.get(this.apiUrlService.getPatientEhrHospitalProceduresUrl, { params: params });
  }

  getPatientEhrHospitalprocedureFiles(hospitalProcedureId, patientId): Observable<any> {
    let params = new HttpParams()
      .set('ehrTransactionId', hospitalProcedureId)
      .set('patientId', patientId);

    return this.http.get(this.apiUrlService.getPatientEhrHospitalprocedureFilesUrl, {
      params: params,
    });
  }

  downloadFile(fileUrl): Observable<Blob> {
    return this.http.get(fileUrl, {
      responseType: 'blob',
    });
  }

  getPatientAllVitals(patientId, currentPage, pageSize):Observable<any>{
    let params = new HttpParams()
    .set ('patientId', patientId)
    .set ('currentPage', currentPage)
    .set ('pageSize', pageSize);

    return this.http.get (this.apiUrlService.getPatientAllVitalsDataUrl, {params: params});
  }
}
