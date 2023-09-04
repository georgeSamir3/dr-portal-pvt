import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateEPrescriptionComponent } from './components/create-e-prescription/create-e-prescription.component';
import { EmrMedicalTestsComponent } from './components/emr-medical-tests/emr-medical-tests.component';
import { MedicalTestDetailsComponent } from './components/medical-test-details/medical-test-details.component';
import { EmrMedicationsComponent } from './components/emr-medications/emr-medications.component';
import { PatientEmrComponent } from './components/patient-emr/patient-emr.component';
import { HomeComponent } from './home.component';
import { HospitalProceduresComponent } from './components/hospital-procedures/hospital-procedures.component';
import { EmrHospitalprocedureDetailsComponent } from './components/emr-hospitalprocedure-details/emr-hospitalprocedure-details.component';
import { EhrPrescriptionDetailsComponent } from './components/ehr-prescription-details/ehr-prescription-details.component';
import { VitalsDataComponent } from './vitals-data/vitals-data.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'create-e-prescription/:patientId',
    component: CreateEPrescriptionComponent,
  },
  {
    path: 'patient-emr/:patientId',
    component: PatientEmrComponent,
  },
  {
    path: 'patient-emr/:patientId/medical-tests',
    component: EmrMedicalTestsComponent,
  },
  {
    path: 'patient-emr/:patientId/hospital-Procedures',
    component: HospitalProceduresComponent,
  },
  {
    path: 'patient-emr/:patientId/medical-tests-details',
    component: MedicalTestDetailsComponent,
  },
  {
    path: 'patient-emr/:patientId/hospital-Procedures/:prescriptionSourceType/:hospitalProcedureId',
    component: EmrHospitalprocedureDetailsComponent,
  },
  {
    path: 'patient-emr/:patientId/medical-tests/:testId',
    component: MedicalTestDetailsComponent,
  },
  {
    path: 'patient-emr/:patientId/medications',
    component: EmrMedicationsComponent,
  },
  {
    path: 'patient-emr/:patientId/medications/:prescriptionSourceType/:prescriptionId',
    component: EhrPrescriptionDetailsComponent,
  },
  {
    path: 'patient-emr/:patientId/vitals-data',
    component: VitalsDataComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}

export const homeModuleRoutingComponents = [
  HomeComponent,
  CreateEPrescriptionComponent,
  PatientEmrComponent,
  EmrMedicalTestsComponent,
  MedicalTestDetailsComponent,
  EmrMedicationsComponent,
  EhrPrescriptionDetailsComponent,
  HospitalProceduresComponent,
  EmrHospitalprocedureDetailsComponent,
  VitalsDataComponent
];
