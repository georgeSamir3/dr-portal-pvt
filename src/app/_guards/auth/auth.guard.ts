import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    let checkUserLogin = !!this.authService.getToken();
    if (!checkUserLogin) {
      this.router.navigate(['auth/login']);
    }
    return checkUserLogin;
  }
}
