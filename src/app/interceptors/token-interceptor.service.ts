import {Injectable, Injector} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../state/app.state';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {getAccessToken} from '../auth/state/auth.selectors';
import {catchError, exhaustMap} from 'rxjs/operators';
import {AuthService} from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  constructor(
    private injector: Injector,
    private authSrv: AuthService,
    private store: Store<AppState>
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authSrv.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {

          if (err.status === 401) {
            // Todo Logout user
            console.log('401 error');
          }
        }
        return throwError(err);
      })
    );

  }

}
