import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ChangePasswordGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    let checkUserOtp = !!sessionStorage.getItem('doctorOtp');
    if (!checkUserOtp) {
      this.router.navigate(['auth/login']);
    }
    return checkUserOtp;
  }
}
