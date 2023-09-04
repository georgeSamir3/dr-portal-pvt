import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrugDrugInteractionComponent } from './drug-drug-interaction.component';
import { SharedModule } from '@shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: '', component: DrugDrugInteractionComponent  }
]
@NgModule({
  imports: [
    SharedModule, RouterModule.forChild(routes)
  ],
  declarations: [DrugDrugInteractionComponent]
})
export class DrugDrugInteractionModule { }
