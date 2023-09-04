export interface IPatientVitalsData {
    creationDate: Date;
    height?: number;
    weight?: number;
    isSmoker?: boolean;
    isAlcoholic?: boolean;
    heartRate?: number;
    temperature?: number;
    respiratoryRate?: number;
    oxygenSaturation: number;
    bloodPressure?: string;
    bloodType: string;
    emergencyContact: string;
}
