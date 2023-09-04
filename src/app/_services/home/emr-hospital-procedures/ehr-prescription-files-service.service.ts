import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAttachmentsFilesDTO } from 'src/app/_interfaces/Emr/i-medical-tests-details';
import { GenericResponse, SuccessResponse } from 'src/app/_models/home/response.model';

@Injectable({
  providedIn: 'root'
})
export class EhrPrescriptionFilesServiceService {

  constructor(private http: HttpClient) { }

  addEhrPrescriptionFilesByAdminUrl: string = 'api/AdminEhrPrescriptionFiles/AddEhrPrescriptionFilesByAdmin';
  deletePrescriptionFilesAddedByAdminUrl: string = 'api/AdminEhrPrescriptionFiles/DeletePrescriptionFilesAddedByAdmin';
  updateEhrPrescriptionFileByAdminUrl: string = 'api/AdminEhrPrescriptionFiles/UpdateEhrPrescriptionFileByAdmin';

  addEhrPrescriptionFilesByAdmin(patientId, testDate, files): Observable<SuccessResponse> {
    const formData = new FormData();
    formData.append('patientId', patientId);
    formData.append('title', testDate);
    files.forEach((file) => { formData.append('files', file); })

    return this.http.post<SuccessResponse>(this.addEhrPrescriptionFilesByAdminUrl, formData);
  }

  deletePrescriptionFilesAddedByAdmin(ehrTransactionId, fileId): Observable<SuccessResponse> {
    return this.http.put<SuccessResponse>(this.deletePrescriptionFilesAddedByAdminUrl, {ehrTransactionId, filePaths:fileId});
  }

  updateEhrPrescriptionFileByAdmin(ehrTransactionId, testDate, files): Observable<GenericResponse<IAttachmentsFilesDTO>> {
    const formData = new FormData();
    formData.append('ehrTransactionId', ehrTransactionId);
    formData.append('title', testDate);
    files.forEach((file) => { formData.append('newfilePaths', file); })

    return this.http.put<GenericResponse<IAttachmentsFilesDTO>>(this.updateEhrPrescriptionFileByAdminUrl, formData);
  }
}
