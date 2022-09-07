import { Observable, of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as messagingActions from './messaging.actions';
import { MessagingService } from '../services/messaging.service';
import { catchError, delay, map, mergeMap, take } from 'rxjs/operators';
import { MessagesModel } from '../models/messages.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import {ToastrService} from "ngx-toastr";

@Injectable()
export class MessagingEffects {
  constructor(
    private actions$: Actions,
    private messagingSrv: MessagingService,
    toastr: ToastrService
  ) {}

  @Effect()
  privateMessage$: Observable<any> = this.actions$.pipe(
    ofType<messagingActions.CreatePrivateMessage>(
      messagingActions.MessagingActionsTypes.CREATE_PRIVATE_MESSAGE
    ),
    map((action: messagingActions.CreatePrivateMessage) => action.payload),
    mergeMap((message: any) =>
      this.messagingSrv.sendIndividualMessage(message).pipe(
        map((newMessage: any) =>
          new messagingActions.CreatePrivateMessageSuccess(newMessage)
        ),
      ),
      catchError((err: any) => of(new messagingActions.CreatePrivateMessageFail(err)))
    )
  );

  // Add stream message on store
  @Effect()
  streamMessage$: Observable<any> = this.actions$.pipe(
    ofType<messagingActions.CreateStreamMessage>(
      messagingActions.MessagingActionsTypes.CREATE_STREAM_MESSAGE
    ),
    map((action: messagingActions.CreateStreamMessage) => action.payload),
    mergeMap((action: any) => action.payload),
  );

  @Effect()
  loadStreamMessage$: Observable<any> = this.actions$.pipe(
    ofType<messagingActions.LoadStreamMessage>(
      messagingActions.MessagingActionsTypes.LOAD_STREAM_MESSAGES
    ),
    map((action: messagingActions.LoadStreamMessage) => action.payload),
    mergeMap((streamData: any) =>
      this.messagingSrv.getMessagesOfStream(streamData).pipe(
        map((message: any) =>
          new messagingActions.LoadStreamMessageSuccess(message)
        ),
        catchError((err) => of(new messagingActions.LoadStreamMessageFail(err)))
      )
    )
  );

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

  @Effect()
  updateMessageFlag$: Observable<any> = this.actions$.pipe(
    ofType<messagingActions.UpdateReadMessage>(
      messagingActions.MessagingActionsTypes.UPDATE_READ_MESSAGE
    ),
    map((action: messagingActions.UpdateReadMessage) => action.payload),
    mergeMap((msgId: number) =>
      this.messagingSrv.updateMessageFlag(msgId).pipe(
        map((response: any) =>
          new messagingActions.UpdateReadMessageSuccess(response.messages[0])
        ),
        catchError((err) => of(new messagingActions.UpdateReadMessageFail(err)))
      )
    )
  );

  @Effect()
  loadPrivateMessages$: Observable<any> = this.actions$.pipe(
    ofType<messagingActions.LoadPrivateMessages>(
      messagingActions.MessagingActionsTypes.LOAD_PRIVATE_MESSAGES
    ),
    map((action: messagingActions.LoadPrivateMessages) => action.payload),
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
