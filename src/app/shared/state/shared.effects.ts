import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Observable, of} from 'rxjs';
import * as sharedActions from './shared.actions';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {SharedService} from '../services/shared.service';


@Injectable()

export class SharedEffects {
  constructor(
    private actions$: Actions,
    private sharedSrv: SharedService
  ) {}

  @Effect()
  loadUsers$: Observable<any> = this.actions$.pipe(
    ofType<sharedActions.LoadUsers>(
      sharedActions.SharedActionsTypes.LOAD_USERS
    ),
    mergeMap((action: sharedActions.LoadUsers) =>
      this.sharedSrv.getUsers().pipe(
        map((users: any) =>
          new sharedActions.LoadUsersSuccess(users)
        ),
        // @Todo handle error
        catchError(err => of(new sharedActions.LoadUsersFail(err)))
      )
    )
  );
}
