import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@guards/auth/auth.guard';
import { AuthLayoutComponent } from '@layout/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from '@layout/admin-layout/admin-layout.component';
import { AboutComponent } from './pages/about/about.component';
import { PageNotFoundComponent } from '@components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'auth',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@layout/auth-layout/auth-layout.module').then(
            (m) => m.AuthLayoutModule
          ),
      },
    ],
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@pages/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: '',
        loadChildren: () =>
          import('@pages/patientList/patientList.module').then((m) => m.PatientListModule),
      },
      {
        path: '',
        loadChildren: () =>
          import('@pages/appointments/appointments.module').then((m) => m.AppointmentsModule),
      },
      {
        path: 'gliptus-pms',
        loadChildren: () =>
          import('@pages/gliptus-pms/gliptus-pms.module').then((m) => m.GliptusPmsModule)
      },
      {
        path: 'drug-drug-interaction',
        loadChildren: () =>
          import('@pages/drug-drug-interaction/drug-drug-interaction.module').then((m) => m.DrugDrugInteractionModule)
      },
      // {
      //   path: 'add-patient-visit',
      //   loadChildren: () =>
      //     import('@pages/add-patient-visit/add-patient-visit.module').then((m) => m.AddPatientVisitModule)
      // },
      {
        path: 'clinic-finances/add-patient-visit',
        loadChildren: () =>
          import('@pages/add-patient-visit/add-patient-visit.module').then((m) => m.AddPatientVisitModule)
      },
      {
        path:'clinic-finances/clinic-fees',
        loadChildren:()=>
        import('@pages/clinic-fees/clinic-fees.module').then((m)=>m.ClinicFeesModule)
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'page-not-found',
        component: PageNotFoundComponent,
      }
    ],
  },
  {
    path: '**',
    redirectTo: 'page-not-found',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }

export const appModuleRoutingComponents = [
  AuthLayoutComponent,
  AdminLayoutComponent,
  AboutComponent,
  PageNotFoundComponent,
];
