export interface ITopServices {
  id: number;
  name: string;
  isChecked: boolean;
}
export interface ITopServicesWithTypes extends ITopServices {
  testTypeId:number;
}
export interface ITopDiagnosesServices extends ITopServices{
  code:string;
}
export interface ITopMedicinesServices extends ITopServices{
  arShape: string,
  [key: string]: any;
  topUsedDosage: {
    frequency: number,
    frequencyDuration: string,
    period: number,
    periodDuration: string,
    direction: string,
    dosage: number,
    [key: string]: any;
  }
}
export interface TopUsedMedicalServices {
    topUsedDiagnoses: ITopDiagnosesServices[],
    topUsedMedications: ITopMedicinesServices[],
    topUsedLabTests: ITopServicesWithTypes[],
    topUsedRadiology: ITopServicesWithTypes[],
    topUsedPhysiotherapy: ITopServicesWithTypes[],
    topUsedHospitalProcedures: ITopServicesWithTypes[],


}
