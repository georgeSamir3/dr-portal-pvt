import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { showNotification } from '@helpers/show-toast';
import { IBreadcrumbItem } from '@interfaces/i-breadcrumb-item';
import { AuthService } from '@services/auth/auth.service';
import { HomeService } from '@services/home/home.service';
import { ToastrService } from 'ngx-toastr';
import { isPermissionExist } from '@helpers/permissions';
import { ConvoyPermission } from 'src/app/_constants/permissions';
import { AppVersionsService } from '@services/home/app-versions/app-versions.service';
import { compareVersions, getCurrentAppVersion } from '@helpers/compare-versions';
import { CreateEPrescriptionService } from '@services/home/create-e-prescription/create-e-prescription.service';
import { IResponse } from '@interfaces/i-response';
import { IPatient } from '@interfaces/home/i-patient';
import { IMedicine } from '@interfaces/home/i-medicine';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  pageTitle: string = 'Home';
  breadcrumbList: IBreadcrumbItem[] = [{ text: 'Home', link: '' }];
  patientInfoForm: FormGroup;
  convoyPatientInfoForm: FormGroup;
  otpValidationForm: FormGroup;
  isViewPatientEmr: boolean = false;
  patientId: number = 1;
  permissions: string[] = [];
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private homeService: HomeService,
    private toastr: ToastrService,
    private appVersionsService: AppVersionsService,
    private createEPrescriptionService: CreateEPrescriptionService,
  ) {
    // this.homeService.checkUserLogin().subscribe((response) => true);
  }

  ngOnInit(): void {
    this.appVersionsService.getAppVersions().subscribe(res => {
      let currentAppVersion: string = getCurrentAppVersion(res.data.patientVersionApp);
      let savedAppVersion = localStorage.getItem('appVersion');
      if (compareVersions(currentAppVersion, savedAppVersion || '0.0.0') > 0) {
        localStorage.setItem('appVersion', currentAppVersion);
        localStorage.setItem('isNotCreatePrescriptionAppVersion', true.toString());
        localStorage.removeItem('accessToken');
        this.router.navigateByUrl('auth/login');
      }

    });

    this.patientInfoForm = this.formBuilder.group({
      phoneNumber: [
        null,
        [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
      ],
      cardId: [null],
      companyId: [null],
    });

    this.otpValidationForm = this.formBuilder.group({
      otp: [null, [Validators.required, Validators.minLength(6)]],
    });

    this.convoyPatientInfoForm = this.formBuilder.group({
      patientConvoyId: [null, [Validators.required]]
    });

    this.patientInfoForm
      .get('phoneNumber')
      .valueChanges.subscribe((response) => {
        this.isViewPatientEmr = false;
      });

  }

  createConnectToPatientRequestBody() {
    return {
      Phone: this.patientInfoForm.value.phoneNumber,
      LimitlessCareCardId: this.patientInfoForm.value.cardId,
      CompanyEmployeeId: this.patientInfoForm.value.companyId,
    };
  }

  createVerifyOtpBody() {
    return {
      PhoneOrEmail: this.patientInfoForm.value.phoneNumber,
      OTP: this.otpValidationForm.value.otp,
    };
  }

  onCreateEPrescription() {
    if (this.isConvoy()) {
      this.homeService.connectToConvoyPatient(this.convoyPatientInfoForm.value).subscribe((response) => {
        this.homeService.patientData = response.data;
        this.patientId = this.homeService.patientData.patient.patientId;
        this.router.navigate(['create-e-prescription', this.patientId]);
      });
      return;
    }

    let requestBody = this.createConnectToPatientRequestBody();

    this.homeService.connectToPatient(requestBody).subscribe((response: IResponse<IPatient>) => {
      this.homeService.patientData = response.data;
      this.patientId = this.homeService.patientData.patient.patientId;
      this.router.navigate(['create-e-prescription', this.patientId]);
    });
  }

  onViewPatientEmr() {
    if (this.isConvoy()) {
      this.homeService.connectToConvoyPatient(this.convoyPatientInfoForm.value).subscribe((response) => {
        this.homeService.patientData = response.data;
        this.patientId = this.homeService.patientData.patient.patientId;
        this.router.navigate(['patient-emr', this.patientId]);
      });
      return;
    }


    let requestBody = this.createConnectToPatientRequestBody();

    this.homeService.connectToPatient(requestBody).subscribe((response) => {

      this.homeService.patientData = response.data;
      this.patientId = this.homeService.patientData.patient.patientId;
      this.router.navigate(['patient-emr', this.patientId]);
    });
  }

  onVerifyOtp() {
    let requestBody = this.createVerifyOtpBody();

    this.homeService.verifyViewEMROTP(requestBody).subscribe((response) => {
      this.patientId = response.data.patient.patientId;
      this.router.navigate(['patient-emr', this.patientId]);
    });
  }

  onResendOtp() {
    this.onViewPatientEmr();
  }

  isConvoy() {
    return isPermissionExist(ConvoyPermission);
  }

}
