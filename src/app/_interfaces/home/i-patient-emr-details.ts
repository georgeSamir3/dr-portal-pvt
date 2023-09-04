import { IPatient, IPatientDemographicInformation } from "./i-patient";

export interface IPatientEmrDetails {
  demographicInformation: IDemographicInformation;
  recentMedicalTests: IRecentMedicalTest[];
  recentMedications: {
    patientMedications: IPatientMedication[];
    prescribedMedications: IPrescribedMedication[];
    uploadedPrescriptions: IBaseMedication[];
  };
  recentHospitalProcedures: {
    prescribedHospitalProcedures: IRecentHospitalProcedure[];
  };

  recentVitals: IRecentPatientVitals[]

}

export interface IDemographicInformation extends IPatientDemographicInformation { }

interface IRecentMedicalTest {
  Id: number;
  CreationDate: Date;
  ChannelId: number;
  CenterName: string;
  TestsNumber: number;
  TestNames: string;
}

interface IPatientMedication {
  IsChronic: boolean;
  MedicationName: string;
  CreationDate: Date;
  ChannelId: number;
}

interface IPrescribedMedication {
  doctorName: string;
  specialty: string;
  creationDate: string;
  channelId: number;
}

interface IBaseMedication {
  creationDate: string;
  channelId: number;
}

interface IRecentHospitalProcedure {
  id: number;
  creationDate: Date;
  channelId: number;
  status: string;
  centerName: string;
}

interface IRecentPatientVitals {
  creationDate: Date;
  bloodType: string;
  bloodPressure?: string;
  heartRate?: number;
}
