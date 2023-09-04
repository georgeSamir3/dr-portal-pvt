import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { compareVersions, getCurrentAppVersion } from '@helpers/compare-versions';
import { isPermissionExist } from '@helpers/permissions';
import { AppVersionsService } from '@services/home/app-versions/app-versions.service';
import { CreateEPrescriptionService } from '@services/home/create-e-prescription/create-e-prescription.service';

declare const gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private appVersionsService: AppVersionsService, private createEPrescriptionService: CreateEPrescriptionService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-VE96YZWR72', { 'page_path': event.urlAfterRedirects });
      }
    })
  }

  ngOnInit(): void {
    if (isPermissionExist('DoctorGliptus')) {
      this.router.navigate(['/gliptus-pms']);
    }
    this.appVersionsService.getAppVersions().subscribe(res => {
      let currentAppVersion: string = getCurrentAppVersion(res.data.patientVersionApp);
      let savedAppVersion = localStorage.getItem('appVersion');
      if (compareVersions(currentAppVersion, savedAppVersion || '0.0.0') > 0) {
        localStorage.setItem('appVersion', currentAppVersion);
      }
    });
  }
}
