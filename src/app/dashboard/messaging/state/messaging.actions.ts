import { Action } from '@ngrx/store';
import { TopicsModel } from '../models/topics.model';
import { MessagesModel } from '../models/messages.model';
import {StreamDataModel} from '../models/streamData.model';

export enum MessagingActionsTypes {
  // GET MESSAGES
  LOAD_MESSAGES = 'messaging/loadMessages',
  LOAD_MESSAGES_SUCCESS = 'messaging/loadMessagesSuccess',
  LOAD_MESSAGES_FAIL = 'messaging/loadMessagesFail',

  // All MESSAGES
  LOAD_ALL_MESSAGES = 'messaging/loadAllMessages',
  LOAD_ALL_MESSAGES_SUCCESS = 'messaging/loadAllMessagesSuccess',
  LOAD_ALL_MESSAGES_FAIL = 'messaging/loadAllMessagesFail',

  // PRIVATE MESSAGES
  LOAD_PRIVATE_MESSAGES = 'messaging/loadPrivateMessages',
  LOAD_PRIVATE_MESSAGE_SUCCESS = 'messaging/loadPrivateMessagesSuccess',
  LOAD_PRIVATE_MESSAGES_FAIL = 'messaging/loadPrivateMessagesFail',

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

  // STREAM DATA
  LOAD_STREAM_DATA = 'messaging/loadStreamData',
  LOAD_STREAM_DATA_SUCCESS = 'messaging/loadStreamDataSuccess',
  LOAD_STREAM_DATA_FAIL = 'messaging/loadStreamDataFail',

  // CURRENT USER PRIVATE MESSAGE
  LOAD_CURRENT_USER = 'messaging/loadPrivateUser',
  LOAD_CURRENT_USER_SUCCESS = 'messaging/loadPrivateUserSuccess',
  LOAD_CURRENT_USER_FAIL = 'messaging/loadPrivateUserFail',

  // HANDLE SEND MESSAGE
  HANDLE_SEND_MESSAGE = 'messaging/handleSendMessage',

  // FILTER MESSAGES
  FILTER_MESSAGES = 'messaging/filterMessages'

}

// LOAD MESSAGES ACTIONS
export class LoadMessaging implements Action {
  readonly type = MessagingActionsTypes.LOAD_MESSAGES;
  constructor(public payload: any) {
    console.log('Load messages ===>>>', payload);
  }
}
export class LoadMessagingSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_MESSAGES_SUCCESS;
  constructor(public payload: any) {
  }
}
export class LoadMessagingFail implements Action {
  readonly type = MessagingActionsTypes.LOAD_MESSAGES_FAIL;
  constructor(public payload: any) {
  }
}
export class FilterMessages implements Action {
  readonly type = MessagingActionsTypes.FILTER_MESSAGES;
  constructor(public payload: any) {
  }
}

// LOAD MORE MESSAGES
export class LoadMoreMessaging implements Action {
  readonly type = MessagingActionsTypes.LOAD_MORE_MESSAGE;
  constructor(public payload: any) {
    console.log('Loaded more messages ==>>>', payload);
  }
}
export class LoadMoreMessagingSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_MORE_MESSAGE_SUCCESS;
  constructor(public payload: any) {
  }
}
export class LoadMoreMessagingFail implements Action {
  readonly type = MessagingActionsTypes.LOAD_MORE_MESSAGE_FAIL;
  constructor(public payload: any) {
  }
}

// ALL MESSAGES
export class LoadAllMessages implements Action {
  readonly type = MessagingActionsTypes.LOAD_ALL_MESSAGES;
  constructor(public payload: any) {
  }
}
export class LoadAllMessagesSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_ALL_MESSAGES_SUCCESS;
  constructor(public payload: any) {
  }
}
export class LoadAllMessagesFail implements Action {
  readonly type = MessagingActionsTypes.LOAD_ALL_MESSAGES_FAIL;
  constructor(public payload: any) {
    console.log('Loading all messages fail ===>>>', payload);
  }
}

// PRIVATE MESSAGES
export class LoadPrivateMessages implements Action {
  readonly type = MessagingActionsTypes.LOAD_PRIVATE_MESSAGES;
  constructor(public payload: any) {
  }
}
export class LoadPrivateMessagesSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_PRIVATE_MESSAGE_SUCCESS;
  constructor(public payload: MessagesModel) {
  }
}
export class LoadPrivateMessagesFail implements Action {
  readonly type = MessagingActionsTypes.LOAD_PRIVATE_MESSAGES_FAIL;
  constructor(public payload: any) {
    console.log('Loading private messages fail ===>>>', payload);
  }
}

// STREAM DATA
export class LoadStreamData implements Action {
  readonly type = MessagingActionsTypes.LOAD_STREAM_DATA;
  constructor(public payload: any) {
    console.log('Stream data details ===>>>', payload)
  }
}
export class LoadStreamDataSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_STREAM_DATA_SUCCESS;
  constructor(public payload: any) {
    console.log('Payload stream data success ====>>>', payload);
  }
}
export class LoadStreamDataFail implements Action {
  readonly type = MessagingActionsTypes.LOAD_STREAM_DATA_FAIL;
  constructor(public payload: StreamDataModel) {
    console.log('Loading stream data fail ===>>>', payload);
  }
}

// ALL STREAMS ACTIONS
export class LoadAllStreams implements Action {
  readonly type = MessagingActionsTypes.LOAD_ALL_STREAMS;
  constructor() {
  }
}
export class LoadAllStreamsSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_ALL_STREAMS_SUCCESS;
  constructor(public payload: any) {
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

// CURRENT USER PRIVATE MESSAGE
export class LoadCurrentPrivateUser implements Action {
  readonly type = MessagingActionsTypes.LOAD_CURRENT_USER;
  constructor(public payload: any) {
  }
}
export class LoadCurrentPrivateUserSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_CURRENT_USER_SUCCESS;
  constructor(public payload: any) {
  }
}
export class LoadCurrentPrivateUserFail implements Action {
  readonly type = MessagingActionsTypes.LOAD_CURRENT_USER_FAIL;
  constructor(public payload: any) {
    console.log('Load private user failed ==>>>', payload);
  }
}

export class HandleSendMessage implements Action {
  readonly type = MessagingActionsTypes.HANDLE_SEND_MESSAGE;
  constructor(public payload: any) {
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
  | LoadCurrentPrivateUserFail
  // HANDLE SEND MESSAGE
  | HandleSendMessage
  // LOAD ALL MESSAGE
  | LoadAllMessages
  | LoadAllMessagesSuccess
  | LoadAllMessagesFail
  | FilterMessages
  // LOAD PRIVATE MESSAGE
   | LoadPrivateMessages
   | LoadPrivateMessagesSuccess
   | LoadPrivateMessagesFail
  // LOAD STREAM DATA
  | LoadStreamData
  | LoadStreamDataSuccess
  | LoadStreamDataFail;
