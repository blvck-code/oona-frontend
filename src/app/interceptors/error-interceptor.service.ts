import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

// NgRx
import * as sharedActions from '../shared/state/shared.actions';
import {Store} from '@ngrx/store';
import {AppState} from '../state/app.state';
import * as authActions from '../auth/state/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor{

  constructor(
    private store: Store<AppState>
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        const errorStatus = error.status;
        console.log('Error status ==>', errorStatus);
        let errorMsg = '';

        // Un Authorised User Access
        if (errorStatus === 401 || errorStatus === 403) {
          this.store.dispatch(new authActions.LogoutUser());
        }

        if (error instanceof ErrorEvent){
          // client-side error
          // errorMsg = `Error ${error.message}`
          console.log(error);

        } else {
          // server-side error
          errorMsg = `Error ${error.message}`;

          const nonFieldError = error?.error.non_field_errors;
          const emailError = error?.error.email;

          if (nonFieldError) {
            const errorData = {
              message: nonFieldError.toString(),
              status: errorStatus
            };

            // this.store.dispatch(new sharedActions.ErrorHandler(errorData));

          } else if (emailError) {
            const errorData = {
              message: emailError.toString(),
              status: errorStatus
            };

            // this.store.dispatch(new sharedActions.ErrorHandler(errorData));
          }

        }
        return throwError(errorMsg);
      })
    );
  }


}
