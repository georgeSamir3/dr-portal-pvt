import { IDiagnose } from '@interfaces/home/i-disgnose';

export interface IDoctorMedication {
  channelId: number;
  creationDate: string;
  diagnoses: IDiagnose[];
  medicines: IMedicine[];
  doctorName: string;
  medicationsCount: number;
  specialty: string;
}

interface IMedicine {
  id: number;
  name: string;
  timesNumber: number;
  repeatingNumber: string;
  period: number;
  periodType: string;
  drugTime: string;
  isChronic: boolean;
}
