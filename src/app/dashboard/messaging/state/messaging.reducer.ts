import * as messagingActions from './messaging.actions';
import { AllStreamsModel, SubscribedStreams } from '../models/streams.model';
import { All } from '@ngrx/store-devtools/src/actions';
import { MessagesModel, SingleMessageModel } from '../models/messages.model';
import { TopicsModel } from '../models/topics.model';
import { CurrentUserModel } from '../models/currentUser.model';
import { act } from '@ngrx/effects';

export interface MessagingState {
  loading: boolean;
  streams: {
    allStreams: AllStreamsModel[] | any;
    streamData: AllStreamsModel[] | any;
    subStreams: SubscribedStreams[];
    topics: any;
  };
  currentUser: CurrentUserModel | null;
  msgReceiver: any;
  messaging: {
    loading: boolean;
    allMessages: {
      loading: boolean;
      messages: MessagesModel | null;
    };
    privateMsgs: {
      loading: boolean;
      filteredMsg: MessagesModel | null;
      messages: MessagesModel | null;
    };
    selectedStreamMsg: {
      loading: boolean;
      messages: SingleMessageModel[] | undefined | null;
    };
  };
}

export const initialState: MessagingState = {
  loading: false,
  streams: {
    allStreams: [],
    streamData: [],
    subStreams: [],
    topics: [],
  },
  currentUser: null,
  msgReceiver: null,
  messaging: {
    loading: false,
    allMessages: {
      loading: true,
      messages: null,
    },
    privateMsgs: {
      loading: false,
      filteredMsg: null,
      messages: null,
    },
    selectedStreamMsg: {
      loading: false,
      messages: null,
    },
  },
};

const addTopicToStream = (payload: any) => {
  const stream_id = payload?.oz?.stream_id;
  const content = [...payload?.zulip?.topics];

  const topics = {
    stream_id: {
      content,
    },
  };

  return topics;
};

const filterMessages = (payload: any, state: MessagingState) => {

  const messages = state.messaging.allMessages.messages?.zulip.messages;
  const streamId = payload.streamId;
  const topic = payload.topicName;
  let filteredMsg: SingleMessageModel[] | undefined = [];

  if (topic) {
    const unfilteredMsg = messages?.filter(msg => msg.stream_id === +streamId);
    filteredMsg = unfilteredMsg?.filter(msg => msg.subject === topic);
  } else {
    filteredMsg = messages?.filter(msg => msg.stream_id === +streamId);
  }
  return filteredMsg;

};

const sortMsg = (payload: any) => {
  const messages = payload.zulip.messages;
  // const sortedMsg = messages?.sort((a: any, b: any) => a.timestamp - b.timestamp);

  console.log('Payload content ===>>', messages);
};

export function messagingReducer(
  state = initialState,
  action: any
): MessagingState {
  switch (action.type) {
    case messagingActions.MessagingActionsTypes.LOAD_ALL_STREAMS:
    case messagingActions.MessagingActionsTypes.LOAD_SUB_STREAMS:
      return {
        ...state,
        loading: true,
      };
    case messagingActions.MessagingActionsTypes.LOAD_STREAM_TOPIC_FAIL:
    case messagingActions.MessagingActionsTypes.LOAD_SUB_STREAMS_FAIL:
    case messagingActions.MessagingActionsTypes.LOAD_ALL_STREAMS_FAIL:
      return {
        ...state,
        loading: false,
      };
    case messagingActions.MessagingActionsTypes.LOAD_ALL_STREAMS_SUCCESS:
      return {
        ...state,
        loading: false,
        streams: {
          ...state.streams,
          allStreams: action?.payload?.streams,
        },
      };
    case messagingActions.MessagingActionsTypes.LOAD_SUB_STREAMS_SUCCESS:
      return {
        ...state,
        loading: false,
        streams: {
          ...state.streams,
          subStreams: action?.payload?.subscriptions,
        },
      };
    // ALL MESSAGES
    case messagingActions.MessagingActionsTypes.LOAD_ALL_MESSAGES_SUCCESS:
      return {
        ...state,
        messaging: {
          ...state.messaging,
          allMessages: {
            loading: false,
            messages: action.payload,
          },
        },
      };
    case messagingActions.MessagingActionsTypes.LOAD_ALL_MESSAGES_FAIL:
      return {
        ...state,
        messaging: {
          ...state.messaging,
          allMessages: {
            loading: false,
            messages: null,
          },
        },
      };
    // PRIVATE MESSAGES
    case messagingActions.MessagingActionsTypes.LOAD_PRIVATE_MESSAGES:
      return {
        ...state,
        messaging: {
          ...state.messaging,
          privateMsgs: {
            ...state.messaging.privateMsgs,
            loading: false,
          },
        },
      };
    case messagingActions.MessagingActionsTypes.LOAD_PRIVATE_MESSAGE_SUCCESS:
      return {
        ...state,
        messaging: {
          ...state.messaging,
          privateMsgs: {
            ...state.messaging.privateMsgs,
            loading: false,
            messages: action.payload,
          },
        },
      };
    case messagingActions.MessagingActionsTypes.LOAD_PRIVATE_MESSAGES_FAIL:
      return {
        ...state,
        messaging: {
          ...state.messaging,
          privateMsgs: {
            ...state.messaging.privateMsgs,
            loading: false,
          },
        },
      };
    // FILTERING MESSAGES
    case messagingActions.MessagingActionsTypes.FILTER_MESSAGES:
      return {
        ...state,
        messaging: {
          ...state.messaging,
          selectedStreamMsg: {
            loading: false,
            messages: filterMessages(action.payload, state)
          }
        },
      };

    case messagingActions.MessagingActionsTypes.LOAD_MORE_MESSAGE:
      return {
        ...state,
        messaging: {
          ...state.messaging,
        },
      };
    case messagingActions.MessagingActionsTypes.LOAD_MESSAGES_FAIL:
      return {
        ...state,
      };
    case messagingActions.MessagingActionsTypes.HANDLE_SEND_MESSAGE:
      return {
        ...state,
        msgReceiver: action.payload,
      };

    // case messagingActions.MessagingActionsTypes.LOAD_STREAM_TOPIC_SUCCESS:
    //
    //   const topicStreamId = action.payload.oz.stream_id;
    //   const updatedStream: any[] = state?.streams?.allStreams.map((stream: AllStreamsModel) => {
    //     // tslint:disable-next-line:no-unused-expression
    //     stream.stream_id === topicStreamId ? stream.topics = action.payload : null;
    //   });
    //
    //   console.log('Target ==>>', updatedStream);
    //   return {
    //     ...state,
    //     streams: {
    //       ...state.streams,
    //       // allStreams: [...state.streams.allStreams, updatedStream]
    //       allStreams: updatedStream
    //       // topics: [...state.streams.topics, addTopicToStream(action.payload)]
    //     }
    //   };

    default:
      return state;
  }
}
