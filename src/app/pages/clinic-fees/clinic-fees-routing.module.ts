import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClinicFeesComponent } from './clinic-fees/clinic-fees.component';

const routes: Routes = [
  {
    path: '',
    component: ClinicFeesComponent,
    pathMatch: 'full',
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClinicFeesRoutingModule {}
