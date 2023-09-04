export interface IEmrPrescription {
  id: number;
  creationDate: Date;
  channelId: number;
  medicationsCount: number;
  title: string;
  notes: string;
  ehrTypeIds?: number[];
  uploadedPrescriptionTypeId: string;
  sourceType: number;
  isClickable: boolean;
}
