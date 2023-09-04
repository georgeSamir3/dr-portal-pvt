export interface IMedicine {
  id: number;
  name: string;
  genericName: string;
  [key: string]: any;
  rxnavGenericName?: string;
}

export interface ISelectedMedicineDTO {
  medicine: IMedicine,
  isChronic: boolean,
  frequency: number,
  frequencyDuration: string,
  period: number,
  PeriodDuration: string,
  direction: string,
  dosage: number
}
export interface IMedicineDropDown {
  id: number;
  name: string;
  genericName: string;
}
