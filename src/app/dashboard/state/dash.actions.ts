export enum DashActions {
  // SUBSCRIBED STREAMS
  LOAD_SUB_STREAMS = 'dash/loadSubStreams',
  LOAD_SUB_STREAMS_SUCCESS = 'dash/loadSubStreamsSuccess',
  LOAD_SUB_STREAMS_FAIL = 'dash/loadSubStreamsFail',

  // Update Counter
  UPDATE_STREAM_COUNTER = 'dash/updateStreamCounter',
  UPDATE_TOPIC_COUNTER = 'dash/updateTopicCounter',

  // Create Stream
  CREATE_STREAM = 'dash/createStream',

  // Selected stream
  SELECTED_STREAM = 'dash/selectedStream',
  SELECTED_TOPIC = 'dash/selectedTopic',

  // Selected User
  SELECTED_USER = 'dash/selectedUser',

  // Stream Subscribers
  LOAD_SUBSCRIBERS = 'dash/loadSubscribers',
  LOAD_SUBSCRIBERS_SUCCESS = 'dash/loadSubscribersSuccess',
  LOAD_SUBSCRIBERS_FAIL = 'dash/loadSubscribersFail',
  STREAM_SUBSCRIBERS = 'dash/Subscribers',

  // Stream Topics
  LOAD_TOPICS = 'dash/loadTopics',

  // Present Users
  LOAD_PRESENT_USERS = 'dash/loadPresentUsers',
  LOAD_PRESENT_USERS_SUCCESS = 'dash/loadPresentUsersSuccess',
  LOAD_PRESENT_USERS_FAIL = 'dash/loadPresentUsersFail',

  // Zulip Users
  LOAD_ZULIP_USERS = 'dash/loadZulipUsers',
  LOAD_ZULIP_USERS_SUCCESS = 'dash/loadZulipUsersSuccess',
  LOAD_ZULIP_USERS_FAIL = 'dash/loadZulipUsersFail',

  // Private messages
  LOAD_PRIVATE_MESSAGE = 'dash/loadPrivateMsg',
  LOAD_PRIVATE_MESSAGE_SUCCESS = 'dash/loadPrivateMsgSuccess',
  LOAD_PRIVATE_MESSAGE_FAIL = 'dash/loadPrivateMsgFail',

  // Stream messages
  LOAD_STREAM_MESSAGE = 'dash/loadStreamMsg',
  LOAD_STREAM_MESSAGE_SUCCESS = 'dash/loadStreamMsgSuccess',
  LOAD_STREAM_MESSAGE_FAIL = 'dash/loadStreamMsgFail',

  // Create Stream Message
  CREATE_STREAM_MESSAGE = 'dash/createStreamMessage',
  CREATE_STREAM_MESSAGE_SUCCESS = 'dash/createStreamMessageSuccess',
  CREATE_STREAM_MESSAGE_FAIL = 'dash/createStreamMessageFail',

  // Socket Stream Message
  SOCKET_STREAM_MESSAGE = 'dash/socketStreamMessage',
  SOCKET_PRIVATE_MESSAGE = 'dash/socketPrivateMessage',
}
