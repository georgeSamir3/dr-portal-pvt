import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { PatientListRoutingModule } from "./patientList-routing.module";
import { PatientListComponent } from "./patient-List/patient-List.component";

@NgModule({
  declarations: [
    PatientListComponent,
    
  ],
  imports: [CommonModule, SharedModule, PatientListRoutingModule],
  exports: []
})

export class PatientListModule { }

