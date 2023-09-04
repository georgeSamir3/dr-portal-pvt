import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GliptusPmsComponent } from "./gliptus-pms/gliptus-pms.component";


const routes: Routes = [
  {
    path: '',
    component: GliptusPmsComponent,
    pathMatch: 'full'
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GliptusPmsRoutingModule {}
