import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import {
  homeModuleRoutingComponents,
  HomeRoutingModule,
} from './home-routing.module';
import { TopMedicinesComponent } from '@pages/home/components/top-medicines/top-medicines.component';
import { PrintHeadersComponent } from '../../components/print-headers/print-headers.component';
import { PrintSectionComponent } from './components/print-section/print-section.component';
import { DrugsInteractionModalComponent } from './components/drugs-interaction-modal/drugs-interaction-modal.component';
import { VitalsDataComponent } from './vitals-data/vitals-data.component';

@NgModule({
  declarations: [
    homeModuleRoutingComponents,
    TopMedicinesComponent,
    PrintHeadersComponent,
    PrintSectionComponent,
    DrugsInteractionModalComponent,
    VitalsDataComponent,
  ],
  imports: [CommonModule, SharedModule, HomeRoutingModule],
})
export class HomeModule {}
