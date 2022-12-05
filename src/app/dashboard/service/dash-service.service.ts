import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { environment as env } from '../../../environments/environment';
import {
  AllStreamsResponseModel,
  StreamsResponseModel,
  SubscribersResponseModel,
  SubStreamsModel,
  SubStreamsResponseModel
} from '../models/streams.model';

// NgRx
import {Store} from '@ngrx/store';
import {PersonResponseModel} from '../models/person.model';
import * as streamActions from '../state/actions/streams.actions';
import * as userActions from '../state/actions/users.actions';
import {TopicResponseModel} from '../models/topics.model';
import {getStreams, getStreamsId, getStreamsLoaded} from '../state/entities/streams.entity';
import {MessagesResponseModel} from '../models/messages.model';
import * as authActions from '../../auth/state/auth.actions';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashService {

  constructor(
    private http: HttpClient,
    private store: Store
  ) { }

  onInitHandler(): void {
    this.store.dispatch(new streamActions.LoadSubStreams());
    this.store.dispatch(new userActions.LoadZulipUsers());
    this.store.dispatch(new userActions.LoadPresentUsers());
    this.store.dispatch(new authActions.CurrentUserProfile());

    this.streamsLoaded();
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
      }
    });
  }

  getAllStreams(): Observable<AllStreamsResponseModel> {
    const payload = {
      include_public: true,
      include_subscribed: true,
      include_all_active: false,
      include_default: false,
      include_owner_subscribed: false
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
            }
          });
        });
      }
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
                subscribers: response
              };
              // this.store.dispatch(new streamActions.StreamSubscribers(content));
            }
          });
        });
      }
    });
  }

  getStreamMessages(): void {

    const request1 = {
      anchor: 'first_unread',
      num_before: 200,
      num_after: 200,
      client_gravatar: true
    };

    const request2 = {
      anchor: 'newest',
      num_before: 400,
      num_after: 0,
      narrow: [{
        negated: false,
        operator: 'in',
        operand: 'home'
      }],
      client_gravatar: true
    };

    const request3 = {
      anchor: 'first_unread',
      num_before: 100,
      num_after: 100,
      narrow: [{
        negated: false,
        operator: 'pm-with',
        // Todo change to current logged in user id
        operand: [10]
      }],
      client_gravatar: true
    };

    const request4 = {
      anchor: 'first_unread',
      num_before: 400,
      num_after: 0,
      narrow: [{
        negated: false,
        operator: 'streams',
        operand: 'public'
      }],
      client_gravatar: true
    };

    // this.store.dispatch(new msgActions.LoadMessage(request2));
    // this.store.dispatch(new msgActions.LoadMessage(request3));
    // this.store.dispatch(new msgActions.LoadMessage(request4));
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

  streamSubscribers(streamName: string | number): Observable<SubscribersResponseModel> {
    return this.http.post<SubscribersResponseModel>(env.streamSubscribers, {stream_name: streamName});
  }

  streamMessages(body: any): Observable<MessagesResponseModel> {
    return this.http.post<MessagesResponseModel>(env.individualMessage, body);
  }
}
