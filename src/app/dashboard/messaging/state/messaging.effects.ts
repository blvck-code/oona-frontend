import { Observable, of } from 'rxjs';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as messagingActions from './messaging.actions';
import { MessagingService } from '../services/messaging.service';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Injectable()
export class MessagingEffects{
  constructor(
    private actions$: Actions,
    private messagingSrv: MessagingService
  ) {}


  @Effect()
  loadAllStreams$: Observable<any> = this.actions$.pipe(
    ofType<messagingActions.LoadAllStreams>(
      messagingActions.MessagingActionsTypes.LOAD_ALL_STREAMS
    ),
    mergeMap((action: messagingActions.LoadAllStreams) =>
      this.messagingSrv.fetchAllStreams().pipe(
        map((streams: any) =>
          new messagingActions.LoadAllStreamsSuccess(streams)
        ),
        // @Todo Error handler
        catchError(err => of(new messagingActions.LoadAllStreamsFail(err)))
      )
    )
  );

  @Effect()
  loadSubStreams$: Observable<any> = this.actions$.pipe(
    ofType<messagingActions.LoadSubStreams>(
      messagingActions.MessagingActionsTypes.LOAD_SUB_STREAMS
    ),
    mergeMap((action: messagingActions.LoadSubStreams) =>
      this.messagingSrv.fetchSubStreams().pipe(
        map((subStreams: any) =>
          new messagingActions.LoadSubStreamsSuccess(subStreams)
        ),
        catchError(err => of(new messagingActions.LoadSubStreamsFail(err)))
      )
    )
  );

  @Effect()
  loadStreamTopics$: Observable<any> = this.actions$.pipe(
    ofType<messagingActions.LoadStreamTopic>(
      messagingActions.MessagingActionsTypes.LOAD_STREAM_TOPIC
    ),
    map((action: messagingActions.LoadStreamTopic) => action.payload),
    mergeMap((streamId: any) =>
      this.messagingSrv.getTopicsOnStreams(streamId).pipe(
        map((topicData: any) =>
          new messagingActions.LoadStreamTopicSuccess(topicData)
        ),
        catchError(err => of(new messagingActions.LoadStreamTopicFail(err)))
      )
    )
  );

}
