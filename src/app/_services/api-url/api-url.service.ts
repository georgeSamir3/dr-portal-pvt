import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {

  // Portal APIs:-

  // Login Page
  loginUrl: string = 'api/PortalDoctors/Login';
  forgetPasswordUrl: string = 'api/PortalDoctors/ForgetPassword';
  verifyForgetPasswordOtpUrl: string = 'api/PortalDoctors/VerifyForgetPasswordOtp';
  resetForgottenPasswordUrl: string = 'api/PortalDoctors/ResetForgottenPassword';
  refreshTokenUrl: string = 'api/PortalDoctors/RefreshToken';

  // Home Page
  checkUserLoginUrl: string = 'api/PortalTests/GetTests/2';
  connectToPatientUrl: string = 'api/PortalDoctors/ConnectToPatient';
  connectToConvoyPatientUrl: string = 'api/PortalConvoyDoctors/ConnectToConvoyPatient';
  requestViewEMRUrl: string = 'api/EMR/RequestViewEMR';
  verifyViewEMROTPUrl: string = 'api/EMR/VerifyViewEMROTP';

  // E-Prescription Page
  getAllDiagnosesUrl: string = 'api/PatientDiagnoses/GetAllDiagnoses';
  getAllMedicationsUrl: string = 'api/Medications/GetAllMedications';
  getTestsUrl: string = 'api/PortalTests/GetTests';
  addPrescriptionUrl: string = 'api/PortalPrescriptions/V2/AddPrescription';
  getTopMedicationsByDoctorIdUrl: string = 'api/Medications/GetTopMedicationsByDoctorId';

  // EMR Details Page
  getPatientEmrDetailsUrl: string = 'api/emr/GetPatientEmrDetails';

  // EMR Medical Tests Page
  getPatientTestRequestsUrl: string = 'api/PortalTestRequests/GetPatientTestRequests';

  // Medical Test Details Page
  getTestRequestDetailsUrl: string = 'api/PortalTestRequests/GetTestRequestDetails';

  // EMR Medications Page
  getPatientEhrPrescriptionsUrl: string = 'api/PortalEhr/GetPatientEhrPrescriptions';

  // EMR Hospital Procedure Page
  getPatientEhrHospitalProceduresUrl: string = 'api/PortalEhr/GetPatientHospitalProcedures';

  // EMR Hospital Procedure Details Page
  getPatientEhrHospitalprocedureFilesUrl: string = 'api/PortalEhr/GetPatientEhrUploadedFiles';

  // EMR Prescription Details Page
  getPatientEhrPrescriptionDetailsUrl: string = 'api/PortalEhr/GetPatientEhrPrescriptionDetails';
  getPatientEhrPrescriptionFilesUrl: string = 'api/PortalEhr/GetPatientEhrUploadedFiles';
  getPatientEhrDetailsUrl: string = 'api/PortalEhr/GetPatientEhrTransactions';

  getPatientRecentMedicalTestsUrl: string = 'api/PortalEhrMedicalTests/GetAllPatientRecentMedicalTests';
  getPatientCompletedMedicalTestsUrl: string = 'api/PortalEhrMedicalTests/GetAllPatientCompletedMedicalTests';

  getMedicalTestDetailsUrl: string = 'api/PortalEhrTestRequests/GetTestRequestDetails';
  getMedicalTestFileDetailsUrl: string = 'api/PortalEhrTestResultsFiles/GetMedicalTestResultFilesByAdminByEhrTransactionId';

  getPatientAllVitalsDataUrl:string = 'api/PortalEhr/GetPatientVitlas';
  //Top Used Medical Services
  getTopUsedMedicalServiceUrl: string = 'api/PortalMedicalServices/GetTopUsedMedicalServicesByDoctorId';
  constructor() { }

  //GetAppVersion
  getAppVersionUrl: string = 'api/AppsVersions/PatientAppVersions';

  getDrugIndexBySearchUrl: string = 'api/DrugIndexes/Search';
  getTestsBySearchUrl: string = 'api/PortalTests/Search';
  getDiagnosesBySearchUrl: string = 'api/PatientDiagnoses/Search';

}
