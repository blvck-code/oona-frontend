import {Actions, createEffect, Effect, ofType} from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import * as authActions from './auth.actions';
import {catchError, map, mergeMap, switchMap, tap} from 'rxjs/operators';
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

  // @Effect()
  // loginUser$: Observable<any> = this.actions$.pipe(
  //   ofType<authActions.LoginUser>(authActions.AuthActionsTypes.LOGIN_USER),
  //   map((action: authActions.LoginUser) => action.payload),
  //   mergeMap((userCredentials: any) =>
  //     this.authSrv.login(userCredentials).pipe(
  //       map((userInfo: UserModel) => {
  //         new authActions.LoginUserSuccess(userInfo)
  //         },
  //         tap(() => this.router.navigate(['/dashboard']))
  //       ),
  //       catchError((err) => of(new authActions.LoginUserFail(err)))
  //     )
  //   )
  // );

  // @Effect()
  // login$ = createEffect(() => this.actions$.pipe(
  //   ofType<authActions.LoginUser>(authActions.AuthActionsTypes.LOGIN_USER),
  //   switchMap((payload: any) => {
  //     return this.authSrv.login(payload).pipe(
  //       map((userInfo: UserModel) => {
  //         new authActions.LoginUserSuccess(userInfo)
  //       },
  //         tap(() => this.router.navigate(['/dashboard']))
  //       ),
  //       catchError((err) => of(new authActions.LoginUserFail(err)))
  //     )
  //   })
  // ))

  @Effect()
  logoutUser$: Observable<any> = this.actions$.pipe(
    ofType<authActions.LogoutUser>(authActions.AuthActionsTypes.LOGOUT_USER),
    mergeMap(() =>
      this.authSrv.logoutUser().pipe(
        map((msg: any) => new authActions.LogoutUserSuccess(msg)),
        catchError((err: any) => of(new authActions.LogoutUserFail(err)))
      )
    )
  );

  @Effect()
  loadAllUsers$: Observable<any> = this.actions$.pipe(
    ofType<authActions.LoadAllUsers>(authActions.AuthActionsTypes.LOAD_ALL_USERS),
    mergeMap((action: authActions.LoadAllUsers) =>
      this.authSrv.getUsersByAvailability().pipe(
        map((allUsers: any) =>
          new authActions.LoadAllUsersSuccess(allUsers)
        ),
        // ToDo Error handler
        catchError((err) => of(new authActions.LoadAllUsersFail(err)))
      )
    )
  );

  // @Effect({ dispatch: false })
  // authSuccess = this.actions$.pipe(
  //   ofType<authActions.LoginUserSuccess>(authActions.AuthActionsTypes.LOGIN_USER_SUCCESS),
  //   tap(() => {
  //     console.log('automatic');
  //     this.router.navigate(['/dashboard'])
  //   })
  // )

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
