import { NgModule, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPatientVisitComponent } from './add-patient-visit/add-patient-visit.component';
import { AddPatientVisitRoutingModule } from './add-patient-visit-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AddVisitComponent } from './add-visit/add-visit.component';
@NgModule({
  declarations: [
    AddPatientVisitComponent,
    AddVisitComponent
  ],
  imports: [
    CommonModule,
    AddPatientVisitRoutingModule,
    SharedModule
  ]
})
export class AddPatientVisitModule{ 
  
}
