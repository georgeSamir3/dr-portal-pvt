export interface IEhrPrescriptionDetails {
  prescriptionSummary: IPrescriptionSummary;
  prescribedMedicines: IPrescribedMedicine[];
  labTests: ILabSection[];
  radiology: ILabSection[];
  physioTherapy: ILabSection[];
  additionalNotes: string;
}

interface IPrescriptionSummary {
  creationDate: string;
  doctorName: string;
  sourceType: number;
  diagnoses: string[];
}

interface IPrescribedMedicine {
  id: number;
  name: string;
  isChronic: true;
  frequency: number;
  frequencyType: string;
  unit: string;
  drugTime: string;
  period: number;
  periodType: string;
  dosage: number;
}

interface ILabSection {
  id: number;
  name: string;
}
