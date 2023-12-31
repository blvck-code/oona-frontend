import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { DashService } from '../service/dash-service.service';
import {
  StreamsResponseModel,
  SubStreamsResponseModel,
} from '../models/streams.model';
import { PersonResponseModel } from '../models/person.model';
import { TopicResponseModel } from '../models/topics.model';
import { MessagesResponseModel } from '../models/messages.model';

// Actions
import * as streamActions from './actions/streams.actions';
import * as dashActions from './dash.actions';
import * as userActions from './actions/users.actions';
import * as streamMsgActions from './actions/streams.messages.actions';
import * as privateMsgActions from './actions/private.messages.actions';
import { SharedService } from '../../shared/services/shared.service';

@Injectable()
export class DashEffects {
  constructor(
    private actions$: Actions,
    private dashSrv: DashService,
    private sharedSrv: SharedService
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

  // topics$: Observable<Action> = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType<streamActions.LoadTopic>(
  //       dashActions.DashActions.LOAD_TOPIC
  //     ),
  //     map((action: streamActions.LoadTopic) => action.payload),
  //     switchMap((streamId: number | string) =>
  //       this.dashSrv.streamTopics(streamId).pipe(
  //         map(
  //           (topicContent: TopicResponseModel) =>
  //             new streamActions.LoadTopicSuccess(topicContent)
  //         ),
  //         catchError((err) => of(new streamActions.LoadTopicFail(err)))
  //       )
  //     )
  //   )
  // );

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

  // messages$: Observable<Action> = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType<msgActions.LoadMessage>(
  //       dashActions.DashActions.LOAD_MESSAGE
  //     ),
  //     map((action: msgActions.LoadMessage) => action.payload),
  //     switchMap((content: any) =>
  //       this.dashSrv.streamMessages(content).pipe(
  //         map(
  //           (messages: MessagesResponseModel) =>
  //             new msgActions.LoadMessageSuccess(messages)
  //         ),
  //         catchError((err) => of(new msgActions.LoadMessageFail(err)))
  //       )
  //     )
  //   )
  // );

  streamMessages$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<streamMsgActions.LoadStreamMsg>(
        dashActions.DashActions.LOAD_STREAM_MESSAGE
      ),
      map((action: streamMsgActions.LoadStreamMsg) => action.payload),
      switchMap((content: any) =>
        this.dashSrv.streamMessages(content).pipe(
          map(
            (messages: MessagesResponseModel) =>
              new streamMsgActions.LoadStreamMsgSuccess(messages)
          ),
          catchError((err) => of(new streamMsgActions.LoadStreamMsgFail(err)))
        )
      )
    )
  );

  // createStreamMessage$: Observable<Action> = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType<streamMsgActions.CreateStreamMessage>(
  //       dashActions.DashActions.CREATE_STREAM
  //     ),
  //     map((action: streamMsgActions.CreateStreamMessage) => action.payload),
  //     switchMap((content: any) =>
  //       this.dashSrv.createMessage(content).pipe(
  //         map((message: any) => {
  //           return new this.sharedSrv.showNotification('', '');
  //           // return new streamMsgActions.CreateStreamMessageSuccess(message);
  //         })
  //       )
  //     )
  //   )
  // );

  privateMessages$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<privateMsgActions.LoadPrivateMsg>(
        dashActions.DashActions.LOAD_PRIVATE_MESSAGE
      ),
      map((action: privateMsgActions.LoadPrivateMsg) => action.payload),
      switchMap((content: any) =>
        this.dashSrv.streamMessages(content).pipe(
          map(
            (messages: MessagesResponseModel) =>
              new privateMsgActions.LoadPrivateMsgSuccess(messages)
          ),
          catchError((err) => of(new privateMsgActions.LoadPrivateMsgFail(err)))
        )
      )
    )
  );

  streamSubscribers$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<streamActions.LoadSubscribers>(
        dashActions.DashActions.LOAD_SUBSCRIBERS
      ),
      map((action: streamActions.LoadSubscribers) => action.streamName),
      switchMap((streamId: string | number) =>
        this.dashSrv.streamSubscribers(streamId).pipe(
          map(
            (subscribers: any) =>
              new streamActions.LoadSubscribersSuccess(subscribers)
          ),
          catchError((err) => of(new streamActions.LoadSubscribersFail(err)))
        )
      )
    )
  );
}
