export interface RXHeaderInfo {
  date: Date;
}

export interface RXPatientInfo {
  patientName: string;
  patientId: number | string;
  prescriptionId: number | string;
  memberId: string;
}

export interface RXDiagnoses {
  id: number;
  name: string;
}

export interface RXData  {
  id: number;
  name: string;
}

export interface RXDoctorInfo {
  doctorName
}

export interface RXFooterInfo {
  printSectionTitle: string;
  printSectionSrc: string;
}
