import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordGuard } from '@guards/change-password/change-password.guard';
import { LoginComponent } from '@layout/auth-layout/pages/login/login.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [ChangePasswordGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthLayoutRoutingModule {}

export const routingComponents = [
  LoginComponent,
  ChangePasswordComponent
];
