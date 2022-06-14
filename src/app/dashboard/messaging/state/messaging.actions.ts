import { Action } from '@ngrx/store';
import { TopicsModel } from '../models/topics.model';
import { MessagesModel } from '../models/messages.model';

export enum MessagingActionsTypes {
  // GET MESSAGES
  LOAD_MESSAGES = 'messaging/loadMessages',
  LOAD_MESSAGES_SUCCESS = 'messaging/loadMessagesSuccess',
  LOAD_MESSAGES_FAIL = 'messaging/loadMessagesFail',

  // GET MORE MESSAGES
  LOAD_MORE_MESSAGE = 'messaging/loadMore',
  LOAD_MORE_MESSAGE_SUCCESS = 'messaging/loadMoreSuccess',
  LOAD_MORE_MESSAGE_FAIL = 'messaging/loadMoreFail',

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

  // CURRENT USER PRIVATE MESSAGE
  LOAD_CURRENT_USER = 'messaging/loadPrivateUser',
  LOAD_CURRENT_USER_SUCCESS = 'messaging/loadPrivateUserSuccess',
  LOAD_CURRENT_USER_FAIL = 'messaging/loadPrivateUserFail',
}

// LOAD MESSAGES ACTIONS
export class LoadMessaging implements Action {
  readonly type = MessagingActionsTypes.LOAD_MESSAGES;
  constructor(public payload: any) {
    console.log('Stream data ==>>', payload);
  }
}
export class LoadMessagingSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_MESSAGES_SUCCESS;
  constructor(public payload: any) {
    console.log('Message stream response ===>>>', payload);
  }
}
export class LoadMessagingFail implements Action {
  readonly type = MessagingActionsTypes.LOAD_MESSAGES_FAIL;
  constructor(public payload: any) {
    console.log('Message stream error ====>>>', payload);
  }
}

// LOAD MORE MESSAGES
export class LoadMoreMessaging implements Action {
  readonly type = MessagingActionsTypes.LOAD_MORE_MESSAGE;
  constructor(public payload: any) {
    console.log('More Stream data ==>>', payload);
  }
}
export class LoadMoreMessagingSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_MORE_MESSAGE_SUCCESS;
  constructor(public payload: any) {
    console.log('More Message stream response ===>>>', payload);
  }
}
export class LoadMoreMessagingFail implements Action {
  readonly type = MessagingActionsTypes.LOAD_MORE_MESSAGE_FAIL;
  constructor(public payload: any) {
    console.log('More Message stream error ====>>>', payload);
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
  constructor(public payload: any) {}
}

// SUBSCRIBED STREAMS
export class LoadSubStreams implements Action {
  readonly type = MessagingActionsTypes.LOAD_SUB_STREAMS;
  constructor() {}
}
export class LoadSubStreamsSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_SUB_STREAMS_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadSubStreamsFail implements Action {
  readonly type = MessagingActionsTypes.LOAD_SUB_STREAMS_FAIL;
  constructor(public payload: any) {}
}

// STREAM TOPICS
export class LoadStreamTopic implements Action {
  readonly type = MessagingActionsTypes.LOAD_STREAM_TOPIC;
  constructor(public payload: any) {}
}
export class LoadStreamTopicSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_STREAM_TOPIC_SUCCESS;
  constructor(public payload: TopicsModel) {}
}
export class LoadStreamTopicFail implements Action {
  readonly type = MessagingActionsTypes.LOAD_STREAM_TOPIC_FAIL;
  constructor(public payload: any) {}
}

// CURRENT USER PRIVATE MESSAGE
export class LoadCurrentPrivateUser implements Action {
  readonly type = MessagingActionsTypes.LOAD_CURRENT_USER;
  constructor(public payload: any) {
    console.log('Loading current private user ===>>>', payload);
  }
}
export class LoadCurrentPrivateUserSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_CURRENT_USER_SUCCESS;
  constructor(public payload: any) {
    console.log('Loaded private user ===>>>', payload);
  }
}
export class LoadCurrentPrivateUserFail implements Action {
  readonly type = MessagingActionsTypes.LOAD_CURRENT_USER_FAIL;
  constructor(public payload: any) {
    console.log('Load private user failed ==>>>', payload);
  }
}

export type MessagingActions =
  // MESSAGING ACTIONS
  | LoadMessaging
  | LoadMessagingSuccess
  | LoadMessagingFail
  // MORE MESSAGES
  | LoadMoreMessaging
  | LoadMoreMessagingSuccess
  | LoadMoreMessagingFail
  // ALL STREAM ACTIONS
  | LoadAllStreams
  | LoadAllStreamsSuccess
  | LoadAllStreamsFail
  // SUB STREAM ACTION
  | LoadSubStreams
  | LoadSubStreamsSuccess
  | LoadSubStreamsFail
  // STREAM TOPICS
  | LoadStreamTopic
  | LoadStreamTopicSuccess
  | LoadStreamTopicFail
  // LOAD PRIVATE USER
  | LoadCurrentPrivateUser
  | LoadCurrentPrivateUserSuccess
  | LoadCurrentPrivateUserFail;
