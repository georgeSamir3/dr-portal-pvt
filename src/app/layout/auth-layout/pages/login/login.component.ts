import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { showNotification } from '@helpers/show-toast';
import { AuthService } from '@services/auth/auth.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ForgotPasswordModalComponent } from './../forgot-password-modal/forgot-password-modal.component';
import { AppVersionsService } from '@services/home/app-versions/app-versions.service';
import { compareVersions, getCurrentAppVersion } from '@helpers/compare-versions';
import { isPermissionExist } from '@helpers/permissions';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  emailFocus: boolean = false;
  passwordFocus: boolean = false;
  signInForm: FormGroup;
  isSubmited: boolean = false;
  modalRef: BsModalRef;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private modalService: BsModalService,
    private appVersionsService: AppVersionsService
  ) {}

  ngOnInit() {
    if (!!localStorage.getItem('accessToken')) {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }

    this.signInForm = this.formBuilder.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([\w-]+\.)+[\w-]{2,4}$/
          ),
        ],
      ],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  onSignInSubmit() {
    if (this.signInForm.valid) {
      this.authService.login(this.signInForm.value).subscribe((res) => {

        this.authService.setLoginResponseInLocalStorage(res.data);


        

        this.appVersionsService.getAppVersions().subscribe(response =>{
          let currentAppVersion: string = getCurrentAppVersion(response.data.patientVersionApp);
          let savedAppVersion = localStorage.getItem('appVersion');
          if(compareVersions(currentAppVersion, savedAppVersion || '0.0.0') > 0){
            localStorage.setItem('appVersion', currentAppVersion);
            localStorage.setItem('isNotCreatePrescriptionAppVersion', true.toString());
          }
          if (isPermissionExist('DoctorGliptus')) {
            this.router.navigateByUrl('/gliptus-pms', { replaceUrl: true });
          } else {
            this.router.navigateByUrl('/home', { replaceUrl: true });
          }
        });
      });
      return true;
    } else {
      showNotification(
        'danger',
        `Please check your email, password again`,
        this.toastr
      );
      return false;
    }
  }

  onForgotPassword() {
    const initialState: ModalOptions = {
      keyboard: false,
      backdrop : 'static',
      class: 'modal-dialog-centered',
    };

    this.modalRef = this.modalService.show(
      ForgotPasswordModalComponent,
      initialState
    );
  }
}
