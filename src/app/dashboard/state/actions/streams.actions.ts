import {Action} from '@ngrx/store';
import { DashActions } from '../dash.actions';
import {SubscribersResponseModel, SubStreamsResponseModel} from '../../models/streams.model';
import {TopicResponseModel} from '../../models/topics.model';

// Subscribed Streams
export class LoadSubStreams implements Action {
  readonly type = DashActions.LOAD_SUB_STREAMS;
  constructor() {}
}
export class LoadSubStreamsSuccess implements Action {
  readonly type = DashActions.LOAD_SUB_STREAMS_SUCCESS;
  constructor(public payload: SubStreamsResponseModel) {}
}
export class LoadSubStreamsFail implements Action {
  readonly type = DashActions.LOAD_SUB_STREAMS_FAIL;
  constructor(public payload: any) {}
}
// Load Topics
export class LoadTopics implements Action {
  readonly type = DashActions.LOAD_TOPICS;
  constructor(public payload: TopicResponseModel) {
  }
}
// Selected stream
export class SelectedStream implements Action {
  readonly type = DashActions.SELECTED_STREAM;
  constructor(public payload: any) {
  }
}
export class SelectedTopic implements Action {
  readonly type = DashActions.SELECTED_TOPIC;
  constructor(public payload: string) {
  }
}
// Stream subscribers
export class StreamSubscribers implements Action {
  readonly type = DashActions.STREAM_SUBSCRIBERS;
  constructor(public payload: any) {
  }
}
export class LoadSubscribers implements Action {
  readonly type = DashActions.LOAD_SUBSCRIBERS;
  constructor(public streamName: string, public streamId: string | number) {
  }
}
export class LoadSubscribersSuccess implements Action {
  readonly type = DashActions.LOAD_SUBSCRIBERS_SUCCESS;
  constructor(public payload: any) {
    console.log('Subscribers ==>>', payload);
  }
}
export class LoadSubscribersFail implements Action {
  readonly type = DashActions.LOAD_SUBSCRIBERS_FAIL;
  constructor(public payload: any) {
  }
}



export type StreamActions =
  // Sub Streams
  | LoadSubStreams
  | LoadSubStreamsSuccess
  | LoadSubStreamsFail
  // Topics
  | LoadTopics
  // Stream subscribers
  | StreamSubscribers
  | LoadSubscribers
  | LoadSubscribersSuccess
  | LoadSubscribersFail
  // Selected stream / topic
  | SelectedStream
  | SelectedTopic;
