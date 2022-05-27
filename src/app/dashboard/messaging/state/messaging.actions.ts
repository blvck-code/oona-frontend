import {Action} from '@ngrx/store';
import {TopicsModel} from '../models/topics.model';


export enum MessagingActionsTypes {
  // GET MESSAGES
  LOAD_MESSAGES = 'messaging/loadMessages',
  LOAD_MESSAGES_SUCCESS = 'messaging/loadMessagesSuccess',
  LOAD_MESSAGES_FAIL = 'messaging/loadMessagesFail',

  // ALL STREAMS
  LOAD_ALL_STREAMS = 'messaging/loadAllStreams',
  LOAD_ALL_STREAMS_SUCCESS = 'messaging/loadAllStreamsSuccess',
  LOAD_ALL_STREAMS_FAIL = 'messaging/loadAllStreamsFail',

  // SUBSCRIBED STREAMS
  LOAD_SUB_STREAMS = 'messaging/loadSubStreams',
  LOAD_SUB_STREAMS_SUCCESS = 'messaging/loadSubStreamsSuccess',
  LOAD_SUB_STREAMS_FAIL = 'messaging/loadSubStreamsFail',

  // STREAM TOPICS
  LOAD_STREAM_TOPIC = 'messaging/loadStreamTopic',
  LOAD_STREAM_TOPIC_SUCCESS = 'messaging/loadStreamTopicSuccess',
  LOAD_STREAM_TOPIC_FAIL = 'messaging/loadStreamTopicFail',
}

// LOAD MESSAGES ACTIONS
export class LoadMessaging implements Action {
  readonly type = MessagingActionsTypes.LOAD_MESSAGES;
  constructor() {
    console.log('Loading messaging');
  }
}

export class LoadMessagingSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_MESSAGES_SUCCESS;
  constructor(public payload: any) {
    console.log('Loading messaging success ===>>>', payload);
  }
}

export class LoadMessagingFail implements Action {
  readonly type = MessagingActionsTypes.LOAD_MESSAGES_FAIL;
  constructor(public payload: any) {
    console.log('Loading messaging fail ====>>>', payload);
  }
}

// ALL STREAMS ACTIONS
export class LoadAllStreams implements Action {
  readonly type = MessagingActionsTypes.LOAD_ALL_STREAMS;
  constructor() {
    console.log('Fetching streams');
  }
}

export class LoadAllStreamsSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_ALL_STREAMS_SUCCESS;
  constructor(public payload: any) {
    console.log('Loaded all streams ====>>>', payload);
  }
}

export class LoadAllStreamsFail implements Action {
  readonly type = MessagingActionsTypes.LOAD_ALL_STREAMS_FAIL;
  constructor(public payload: any) {
  }
}

// SUBSCRIBED STREAMS
export class LoadSubStreams implements Action {
  readonly type = MessagingActionsTypes.LOAD_SUB_STREAMS;
  constructor() {
  }
}

export class LoadSubStreamsSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_SUB_STREAMS_SUCCESS;
  constructor(public payload: any) {
  }
}

export class LoadSubStreamsFail implements Action {
  readonly type = MessagingActionsTypes.LOAD_SUB_STREAMS_FAIL;
  constructor(public payload: any) {
  }
}

// STREAM TOPICS
export class LoadStreamTopic implements Action {
  readonly type = MessagingActionsTypes.LOAD_STREAM_TOPIC;
  constructor(public payload: any) {
  }
}

export class LoadStreamTopicSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_STREAM_TOPIC_SUCCESS;
  constructor(public payload: TopicsModel) {
  }
}
export class LoadStreamTopicFail implements Action {
  readonly type = MessagingActionsTypes.LOAD_STREAM_TOPIC_FAIL;
  constructor(public payload: any) {
  }
}

export type MessagingActions =
  // MESSAGING ACTIONS
  | LoadMessaging
  | LoadMessagingSuccess
  | LoadMessagingFail
  // ALL STREAM ACTIONS
  | LoadAllStreams
  | LoadAllStreamsSuccess
  | LoadAllStreamsFail
  // SUB STREAM ACTION
  |  LoadSubStreams
  |  LoadSubStreamsSuccess
  |  LoadSubStreamsFail
  // STREAM TOPICS
   | LoadStreamTopic
   | LoadStreamTopicSuccess
   | LoadStreamTopicFail;
