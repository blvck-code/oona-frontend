import {Injectable, Injector} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../state/app.state';
import {HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {getAccessToken} from '../auth/state/auth.selectors';
import {exhaustMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  constructor(
    private injector: Injector,
    private store: Store<AppState>
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select(getAccessToken).pipe(
      exhaustMap((token: any) => {
        if (!token || request.url.includes('/login')){
          return next.handle(request);
        } else {
          let modifiedReq = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(modifiedReq);
        }
      })
    );
  }

}
