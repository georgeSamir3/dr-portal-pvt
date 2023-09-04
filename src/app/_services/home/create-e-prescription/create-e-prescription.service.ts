import { IMedicine} from '@interfaces/home/i-medicine';
import { IDiagnose } from '@interfaces/home/i-disgnose';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiUrlService } from '@services/api-url/api-url.service';
import { IResponse } from '@interfaces/i-response';
import { ILabTest } from '@interfaces/home/i-lab-test';
import { TestType } from '@enums/home/test-type.enum';
import { IRadiology } from '@interfaces/home/i-radiology';
import { IPhysiotherapy } from '@interfaces/home/i-physiotherapy';
import { IPatient } from '@interfaces/home/i-patient';
import { IHospital } from '@interfaces/home/iHospital';

@Injectable({
  providedIn: 'root',
})
export class CreateEPrescriptionService {
  constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {}

  get testType() {
    return TestType;
  }

  areDiagnosesLoading = new BehaviorSubject<boolean>(false);
  areDiagnosesLoading$ = this.areDiagnosesLoading.asObservable();

  // getAllDiagnoses(): Observable<IResponse<IDiagnose[]>> {
  //   return this.http.get<IResponse<IDiagnose[]>>(
  //     this.apiUrlService.getAllDiagnosesUrl
  //   );
  // }

  getAllMedications(): Observable<IResponse<IMedicine[]>> {
    return this.http.get<IResponse<IMedicine[]>>(
      this.apiUrlService.getAllMedicationsUrl
    );
  }

  getDiagnosesBySearch(key : string): Observable<IResponse<IDiagnose[]>> {
    let params = new HttpParams()
    .set('key', key);
    return this.http.get<IResponse<IDiagnose[]>>(
      this.apiUrlService.getDiagnosesBySearchUrl,{ params:params}
     
    );
  }

  getDrugIndexBySearch(key : string): Observable<IResponse<IMedicine[]>> {
    let params = new HttpParams()
    .set('key', key);
    return this.http.get<IResponse<IMedicine[]>>(
      this.apiUrlService.getDrugIndexBySearchUrl,{ params:params}
     
    );
  }

  getLabTestsBySearch(key : string): Observable<IResponse<ILabTest[]>> {
    let params = new HttpParams()
    .set('key', key);
    return this.http.get<IResponse<ILabTest[]>>(
      `${this.apiUrlService.getTestsBySearchUrl}/${this.testType.Lab}`,{ params:params}
     
    );
  }

  getRadiologyTestsBySearch(key : string): Observable<IResponse<IRadiology[]>> {
    let params = new HttpParams()
    .set('key', key);
    return this.http.get<IResponse<IRadiology[]>>(
      `${this.apiUrlService.getTestsBySearchUrl}/${this.testType.Scan}`,{ params:params}
     
    );
  }

  getPhysiotherapiesBySearch(key : string): Observable<IResponse<IPhysiotherapy[]>> {
    let params = new HttpParams()
    .set('key', key);
    return this.http.get<IResponse<IRadiology[]>>(
      `${this.apiUrlService.getTestsBySearchUrl}/${this.testType.Physiotherapy}`,{ params:params}
     
    );
  }

  getHospitalsBySearch(key : string): Observable<IResponse<IHospital[]>> {
    let params = new HttpParams()
    .set('key', key);
    return this.http.get<IResponse<IRadiology[]>>(
      `${this.apiUrlService.getTestsBySearchUrl}/${this.testType.Hospital}`,{ params:params}
     
    );
  }
  
//old should remove
  getLabTests(): Observable<IResponse<ILabTest[]>> {
    return this.http.get<IResponse<ILabTest[]>>(
      `${this.apiUrlService.getTestsUrl}/${this.testType.Lab}`
    );
  }
//old should remove
  getRadiology(): Observable<IResponse<IRadiology[]>> {
    return this.http.get<IResponse<IRadiology[]>>(
      `${this.apiUrlService.getTestsUrl}/${this.testType.Scan}`
    );
  }
//old should remove
  getPhysiotherapy(): Observable<IResponse<IPhysiotherapy>> {
    return this.http.get<IResponse<IPhysiotherapy>>(
      `${this.apiUrlService.getTestsUrl}/${this.testType.Physiotherapy}`
    );
  }
  //old should remove
  getHospitals(): Observable<IResponse<IHospital>> {
    return this.http.get<IResponse<IHospital>>(
      `${this.apiUrlService.getTestsUrl}/${this.testType.Hospital}`
    );
  }

  addPrescription(body): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(
      this.apiUrlService.addPrescriptionUrl,
      body
    );
  }

  getPatientById(patientId): Observable<IResponse<IPatient>>{
    return this.http.get<IResponse<IPatient>>(
      `${this.apiUrlService}/${this.apiUrlService}`, {
        params: { patientId: patientId.toString()}
      }
    )
  }

  getAreDiagnosesLoading(): Observable<boolean>{
    return this.areDiagnosesLoading$;
  }

  setAreDiagnosesLoading(val: boolean){
    this.areDiagnosesLoading.next(val);
  }
}
