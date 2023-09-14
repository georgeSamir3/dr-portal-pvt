import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPatientVisitComponent } from './add-patient-visit/add-patient-visit.component';
import { AddVisitComponent } from './add-visit/add-visit.component';
import { LastVisitDetailsComponent } from './last-visit-details/last-visit-details.component';
const routes: Routes = [
  {
    path: '',
    component: AddPatientVisitComponent,
    pathMatch: 'full',
  },
  { path: 'addvisit/:fullName', component: AddVisitComponent },
  { path: 'lastvisit/:patientId', component: LastVisitDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddPatientVisitRoutingModule {}
