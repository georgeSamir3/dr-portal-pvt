import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PatientListComponent } from "./patient-List/patient-List.component";


const routes: Routes = [

{
    path: 'patientList',
    component: PatientListComponent,
}
];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class PatientListRoutingModule { }
export const PatientListModuleRoutingComponents = [
PatientListComponent
];
