import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AuthLayoutRoutingModule, routingComponents } from './auth-layout.routing.module';
import { CheckValidityDirective } from '@directives/check-validity.directive';
import { ForgotPasswordModalComponent } from './pages/forgot-password-modal/forgot-password-modal.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AuthLayoutRoutingModule,
  ],
  declarations: [
    routingComponents,
    CheckValidityDirective,
    ForgotPasswordModalComponent
  ]
})
export class AuthLayoutModule {}
