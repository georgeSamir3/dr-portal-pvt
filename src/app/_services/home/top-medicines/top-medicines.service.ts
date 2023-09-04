import { IResponse } from '@interfaces/i-response';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrlService } from '@services/api-url/api-url.service';
import { IMedicine } from '@interfaces/home/i-medicine';
import { TopUsedMedicalServices } from '@interfaces/home/TopUsedMedicalServices';

@Injectable({
  providedIn: 'root',
})
export class TopMedicinesService {
  constructor(
    private httpClient: HttpClient,
    private apiUrlService: ApiUrlService
  ) {}

  getTopMedications(): Observable<IResponse<TopUsedMedicalServices[]>> {
    return this.httpClient.get<IResponse<TopUsedMedicalServices>>(
      this.apiUrlService.getTopUsedMedicalServiceUrl
    );
  }




}
