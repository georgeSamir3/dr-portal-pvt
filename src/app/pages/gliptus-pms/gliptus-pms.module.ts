import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { GliptusPmsRoutingModule } from "./gliptus-pms-routing.module";
import { GliptusPmsComponent } from "./gliptus-pms/gliptus-pms.component";
import { GliptusPatientListComponent } from "./gliptus-patientList/gliptus-patientList.component";

@NgModule({
  declarations: [
    GliptusPmsComponent,
    GliptusPatientListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GliptusPmsRoutingModule,
  ]
})
export class GliptusPmsModule {}
