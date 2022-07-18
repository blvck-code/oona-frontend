import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

// NgRx
import * as sharedActions from '../shared/state/shared.actions';
import {Store} from '@ngrx/store';
import {AppState} from '../state/app.state';
import * as authActions from '../auth/state/auth.actions';
import {Router} from '@angular/router';
import {NotificationService} from '../shared/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor{

  constructor(
    private store: Store<AppState>,
    private route: Router,
    private notify: NotificationService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorStatus = error.status;
        console.log('Error status ==>', errorStatus);
        let errorMsg;

        // Un Authorised User Access
        if (errorStatus === 401 || errorStatus === 403) {
          this.store.dispatch(new authActions.LogoutUser());
          localStorage.clear();
          this.route.navigate(['/login']);
        }

        // Other errors
        if (error instanceof ErrorEvent){
          // client-side error
          // errorMsg = `Error ${error.message}`
          console.log('Client side error ===>>> ', error);

        } else {
          // server-side error
          console.log('Server side error ===>>> ', error);
          console.log('Error message ===>>> ', error?.error.toString());

          if (error?.error.toString()) {
            // tslint:disable-next-line:no-shadowed-variable
            const err = {
              status: error.status,
              message: error?.error.toString()
            };
            errorMsg = err;
            console.log('Error content: ', err);
          }

          if (error?.error?.error) {
            // tslint:disable-next-line:no-shadowed-variable
            const err = {
              status: error.status,
              message: error?.error?.error
            };
            errorMsg = err;

          }

          if (error?.error[0]?.non_field_errors[0]) {
            const err = {
              status: error.status,
              message: error?.error[0]?.non_field_errors[0]
            };
            errorMsg = err;
          }

          if (error?.error?.password1){
            const errInfo = {
              status: error.status,
              message: error?.error?.password1[0].toString()
            };
            errorMsg = errInfo;
          }

          if (error?.error?.non_field_errors){
            const errInfo = {
              status: error.status,
              message: error?.error?.non_field_errors[0].toString()
            };
            errorMsg = errInfo;
          }

          const emailError = error?.error?.email;

          if (emailError) {
            const errInfo = {
              message: emailError.toString(),
              status: errorStatus
            };
            errorMsg = errInfo;
          }

        }

        console.log('Error Msg: ', errorMsg);
        return throwError(errorMsg);
      })
    );
  }
}
