import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';
import {
  AllStreamsResponseModel,
  StreamsResponseModel,
  SubscribersResponseModel,
  SubStreamsModel,
  SubStreamsResponseModel,
} from '../models/streams.model';

// NgRx
import { Store } from '@ngrx/store';
import { PersonResponseModel } from '../models/person.model';
import * as streamActions from '../state/actions/streams.actions';
import * as userActions from '../state/actions/users.actions';
import { TopicResponseModel } from '../models/topics.model';
import {
  getStreams,
  getStreamsId,
  getStreamsLoaded,
} from '../state/entities/streams.entity';
import {
  MessagesResponseModel,
  SingleMessageModel,
} from '../models/messages.model';
import * as authActions from '../../auth/state/auth.actions';
import { map } from 'rxjs/operators';
import { MessagePayloadModel } from '../messaging/models/message.model';
import { getUserId } from '../../auth/state/auth.selectors';
import * as streamMessagesActions from '../../dashboard/state/actions/streams.messages.actions';
import * as privateMessagesActions from '../../dashboard/state/actions/private.messages.actions';
import {
  getStreamMessages,
  streamsUnread,
} from '../state/entities/messages/stream.messages.entity';
import {
  privateUnreadCounter,
  unreadMessages,
} from '../state/entities/messages/private.messages.entity';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class DashService {
  userId$: Observable<number | undefined> = this.store.select(getUserId);
  unreadMessages$: Observable<SingleMessageModel[]> =
    this.store.select(unreadMessages);
  privateUnreadCounter: Observable<number> =
    this.store.select(privateUnreadCounter);
  streams$: Observable<SubStreamsModel[]> = this.store.select(getStreams);

  userId: any;
  constructor(
    private http: HttpClient,
    private store: Store,
    private titleService: Title
  ) {}

  onInitHandler(): void {
    this.store.dispatch(new streamActions.LoadSubStreams());
    this.store.dispatch(new userActions.LoadZulipUsers());
    this.store.dispatch(new userActions.LoadPresentUsers());
    this.store.dispatch(new authActions.CurrentUserProfile());
    this.setUserId();

    this.streamsLoaded();
    setTimeout(() => {
      this.unreadMessageCounter();
      this.getPrivateMessages();
      this.streamUnreadCounter();
    }, 3000);
  }

  setUserId(): void {
    this.userId$.subscribe({
      next: (userId) => {
        if (userId) {
          this.userId = userId;
        }
      },
    });
  }

  streamsLoaded(): void {
    this.store.select(getStreamsLoaded).subscribe({
      next: (status: boolean) => {
        if (status) {
          // Actions
          this.getStreamTopic();
          this.getStreamMessages();
          // setTimeout(() => {
          //   this.getStreamSubscribers();
          // }, 1000);
        }
      },
    });
  }

  getAllStreams(): Observable<AllStreamsResponseModel> {
    const payload = {
      include_public: true,
      include_subscribed: true,
      include_all_active: false,
      include_default: false,
      include_owner_subscribed: false,
    };
    return this.http.post<AllStreamsResponseModel>(env.allStreams, payload);
  }

  getStreamTopic(): void {
    this.store.select(getStreamsId).subscribe({
      next: (streamIds) => {
        streamIds.map((streamId) => {
          this.streamTopics(streamId).subscribe({
            next: (response: any) => {
              this.store.dispatch(new streamActions.LoadTopics(response));
            },
          });
        });
      },
    });
  }

  getStreamSubscribers(): void {
    this.store.select(getStreams).subscribe({
      next: (streams) => {
        streams.map((stream) => {
          this.streamSubscribers(stream.name).subscribe({
            next: (response) => {
              const content = {
                streamId: stream.stream_id,
                subscribers: response,
              };
              // this.store.dispatch(new streamActions.StreamSubscribers(content));
            },
          });
        });
      },
    });
  }

  getStreamMessages(): void {
    const payload1 = {
      // Captures both for streams and private messages
      anchor: 'first_unread',
      num_before: 200,
      num_after: 200,
      narrow: [],
      client_gravatar: true,
    };

    const payload2 = {
      anchor: 'newest',
      num_before: 400,
      num_after: 0,
      narrow: [
        {
          negated: false,
          operator: 'in',
          operand: 'home',
        },
      ],
      client_gravatar: true,
    };

    const payload3 = {
      anchor: 'first_unread',
      num_before: 400,
      num_after: 0,
      narrow: [
        {
          negated: false,
          operator: 'streams',
          operand: 'public',
        },
      ],
      client_gravatar: true,
    };

    this.store.dispatch(new streamMessagesActions.LoadStreamMsg(payload1));
    // this.store.dispatch(new streamMessagesActions.LoadStreamMsg(payload2));
    // this.store.dispatch(new streamMessagesActions.LoadStreamMsg(payload3));
    // this.store.dispatch(new msgActions.LoadMessage(request2));
    // this.store.dispatch(new msgActions.LoadMessage(request3));
    // this.store.dispatch(new msgActions.LoadMessage(request4));
  }

  getPrivateMessages(): void {
    this.userId$.subscribe({
      next: (id) => {
        const payload1 = {
          anchor: 'first_unread',
          num_before: 100,
          num_after: 100,
          narrow: [
            {
              negated: false,
              operator: 'is',
              operand: 'private',
            },
          ],
        };

        const payload2 = {
          anchor: 'first_unread',
          num_before: 100,
          num_after: 100,
          narrow: [],
          client_gravatar: true,
        };

        // this.store.dispatch(
        //   new privateMessagesActions.LoadPrivateMsg(payload1)
        // );
        this.store.dispatch(
          new privateMessagesActions.LoadPrivateMsg(payload2)
        );
      },
    });
  }

  unreadMessageCounter(): void {
    this.privateUnreadCounter.subscribe({
      next: (unreadCount) => {
        if (unreadCount > 0) {
          this.titleService.setTitle(`(${unreadCount}) - AVL - Oona`);
        } else {
          this.titleService.setTitle(`AVL - Oona`);
        }
      },
    });
  }

  streamUnreadCounter(): void {
    this.unreadMessages$.subscribe({
      next: (messages) => {
        messages.map((message) => {
          if (message.type === 'stream') {
            setTimeout(() => {
              this.updateStreamCounter(message);
            }, 1500);
          }
        });
      },
    });
  }

  updateStreamCounter(message: SingleMessageModel): void {
    this.streams$.subscribe({
      next: (streams) => {
        streams.map((stream) => {
          stream = {
            ...stream,
            unread: 0,
          };
          if (stream.stream_id === message.stream_id) {
            stream.unread += 1;
            // console.log('Stream to be updated ==>>', stream);
            // console.log('Message content ==>>', message);
            // this.store.dispatch(new streamActions.UpdateStreamCounter(stream));

            // stream.topic?.map((topic) => {
            //   if (topic.name === topicName) {
            //     // dispatch update topic counter
            //     this.store.dispatch(
            //       new streamActions.UpdateTopicCounter({
            //         stream_id: streamId,
            //         topic: topicName,
            //       })
            //     );
            //   }
            // });
          }
        });
      },
    });
  }

  subStreams(): Observable<SubStreamsResponseModel> {
    return this.http.get<SubStreamsResponseModel>(env.subscribedStream);
  }

  streamTopics(streamId: number | string): Observable<TopicResponseModel> {
    return this.http.get<TopicResponseModel>(env.getStreamTopics + streamId);
  }

  presentUsers(): Observable<PersonResponseModel> {
    return this.http.get<PersonResponseModel>(env.presentUsers);
  }

  zulipUsers(): Observable<PersonResponseModel> {
    return this.http.get<PersonResponseModel>(env.zulipUsers);
  }

  streamSubscribers(
    streamName: string | number
  ): Observable<SubscribersResponseModel> {
    return this.http.post<SubscribersResponseModel>(env.streamSubscribers, {
      stream_name: streamName,
    });
  }

  streamMessages(body: any): Observable<MessagesResponseModel> {
    return this.http.post<MessagesResponseModel>(env.individualMessage, body);
  }

  streamSubStatus(streamId: number): Observable<any> {
    return this.http.post(env.subscribeSubStatus, { stream_id: streamId });
  }

  streamSubscribe(stream: any): Observable<any> {
    return this.http.post(env.subscribeToStream, stream);
  }

  updateStream(updatedContent: any): Observable<any> {
    return this.http.post(env.updateStream, updatedContent);
  }

  updateStreamSubscription(updateContent: any): Observable<any> {
    return this.http.post(env.updateSubscriptionSettings, updateContent);
  }

  unsubscribeStream(
    stream: any
  ): Observable<{ result: string; msg: string; removed: string[] }> {
    return this.http.post<{ result: string; msg: string; removed: string[] }>(
      env.unsubscribeToStream,
      stream
    );
  }

  updateMessageFlags(
    updateContent: any
  ): Observable<{ result: string; msg: string; messages: number[] }> {
    return this.http.post<{ result: string; msg: string; messages: number[] }>(
      env.updatePersonalMessageFlag,
      updateContent
    );
  }

  getMessages(payload: MessagePayloadModel): Observable<MessagesResponseModel> {
    return this.http.post<MessagesResponseModel>(env.getMessages, payload);
  }

  createMessage(payload: any): Observable<any> {
    return this.http.post('', '');
  }
}
