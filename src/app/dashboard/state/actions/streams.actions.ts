import {Action} from '@ngrx/store';
import { DashActions } from '../dash.actions';
import { SubStreamsResponseModel} from '../../models/streams.model';
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


export type StreamActions =
  // Sub Streams
  | LoadSubStreams
  | LoadSubStreamsSuccess
  | LoadSubStreamsFail
  // Topics
  | LoadTopics;
