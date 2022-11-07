import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Observable, of} from 'rxjs';
import {Action} from '@ngrx/store';
import {catchError, map, switchMap} from 'rxjs/operators';
import {DashService} from '../service/dash-service.service';
import {StreamsResponseModel, SubStreamsResponseModel} from '../models/streams.model';

// Actions
import * as streamActions from './actions/streams.actions';
import * as dashActions from './dash.actions';
import * as userActions from './actions/users.actions';
import {PersonResponseModel} from '../models/person.model';

@Injectable()

export class DashEffects {

  constructor(
    private actions$: Actions,
    private dashSrv: DashService
  ) {}


  streams$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<streamActions.LoadSubStreams>(
        dashActions.DashActions.LOAD_SUB_STREAMS
      ),
      switchMap(() =>
        this.dashSrv.subStreams().pipe(
          map(
            (streams: SubStreamsResponseModel) =>
              new streamActions.LoadSubStreamsSuccess(streams)
          ),
          catchError((err) => of(new streamActions.LoadSubStreamsFail(err)))
        )
      )
    )
  );

  presentUsers$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<userActions.LoadPresentUsers>(
        dashActions.DashActions.LOAD_PRESENT_USERS
      ),
      switchMap(() =>
        this.dashSrv.presentUsers().pipe(
          map(
            (users: PersonResponseModel) =>
              new userActions.LoadPresentUsersSuccess(users)
          ),
          catchError((err) => of(new userActions.LoadPresentUsersFail(err)))
        )
      )
    )
  );

  zulipUsers$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<userActions.LoadZulipUsers>(
        dashActions.DashActions.LOAD_ZULIP_USERS
      ),
      switchMap(() =>
        this.dashSrv.zulipUsers().pipe(
          map(
            (users: PersonResponseModel) =>
              new userActions.LoadZulipUsersSuccess(users)
          ),
          catchError((err) => of(new userActions.LoadZulipUsersFail(err)))
        )
      )
    )
  );


}
