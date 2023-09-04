import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlService } from '@services/api-url/api-url.service';
import { IResponse } from '@interfaces/i-response';
import { IEmrMedicalTests } from '@interfaces/home/i-emr-medical-tests';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { ITestRequestDetails } from '@interfaces/home/i-test-request-details';
import { IMedicalTestDetails, IMedicalTestFilesDetailsDTO } from '@interfaces/Emr/i-medical-tests-details';
import { GenericResponse } from '@interfaces/Generic/i-response';

@Injectable({
  providedIn: 'root',
})
export class EmrMedicalTestsService {
  constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {}

  getPatientTestRequests(patientId): Observable<IResponse<IEmrMedicalTests>> {
    let params = new HttpParams().set('patientId', patientId);

    return this.http.get<IResponse<IEmrMedicalTests>>(
      this.apiUrlService.getPatientTestRequestsUrl,
      { params: params }
    );
  }

  getTestRequestDetails(testId): Observable<IResponse<ITestRequestDetails>> {
    let params = new HttpParams().set('id', testId);

    return this.http.get<IResponse<ITestRequestDetails>>(
      this.apiUrlService.getTestRequestDetailsUrl,
      {
        params: params,
      }
    );
  }

  containerClient(containerName: string): ContainerClient {
    return new BlobServiceClient(
      `https://limitlesscarestorage.blob.core.windows.net`
    ).getContainerClient(containerName);
  }

  downloadFile(name: string, handler: (blob: Blob) => void) {
    let urlSplitted = name.split('/');

    let blocClient = urlSplitted.splice(4).join('/');

    const blobClient = this.containerClient(urlSplitted[3]).getBlobClient(
      blocClient
    );

    blobClient.download().then((response) => {
      response.blobBody.then((blob) => {
        handler(blob);
      });
    });
  }

  getPatientRecentMedicalTests(patientId, currentPage, pageSize): Observable<any> {
    let params = new HttpParams().set('patientId', patientId)
      .set('currentPage', currentPage)
      .set('pageSize', pageSize);

    return this.http.get(this.apiUrlService.getPatientRecentMedicalTestsUrl, {
      params: params,
    });
  }

  getPatientCompletedMedicalTests(patientId, currentPage, pageSize): Observable<any> {
    let params = new HttpParams().set('patientId', patientId)
      .set('currentPage', currentPage)
      .set('pageSize', pageSize);

    return this.http.get(this.apiUrlService.getPatientCompletedMedicalTestsUrl, {
      params: params,
    });
  }

  getMedicalTestDetails(medicalTestId):Observable<GenericResponse<IMedicalTestDetails>>{
    return this.http.get<GenericResponse<IMedicalTestDetails>>(this.apiUrlService.getMedicalTestDetailsUrl+`/${medicalTestId}`);
  }

  getMedicalTestFiles(medicalTestId):Observable<GenericResponse<IMedicalTestFilesDetailsDTO>>{
    let params = new HttpParams()
      .set('ehrTransactionId', medicalTestId)
    return this.http.get<GenericResponse<IMedicalTestFilesDetailsDTO>>(this.apiUrlService.getMedicalTestFileDetailsUrl, {params: params});
  }

  downloadTestFile(fileUrl): Observable<Blob> {
    return this.http.get(fileUrl, {
      responseType: 'blob',
    });
  }
}
