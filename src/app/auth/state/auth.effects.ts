import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import * as authActions from './auth.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authSrv: AuthService,
    private router: Router
  ) {}

  @Effect()
  loginUser$: Observable<any> = this.actions$.pipe(
    ofType<authActions.LoginUser>(authActions.AuthActionsTypes.LOGIN_USER),
    map((action: authActions.LoginUser) => action.payload),
    mergeMap((userCredentials: any) =>
      this.authSrv.login(userCredentials).pipe(
        map((userInfo: UserModel) =>
          new authActions.LoginUserSuccess(userInfo)
        ),
        catchError((err) => of(new authActions.LoginUserFail(err)))
      )
    )
  );

  @Effect()
  logoutUser$: Observable<any> = this.actions$.pipe(
    ofType<authActions.LogoutUser>(authActions.AuthActionsTypes.LOGOUT_USER),
    mergeMap(() =>
      this.authSrv.logout().pipe(
        map((msg: any) => new authActions.LogoutUserSuccess(msg)),
        catchError((err: any) => of(new authActions.LogoutUserFail(err)))
      )
    )
  );

  @Effect()
  getProfile$: Observable<any> = this.actions$.pipe(
    ofType<authActions.LoadProfile>(
      authActions.AuthActionsTypes.FETCH_PROFILE_LOAD
    ),
    mergeMap(() =>
      this.authSrv.getUserProfile().pipe(
        map(
          (userProfile: any) => new authActions.LoadProfileSuccess(userProfile)
        ),
        // ToDo Logout encase of 401 error
        catchError((err: any) => of(new authActions.LoadProfileError(err)))
      )
    )
  );

  @Effect()
  loadAllUsers$: Observable<any> = this.actions$.pipe(
    ofType<authActions.LoadAllUsers>(authActions.AuthActionsTypes.LOAD_ALL_USERS),
    mergeMap((action: authActions.LoadAllUsers) =>
      this.authSrv.getAllUsers().pipe(
        map((allUsers: any) =>
          new authActions.LoadAllUsersSuccess(allUsers)
        ),
        // ToDo Error handler
        catchError((err) => of(new authActions.LoadAllUsersFail(err)))
      )
    )
  );

  @Effect()
  loadZulipUsers$: Observable<any> = this.actions$.pipe(
    ofType<authActions.LoadZulipUsers>(authActions.AuthActionsTypes.LOAD_ZULIP_USERS),
    mergeMap(( action: authActions.LoadZulipUsers) =>
      this.authSrv.getZulipUsers().pipe(
        map((users: any) =>
          new authActions.LoadZulipUsersSuccess(users)
        ),
        catchError(err => of(new authActions.LoadZulipUsersSuccess(err)))
      )
    )
  );
}
