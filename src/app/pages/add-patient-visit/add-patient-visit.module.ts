import { NgModule, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPatientVisitComponent } from './add-patient-visit/add-patient-visit.component';
import { AddPatientVisitRoutingModule } from './add-patient-visit-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AddVisitComponent } from './add-visit/add-visit.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    AddPatientVisitComponent,
    AddVisitComponent
  ],
  imports: [
    CommonModule,
    AddPatientVisitRoutingModule,
    SharedModule,
    FormsModule,
    DropdownModule,
    CalendarModule
  ]
})
export class AddPatientVisitModule{ 
  
}
