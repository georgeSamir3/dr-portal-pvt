import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse } from '@interfaces/Generic/i-response';
import { IAppVersionResponse } from '@interfaces/home/i-app-version';
import { ApiUrlService } from '@services/api-url/api-url.service';
import { Observable } from 'rxjs';
import { CreateEPrescriptionService } from '../create-e-prescription/create-e-prescription.service';

@Injectable({
  providedIn: 'root'
})
export class AppVersionsService {
  constructor(private http: HttpClient, private apiUrlService: ApiUrlService, private createEPrescriptionService: CreateEPrescriptionService) { }

  getAppVersions(): Observable<GenericResponse<IAppVersionResponse>> {
    return this.http.get<GenericResponse<IAppVersionResponse>>(this.apiUrlService.getAppVersionUrl);
  }


}
