import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlService } from '@services/api-url/api-url.service';
import { IUser } from '@interfaces/i-user';
import { IResponse } from '@interfaces/i-response';
import { ILoggedinUser } from '@interfaces/i-loggedin-user';
import { IRefreshTokenDTO } from '@interfaces/auth/i-refresh-token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient, private apiUrlService: ApiUrlService) { }

  login(user: IUser): Observable<IResponse<ILoggedinUser>> {
    return this.http.put<IResponse<ILoggedinUser>>(
      this.apiUrlService.loginUrl,
      user
    );
  }

  forgotPassword(phoneOrEmail: string): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(
      this.apiUrlService.forgetPasswordUrl,
      { phoneOrEmail }
    );
  }

  verifyForgetPasswordOtp(
    phoneOrEmail: string,
    otp: string
  ): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(
      this.apiUrlService.verifyForgetPasswordOtpUrl,
      { phoneOrEmail, otp }
    );
  }

  changePassword(
    phoneOrEmail: string,
    newPassword: string
  ): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(
      this.apiUrlService.resetForgottenPasswordUrl,
      { phoneOrEmail, newPassword }
    );
  }

  getToken() {
    return localStorage.getItem('accessToken');
  }


  setAccessAndRefreshToken(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  setLoginResponseInLocalStorage(data: ILoggedinUser) {
    this.setAccessAndRefreshToken(data.accessToken, data.refreshToken)
    localStorage.setItem('fullName', data.fullName);
    localStorage.setItem('imagePath', data.imagePath);
    localStorage.setItem('doctorId', data.doctorId.toString());
    localStorage.setItem('permissions', JSON.stringify(data.permissions || []));

    let previousPermissions = localStorage.getItem('permissions');
    let currentPermissions = JSON.stringify(data.permissions);
    if (previousPermissions !== currentPermissions) {
      localStorage.setItem('permissions', JSON.stringify(data.permissions));
      window.location.reload();
    }
  }

  getAccessAndRefreshToken(): IRefreshTokenDTO {
    let tokenData: IRefreshTokenDTO = {
      accessToken: localStorage.getItem('accessToken') || '',
      refreshToken: localStorage.getItem('refreshToken') || ''
    }
    return tokenData;
  }

  refreshToken(tokenData: IRefreshTokenDTO): Observable<IResponse<ILoggedinUser>> {
    return this.http.put<IResponse<ILoggedinUser>>(this.apiUrlService.refreshTokenUrl, tokenData);
  }

  logoutLocalStorageClear(){
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("fullName");
    localStorage.removeItem("imagePath");
    localStorage.removeItem("doctorId");
    localStorage.removeItem("permissions");
  }
}
