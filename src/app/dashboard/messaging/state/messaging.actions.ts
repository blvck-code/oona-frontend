import { Action } from '@ngrx/store';
import { TopicsModel } from '../models/topics.model';
import { MessagesModel } from '../models/messages.model';
import { StreamDataModel } from '../models/streamData.model';

export enum MessagingActionsTypes {
  // Create new private message
  CREATE_PRIVATE_MESSAGE = 'messaging/createPrivateMessage',
  CREATE_PRIVATE_MESSAGE_SUCCESS = 'messaging/createPrivateMessageSuccess',
  CREATE_PRIVATE_MESSAGE_FAIL = 'messaging/createPrivateMessageFail',

  // Create stream message
  CREATE_STREAM_MESSAGE = 'messaging/createStreamMessage',
  CREATE_STREAM_MESSAGE_SUCCESS = 'messaging/createStreamMessageSuccess',
  CREATE_STREAM_MESSAGE_FAIL = 'messaging/createStreamMessageFail',


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

  // PRIVATE MESSAGES
  LOAD_STREAM_MESSAGES = 'messaging/loadStreamMessages',
  LOAD_STREAM_MESSAGE_SUCCESS = 'messaging/loadStreamMessagesSuccess',
  LOAD_STREAM_MESSAGES_FAIL = 'messaging/loadStreamMessagesFail',

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

  HANDLE_STREAM_DATA = 'messaging/updateStreamData',

  // CURRENT USER PRIVATE MESSAGE
  LOAD_CURRENT_USER = 'messaging/loadPrivateUser',
  LOAD_CURRENT_USER_SUCCESS = 'messaging/loadPrivateUserSuccess',
  LOAD_CURRENT_USER_FAIL = 'messaging/loadPrivateUserFail',

  // HANDLE SEND MESSAGE
  HANDLE_SEND_MESSAGE = 'messaging/handleSendMessage',

  // FILTER MESSAGES
  FILTER_MESSAGES = 'messaging/filterMessages',
  HANDLE_UNREAD_MESSAGE = 'messaging/handleUnreadMessage',
  SELECTED_STREAM_ID = 'messaging/selectedStreamId',
  SELECTED_USER_ID = 'messaging/selectedUserId',

  LOAD_MORE_STREAM_MESSAGE = 'messaging/loadMore',
  LOAD_MORE_STREAM_MESSAGE_SUCCESS = 'messaging/loadMoreSuccess',
  LOAD_MORE_STREAM_MESSAGE_FAIL = 'messaging/loadMoreFail',

  UPDATE_READ_MESSAGE = 'messaging/updateReadMessage',
  UPDATE_READ_MESSAGE_SUCCESS = 'messaging/updateReadMessageSuccess',
  UPDATE_READ_MESSAGE_FAIL = 'messaging/updateReadMessageFail',

  UPDATE_MESSAGE_COUNTER = 'messaging/updateMessageCounter'
}

// CREATE PRIVATE MESSAGE
export class CreatePrivateMessage implements Action {
  readonly type = MessagingActionsTypes.CREATE_PRIVATE_MESSAGE;
  constructor(public payload: any) {
  }
}

export class CreatePrivateMessageSuccess implements Action {
  readonly type = MessagingActionsTypes.CREATE_PRIVATE_MESSAGE_SUCCESS;
  constructor(
    public payload: any,
  ) {
    console.log('New socket message for store ==>>>', payload);
  }
}

export class CreatePrivateMessageFail implements Action {
  readonly type = MessagingActionsTypes.CREATE_PRIVATE_MESSAGE_FAIL;
  constructor(public payload: any) {
    console.log('Send message fail ===>>', payload);
  }
}

export class CreateStreamMessage implements Action {
  readonly type = MessagingActionsTypes.CREATE_STREAM_MESSAGE;
  constructor(public payload: any) {
  }
}

export class CreateStreamMessageSuccess implements Action {
  readonly type = MessagingActionsTypes.CREATE_STREAM_MESSAGE_SUCCESS;
  constructor(
    public payload: any,
  ) {
  }
}

export class CreateStreamMessageFail implements Action {
  readonly type = MessagingActionsTypes.CREATE_STREAM_MESSAGE_FAIL;
  constructor(public payload: any) {
  }
}

// LOAD MESSAGES ACTIONS
export class LoadMessaging implements Action {
  readonly type = MessagingActionsTypes.LOAD_MESSAGES;
  constructor(public payload: any) {
    // console.log('Load messages ===>>>', payload);
  }
}
export class LoadMessagingSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_MESSAGES_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadMessagingFail implements Action {
  readonly type = MessagingActionsTypes.LOAD_MESSAGES_FAIL;
  constructor(public payload: any) {}
}
export class FilterMessages implements Action {
  readonly type = MessagingActionsTypes.FILTER_MESSAGES;
  constructor(public payload: any) {}
}

// LOAD MORE MESSAGES
export class LoadMoreMessaging implements Action {
  readonly type = MessagingActionsTypes.LOAD_MORE_MESSAGE;
  constructor(public payload: any) {
    // console.log('Loaded more messages ==>>>', payload);
  }
}
export class LoadMoreMessagingSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_MORE_MESSAGE_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadMoreMessagingFail implements Action {
  readonly type = MessagingActionsTypes.LOAD_MORE_MESSAGE_FAIL;
  constructor(public payload: any) {}
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
    // console.log('Loading all messages fail ===>>>', payload);
  }
}

export class LoadStreamMessage implements Action {
  readonly type = MessagingActionsTypes.LOAD_STREAM_MESSAGES;
  constructor(public payload: any) {}
}

export class LoadStreamMessageSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_STREAM_MESSAGE_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadStreamMessageFail implements Action {
  readonly type = MessagingActionsTypes.LOAD_STREAM_MESSAGES_FAIL;
  constructor(public payload: any) {
    console.log('Load stream messages fail =>', payload);
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
    // console.log('Loading private messages fail ===>>>', payload);
  }
}

// STREAM DATA
export class LoadStreamData implements Action {
  readonly type = MessagingActionsTypes.LOAD_STREAM_DATA;
  constructor(public payload: any) {
    // console.log('Stream data details ===>>>', payload);
  }
}
export class LoadStreamDataSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_STREAM_DATA_SUCCESS;
  constructor(public payload: any) {
    // console.log('Payload stream data success ====>>>', payload);
  }
}
export class LoadStreamDataFail implements Action {
  readonly type = MessagingActionsTypes.LOAD_STREAM_DATA_FAIL;
  constructor(public payload: StreamDataModel) {
    // console.log('Loading stream data fail ===>>>', payload);
  }
}

export class HandleStreamData implements Action {
  readonly type = MessagingActionsTypes.HANDLE_STREAM_DATA;
  constructor(public payload: any) {}
}


// ALL STREAMS ACTIONS
export class LoadAllStreams implements Action {
  readonly type = MessagingActionsTypes.LOAD_ALL_STREAMS;
  constructor() {}
}
export class LoadAllStreamsSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_ALL_STREAMS_SUCCESS;
  constructor(public payload: any) {}
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
  constructor(public payload: TopicsModel) {
    console.log('Topics ', payload);
  }
}
export class LoadStreamTopicFail implements Action {
  readonly type = MessagingActionsTypes.LOAD_STREAM_TOPIC_FAIL;
  constructor(public payload: any) {}
}

// CURRENT USER PRIVATE MESSAGE
export class LoadCurrentPrivateUser implements Action {
  readonly type = MessagingActionsTypes.LOAD_CURRENT_USER;
  constructor(public payload: any) {}
}
export class LoadCurrentPrivateUserSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_CURRENT_USER_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadCurrentPrivateUserFail implements Action {
  readonly type = MessagingActionsTypes.LOAD_CURRENT_USER_FAIL;
  constructor(public payload: any) {
    // console.log('Load private user failed ==>>>', payload);
  }
}

export class HandleUnreadMessage implements Action {
  readonly type = MessagingActionsTypes.HANDLE_UNREAD_MESSAGE;
  constructor(public payload: any) {
  }
}

export class HandleSendMessage implements Action {
  readonly type = MessagingActionsTypes.HANDLE_SEND_MESSAGE;
  constructor(public payload: any) {
  }
}

export class UpdateReadMessage implements Action {
  readonly type = MessagingActionsTypes.UPDATE_READ_MESSAGE;
  constructor(public payload: any) {
    console.log('Updating msg read =>', payload);
  }
}

export class UpdateReadMessageSuccess implements Action {
  readonly type = MessagingActionsTypes.UPDATE_READ_MESSAGE_SUCCESS;
  constructor(public payload: any) {
    console.log('Updated success =>', payload);
  }
}

export class UpdateReadMessageFail implements Action {
  readonly type = MessagingActionsTypes.UPDATE_READ_MESSAGE_FAIL;
  constructor(public payload: any) {}
}

export class UpdateMessageCounter implements Action {
  readonly type = MessagingActionsTypes.UPDATE_MESSAGE_COUNTER;
  constructor(public payload: { messageType: string, type: string}) {
  }
}

export class SelectedStreamId implements Action {
  readonly type = MessagingActionsTypes.SELECTED_STREAM_ID;
  constructor(public payload: any) {
  }
}

export class SelectedUserId implements Action {
  readonly type = MessagingActionsTypes.SELECTED_USER_ID;
  constructor(public payload: any) {
    console.log('Show me payload =>', payload);
  }
}

// More stream messages
// @ts-ignore
export class LoadMoreStreams implements Action {
  readonly type = MessagingActionsTypes.LOAD_MORE_STREAM_MESSAGE;
  constructor(public payload: any) {
    console.log('More stream payload =>', payload);
  }
}

// @ts-ignore
export class LoadMoreStreamsSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_MORE_STREAM_MESSAGE_SUCCESS;
  constructor(public payload: any) {
    console.log('More streams success =>', payload);
  }
}

// @ts-ignore
export class LoadMoreStreamsFail implements Action {
  readonly type = MessagingActionsTypes.LOAD_MORE_STREAM_MESSAGE_FAIL;
  constructor(public payload: any) {
    console.log('More streams fail =>', payload);
  }
}

// @ts-ignore
export type MessagingActions =
  // CREATE PRIVATE MESSAGE
  | CreatePrivateMessage
  | CreatePrivateMessageSuccess
  | CreatePrivateMessageFail
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
  | LoadStreamDataFail
  | HandleStreamData
  | HandleUnreadMessage

  | LoadStreamMessage
  | LoadStreamMessageSuccess
  // Update message flag
  | UpdateReadMessage
  | UpdateReadMessageSuccess
  | UpdateReadMessageFail
  | SelectedStreamId
  | SelectedUserId
  // Load more streams
  | LoadMoreStreams
  | LoadMoreStreamsSuccess
  | LoadMoreStreamsFail
  // Create stream message
  | CreateStreamMessage
  | CreateStreamMessageSuccess
  | CreateStreamMessageFail;
