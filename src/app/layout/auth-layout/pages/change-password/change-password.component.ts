import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { showNotification } from '@helpers/show-toast';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  passwordFocus: boolean = false;
  confirmPasswordFocus: boolean = false;
  changePasswordForm: FormGroup;
  isSubmited: boolean = false;
  doctorEmail: string = null;
  doctorOtp: string = null;
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group(
      {
        password: [null, [Validators.required, Validators.minLength(6)]],
        confirmPassword: [null, [Validators.required, Validators.minLength(6)]],
      },
      { validator: this.matchPassword }
    );
    this.doctorEmail = sessionStorage.getItem('doctorEmail');
    this.doctorOtp = sessionStorage.getItem('doctorOtp');
  }

  onTogglePassword() {
    if (this.changePasswordForm.value.password.length) {
      this.isPasswordVisible = !this.isPasswordVisible;
    }
  }

  onToggleConfirmPassword() {
    if (this.changePasswordForm.value.confirmPassword.length) {
      this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    }
  }

  matchPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;
    if (password != confirmPassword) {
      return { noMatch: true };
    }
    return null;
  }

  onChangePasswordSubmit() {
    this.authService
      .changePassword(this.doctorEmail, this.changePasswordForm.value.password)
      .subscribe((response) => {
        if (response?.data) {
          showNotification(
            'success',
            `Your password has been changed successfully.`,
            this.toastr
          );
          this.authService.setAccessAndRefreshToken(response.data.accessToken, response.data.refreshToken)
          localStorage.setItem('fullName', response.data.fullName);
          localStorage.setItem('imagePath', response.data.imagePath);
          localStorage.setItem('doctorId', response.data.doctorId.toString());
          this.router.navigateByUrl('/home', { replaceUrl: true });
        } else {
          showNotification(
            'danger',
            `This session is expired, please check forgot password again!`,
            this.toastr
          );
        }
      });
  }
}
