import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@services/auth/auth.service';
import { showNotification } from '@helpers/show-toast';
import { baseUrl } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing: boolean = false;
  constructor(
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private router: Router,
    public toastr: ToastrService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();

    let reqClone;

    let pattern = /^https?:\/\//g;

    if (authToken) {
      reqClone = this.addAccessTokenToHeader(request);
    } else {
      if (pattern.test(request?.url)) {
        reqClone = request.clone({ url: `${request.url}` });
      } else {
        reqClone = request.clone({ url: `${baseUrl}${request.url}` });
      }
    }

    this.spinner.show();

    return next.handle(reqClone).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse
          && !reqClone.url.toLowerCase().includes('login')
          && error.status === 401) {
          return this.handle401Error(request, next);
       } else if (error.status === 400) {
          showNotification(
            'danger',
            `${error.error
              ? error?.error?.errorList[0]?.message
              : error?.errors?.title
            }`,
            this.toastr
          );
          this.spinner.hide();
        } else if (error.status == 0) {
          let MSG = '';
          if (error.error.errorList) {
            MSG = error?.error?.errorList[0]?.message
          } else if (error?.errors) {
            MSG = error?.errors?.tittle
          } else {
            MSG = 'unknown error'
          }
          showNotification(
            'danger',
            MSG,
            this.toastr
          );
        } else {
          showNotification(
            'danger',
            `Server Error: some thing went wrong!`,
            this.toastr
          );
        }
        return throwError(error.message || 'Server Error!');
      }),
      finalize(() => {
        this.spinner.hide();
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler){
    if(!this.isRefreshing){
      this.isRefreshing = true;
      let tokenData = this.authService.getAccessAndRefreshToken();
      return this.authService.refreshToken(tokenData).pipe(
        switchMap((tokenDataResponse) => {
          this.isRefreshing = false;
          this.authService.setLoginResponseInLocalStorage(tokenDataResponse.data);
          return next.handle(this.addAccessTokenToHeader(request));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          if(this.authService.getAccessAndRefreshToken().accessToken)
            this.authService.logoutLocalStorageClear();
          this.router.navigateByUrl('auth/login');
          return throwError(() => error);
        })
      );
    }

    return next.handle(this.addAccessTokenToHeader(request));
  }

  private addAccessTokenToHeader(request: HttpRequest<any>){
    let tokens = this.authService.getAccessAndRefreshToken();
    let reqClone;
    let pattern = /^https?:\/\//g;

    if(tokens.accessToken){
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + tokens.accessToken,
      });
      if (pattern.test(request?.url)) {
        reqClone = request.clone({ url: `${request.url}` });
      } else {
        reqClone = request.clone({ headers, url: `${baseUrl}${request.url}` });
      }
    }
    return reqClone;
  }
}
