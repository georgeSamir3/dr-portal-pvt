import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlService } from '@services/api-url/api-url.service';
import { IResponse } from '@interfaces/i-response';
import { IPatientMedication } from '@interfaces/home/i-patient-medication';
import { IDoctorMedication } from '@interfaces/home/i-doctor-medication';
import { ContainerClient, BlobServiceClient } from '@azure/storage-blob';

@Injectable({
  providedIn: 'root',
})
export class EmrMedicationsService {
  constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {}

  getPatientEhrPrescriptions(patientId, creatorTypeId, currentPage, pageSize): Observable<any> {
    let params = new HttpParams()
      .set('patientId', patientId)
      .set('creatorTypeId', creatorTypeId)
      .set('currentPage', currentPage)
      .set('pageSize', pageSize);

    return this.http.get(this.apiUrlService.getPatientEhrPrescriptionsUrl, { params: params });
  }

  getPatientEhrPrescriptionDetails(prescriptionId, patientId): Observable<any> {
    let params = new HttpParams()
      .set('ehrTransactionId', prescriptionId)
      .set('patientId', patientId);

    return this.http.get(this.apiUrlService.getPatientEhrPrescriptionDetailsUrl, {
      params: params,
    });
  }

  getPatientEhrPrescriptionFiles(prescriptionId, patientId): Observable<any> {
    let params = new HttpParams()
      .set('ehrTransactionId', prescriptionId)
      .set('patientId', patientId);

    return this.http.get(this.apiUrlService.getPatientEhrPrescriptionFilesUrl, {
      params: params,
    });
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
}
