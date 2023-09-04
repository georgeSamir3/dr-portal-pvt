export interface IPatient {
  patient: Patient;
  vital: Vital;
}

export interface Patient {
  patientId: number;
  patientName: string;
  phone: string;
  convoyId: string;
  bloodType: string;
  memberId: string;
}

export interface Vital {
  height: number;
  weight: number;
  isSmoker: boolean;
  isAlcoholic: boolean;
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  bloodPressure: string;
  creationDate: Date;
  emergencyContact: string;
}

export interface IPatientDemographicInformation {
  fullName: string;
  nationalId: string;
  phone: string;
  convoyId: string;
  birthdate: Date;
  gender: string;
  isInsured: boolean;
  companyEmployeeId: string;
  limitlessCareCardId: string;
}
