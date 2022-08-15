import { Observable, of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as messagingActions from './messaging.actions';
import { MessagingService } from '../services/messaging.service';
import { catchError, delay, map, mergeMap, take } from 'rxjs/operators';
import { MessagesModel } from '../models/messages.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';

@Injectable()
export class MessagingEffects {
  constructor(
    private actions$: Actions,
    private messagingSrv: MessagingService,
    private store: Store<AppState>
  ) {}

  @Effect()
  loadAllStreams$: Observable<any> = this.actions$.pipe(
    ofType<messagingActions.LoadAllStreams>(
      messagingActions.MessagingActionsTypes.LOAD_ALL_STREAMS
    ),
    mergeMap((action: messagingActions.LoadAllStreams) =>
      this.messagingSrv.fetchAllStreams().pipe(
        map(
          (streams: any) => new messagingActions.LoadAllStreamsSuccess(streams)
        ),
        // @Todo Error handler
        catchError((err) => of(new messagingActions.LoadAllStreamsFail(err)))
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
        map(
          (subStreams: any) =>
            new messagingActions.LoadSubStreamsSuccess(subStreams)
        ),
        catchError((err) => of(new messagingActions.LoadSubStreamsFail(err)))
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
      this.messagingSrv.getStreamTopics(streamId).pipe(
        map(
          (topicData: any) =>
            new messagingActions.LoadStreamTopicSuccess(topicData)
        ),
        catchError((err) => of(new messagingActions.LoadStreamTopicFail(err)))
      )
    )
  );

  // @Effect()
  // loadAllMessages$: Observable<any> = this.actions$.pipe(
  //   ofType<messagingActions.LoadAllMessages>(
  //     messagingActions.MessagingActionsTypes.LOAD_ALL_MESSAGES
  //   ),
  //   map((action: messagingActions.LoadAllMessages) => action.payload),
  //   mergeMap((streamDetail: any) =>
  //     this.messagingSrv.getMessagesOfStream(streamDetail).pipe(
  //       map((messages: MessagesModel) =>
  //         new messagingActions.LoadAllMessagesSuccess(messages)
  //       ),
  //       catchError(err => of(new messagingActions.LoadAllMessagesFail(err)))
  //     )
  //   )
  // );

  @Effect()
  loadPrivateMessages$: Observable<any> = this.actions$.pipe(
    ofType<messagingActions.LoadPrivateMessages>(
      messagingActions.MessagingActionsTypes.LOAD_PRIVATE_MESSAGES
    ),
    map((action: messagingActions.LoadPrivateMessages) => action.payload),
    take(1),
    mergeMap((streamDetail: any) =>
      this.messagingSrv.getMessagesOfStream(streamDetail).pipe(
        map(
          (messages: MessagesModel) =>
            new messagingActions.LoadPrivateMessagesSuccess(messages)
        ),
        catchError((err) =>
          of(new messagingActions.LoadPrivateMessagesSuccess(err))
        )
      )
    )
  );

  @Effect()
  loadMessages$: Observable<any> = this.actions$.pipe(
    ofType<messagingActions.LoadMessaging>(
      messagingActions.MessagingActionsTypes.LOAD_MESSAGES
    ),
    map((action: messagingActions.LoadMessaging) => action.payload),
    mergeMap((streamDetail: any) =>
      this.messagingSrv.getMessagesOfStream(streamDetail).pipe(
        map(
          (messages: MessagesModel) =>
            new messagingActions.LoadMessagingSuccess(messages)
        ),
        catchError((err) => of(new messagingActions.LoadMessagingFail(err)))
      )
    )
  );

  @Effect()
  loadMoreMessages$: Observable<any> = this.actions$.pipe(
    ofType<messagingActions.LoadMoreMessaging>(
      messagingActions.MessagingActionsTypes.LOAD_MORE_MESSAGE
    ),
    map((action: messagingActions.LoadMoreMessaging) => action.payload),
    mergeMap((streamData: any) =>
      this.messagingSrv.getMessagesOfStream(streamData).pipe(
        map(
          (messages: MessagesModel) =>
            new messagingActions.LoadMoreMessagingSuccess(messages)
        ),
        catchError((err) => of(new messagingActions.LoadMoreMessagingFail(err)))
      )
    )
  );

  // @Effect()
  // loadStreamData$: Observable<any> = this.actions$.pipe(
  //   ofType<messagingActions.LoadStreamData>(
  //     messagingActions.MessagingActionsTypes.LOAD_STREAM_DATA
  //   ),
  //   map((action: messagingActions.LoadStreamData) => action.payload),
  //   mergeMap((messages: any) =>
  //     this.messagingSrv.getMessagesOfStream(messages).pipe(
  //       new messagingActions.LoadStreamDataSuccess(messages)
  //     )
  //   ),
  //   catchError(err => of(new messagingActions.LoadStreamDataFail(err)))
  // );

  // @Effect()
  // loadStreamData$: Observable<any> = this.actions$.pipe(
  //   ofType<messagingActions.LoadStreamData>(
  //     messagingActions.MessagingActionsTypes.LOAD_STREAM_DATA
  //   ),
  //   map(( action: messagingActions.LoadStreamData) => action.payload),
  //   mergeMap((messages: any) =>
  //     this.messagingSrv.getMessagesOfStream(messages).pipe(
  //       new messagingActions.LoadStreamDataSuccess(messages)
  //     )
  //   ),
  //   catchError( err => of(new messagingActions.LoadStreamDataFail(err)))
  // );

  // @Effect()
  // loadPrivateUser$: Observable<any> = this.actions$.pipe(
  //   ofType<messagingActions.LoadCurrentPrivateUser>(
  //     messagingActions.MessagingActionsTypes.LOAD_CURRENT_USER
  //   ),
  //   map((action: messagingActions.LoadCurrentPrivateUser) => action.payload),
  //   mergeMap((user: any) =>
  //     this.messagingSrv.currentMemberChatDetail(user).pipe(
  //       map((message: any) =>
  //         new messagingActions.LoadCurrentPrivateUserSuccess(messages)
  //       ),
  //       catchError(err => of(new messagingActions.LoadCurrentPrivateUserFail(err)))
  //     )
  //   )
  // );
}
