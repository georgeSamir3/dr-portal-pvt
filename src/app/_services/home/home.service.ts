import { IRadiology } from '@interfaces/home/i-radiology';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlService } from '@services/api-url/api-url.service';
import { IResponse } from '@interfaces/i-response';
import { IDiagnose } from '@interfaces/home/i-disgnose';
import { IPatient } from '@interfaces/home/i-patient';
import { IDemographicInformation } from '@interfaces/home/i-patient-emr-details';


@Injectable({
  providedIn: 'root',
})
export class HomeService {
  public patientData:IPatient
  public patientDemographicData: IDemographicInformation
  constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {}

  checkUserLogin(): Observable<IResponse<IRadiology[]>> {
    return this.http.get<IResponse<IRadiology[]>>(
      this.apiUrlService.checkUserLoginUrl
    );
  }

  connectToPatient(body): Observable<IResponse<IPatient>> {
    return this.http.post<IResponse<{ patientId: number }>>(
      this.apiUrlService.connectToPatientUrl,
      body
    );
  }

  connectToConvoyPatient(body: { patientConvoyId: string }): Observable<IResponse<IPatient>> {
    return this.http.post<IResponse<{ patientId: number }>>(
      this.apiUrlService.connectToConvoyPatientUrl,
      body
    );
  }

  requestViewEMR(body): Observable<IResponse<{ flag: boolean }>> {
    return this.http.post<IResponse<{ flag: boolean }>>(
      this.apiUrlService.requestViewEMRUrl,
      body
    );
  }

  verifyViewEMROTP(body): Observable<IResponse<{ patientId: number }>> {
    return this.http.post<IResponse<{ patientId: number }>>(
      this.apiUrlService.verifyViewEMROTPUrl,
      body
    );
  }
}
