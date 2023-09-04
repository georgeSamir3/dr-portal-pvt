export interface PatientData {
  initialData?: {
    fullName?: string;
    phone?: string;
    nationalID?: string;
    dateOfBirth?: string;
    gender?: string;
    isPregnant?: number;
    height?: number;
    // bmi?: number;
    // isSmoker?: number;
    // isHealthyEatingHabits?: number;
    isActiveLifeStyle?: number;
    dateOfDiagnosis?: string;
    familyHistoryOfDiabetes?: number;
    hasChronicIllnesses?: number;
    chronicIllnessesSpecification?: string;
    lipidTests?: {
      isDone: number;
      cholesterol: number;
      hDL: number;
      lDL: number;
      triglycerides: number;
    };
    kidneyTests?: {
      isDone: number;
      eGFR: number;
      bloodUreaNitrogen: number;
      serumCreatinine: number;
    };
  };
  visitData?: VisitData
}

export interface VisitData {
  visitNumber: number;
  visitDate: string;
  // weight?: number;
  bloodPressure: string;
  // bodyTemperature?: number;
  // heartRate?: number;
  hasDiabetesRelatedComplications: number;
  diabetesRelatedComplicationsSpecification: string;
  hasHospitalizedDiabetesComplications: number;
  hospitalizedDiabetesComplicationsSpecification: string;
  laboratoryTestsResultsDate: string;
  bloodGlucoseTests: {
    hbAC: number;
    fpg: number;
    ppg: number;
  };
  isMedicationsChanged?: number;
  reasonOfChanging?: string;
  medications?: {
    type: number;
    name: string;
    dose: string;
    frequency: string;
    startDate: string;
    endDate?: string;
    onGoing?: number;
  }[];
  // takeConcomitantMedications: number;
  // concomitantMedicationsSpecification: string;
  experiencedAdverseEvents?: number;
  experiencedAdverseEventsSpecification?: string;
  experiencedSymptomaticHypoglycemicEvents?: number;
  experiencedSymptomaticHypoglycemicEventsSpecification?: {
    date: string;
    duration: string;
    bloodGlucoseLevel: number;
    requiredExternalAssistance: number;
    requiredVisitToEmergencyDepartment: number;
    wasWithLossOfConsciousness: number;
    wasWithSeizure: number;
    possibleCauses: string[];
  };
}

export interface VisitsCount {
  firstVisits: number;
  secondVisits: number;
  thirdVisits: number;
}

export interface IGliptusPatientList {
  items : IItems [];
  pagination : IPagination;
}

export interface IItems {
  patientId : number,
  fullName : string,
  phone : string,
  visitNumber: number
}

export interface IPagination {
  currentPage : number,
  totalPages : number,
  totalItems : number
}
