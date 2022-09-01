import * as messagingActions from './messaging.actions';
import { AllStreamsModel, SubscribedStreams } from '../models/streams.model';
import { MessagesModel, SingleMessageModel } from '../models/messages.model';
import { CurrentUserModel } from '../models/currentUser.model';

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
    unreadCounter: {
      allCounter: number,
      privateCounter: number,
      streamCounter: number
    },
    allMessages: {
      loading: boolean;
      messages: SingleMessageModel[];
    };
    privateMsgs: {
      loading: boolean;
      filteredMsg: MessagesModel | null;
      messages: SingleMessageModel[];
    };
    streamMsg: {
      loaded: boolean,
      messages: SingleMessageModel[],
    }
    selectedStreamMsg: {
      loading: boolean;
      messages: SingleMessageModel[] | undefined | null;
    };
    unreadMsg: SingleMessageModel[]
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
    unreadCounter: {
      allCounter: 0,
      privateCounter: 0,
      streamCounter: 0
    },
    allMessages: {
      loading: true,
      messages: [],
    },
    privateMsgs: {
      loading: false,
      filteredMsg: null,
      messages: [],
    },
    streamMsg: {
      loaded: false,
      messages: []
    },
    selectedStreamMsg: {
      loading: false,
      messages: null,
    },
    unreadMsg: []
  },
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
    case messagingActions.MessagingActionsTypes.LOAD_STREAM_MESSAGES:
      return {
        ...state,
        messaging: {
          ...state.messaging,
          streamMsg: {
            ...state.messaging.streamMsg,
            loaded: false
          }
        }
      };

    case messagingActions.MessagingActionsTypes.LOAD_STREAM_MESSAGE_SUCCESS:
      const messagesContent = action.payload.zulip.messages;
      return {
        ...state,
        messaging: {
          ...state.messaging,
          streamMsg: {
            loaded: true,
            messages: [...state.messaging.streamMsg.messages, ...messagesContent]
          }
        }
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
      let msgId: any[] = [];
      let messages: any[] = [];

      if (msgId.includes(action.payload.id)) {
      } else {
        messages = [...messages, action.payload];
      }
      msgId = [...msgId, action.payload.id];

      return {
        ...state,
        messaging: {
          ...state.messaging,
          allMessages: {
            loading: false,
            messages: [...state?.messaging?.allMessages?.messages, ...messages],
          },
        },
      };
    case messagingActions.MessagingActionsTypes.HANDLE_STREAM_DATA:
      return {
        ...state,
        streams: {
          ...state.streams,
          streamData: [...state.streams.streamData, action.payload],
        },
      };
    case messagingActions.MessagingActionsTypes.LOAD_ALL_MESSAGES_FAIL:
      return {
        ...state,
        messaging: {
          ...state.messaging,
          allMessages: {
            loading: false,
            messages: [],
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
            loading: true,
          },
        },
      };
    case messagingActions.MessagingActionsTypes.LOAD_PRIVATE_MESSAGE_SUCCESS:
      const messageContent = action.payload.zulip.messages;
      return {
        ...state,
        messaging: {
          ...state.messaging,
          privateMsgs: {
            ...state.messaging.privateMsgs,
            loading: false,
            messages: [...state.messaging.privateMsgs.messages, ...messageContent]
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
            messages: [],
          },
        },
      };
    case messagingActions.MessagingActionsTypes.HANDLE_UNREAD_MESSAGE:
      return {
        ...state,
        messaging: {
          ...state.messaging,
          unreadMsg: [...state.messaging.unreadMsg, action.payload]
        },
      };
    case messagingActions.MessagingActionsTypes.LOAD_MORE_MESSAGE:
      return {
        ...state,
        messaging: {
          ...state.messaging,
        },
      };
    // Updating read flag
    case messagingActions.MessagingActionsTypes.UPDATE_READ_MESSAGE_SUCCESS:
      const index = state.messaging.privateMsgs.messages.findIndex(message => message.id === action.payload);
      const updatedMessages = state.messaging.privateMsgs.messages.map(
        message => message.id === action.payload ? message : message
      );

      return {
        ...state,
        messaging: {
          ...state.messaging,
          privateMsgs: {
            ...state.messaging.privateMsgs,
            messages: updatedMessages
          }
        }
      };

    case messagingActions.MessagingActionsTypes.HANDLE_SEND_MESSAGE:
      return {
        ...state,
        msgReceiver: action.payload,
      };

    default:
      return state;
  }
}
