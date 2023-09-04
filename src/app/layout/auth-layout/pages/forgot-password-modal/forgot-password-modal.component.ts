import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { showNotification } from '@helpers/show-toast';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.scss'],
})
export class ForgotPasswordModalComponent {
  isVerifyEmail: boolean = false;
  doctorEmail: string = null;
  doctorOtp: string = null;

  constructor(
    public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService
  ) {}

  onRecoverPasswordSubmit() {
    this.authService.forgotPassword(this.doctorEmail).subscribe((response) => {
      if (response?.data?.flag) {
        this.isVerifyEmail = true;
      } else {
        showNotification('danger', `Please check your email!`, this.toastr);
      }
    });
  }

  onVerifyOtpSubmit() {
    this.authService
      .verifyForgetPasswordOtp(this.doctorEmail, this.doctorOtp)
      .subscribe((response) => {
        if (response?.data?.flag) {
          this.bsModalRef.hide();
          sessionStorage.setItem('doctorEmail', this.doctorEmail);
          sessionStorage.setItem('doctorOtp', this.doctorOtp);
          this.router.navigate(['auth', 'change-password']);
        } else {
          showNotification(
            'danger',
            `Please check your email, sent otp!`,
            this.toastr
          );
        }
      });
  }
}
