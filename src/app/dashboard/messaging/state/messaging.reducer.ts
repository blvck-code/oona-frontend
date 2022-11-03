import * as messagingActions from './messaging.actions';
import {AllStreamsModel, SubscribedStreams} from '../models/streams.model';
import {MessagesModel, SingleMessageModel} from '../models/messages.model';
import {CurrentUserModel} from '../models/currentUser.model';
import {act} from '@ngrx/effects';

export interface MessagingState {
  loading: boolean;
  loaded: boolean;
  streams: {
    loading: boolean;
    loaded: boolean;
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
      selectedUserId: number | null;
      messages: SingleMessageModel[];
    };
    streamMsg: {
      loaded: boolean,
      selectedStreamId: number | null,
      selectedTopic: string,
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
  loaded: false,
  streams: {
    loading: false,
    loaded: false,
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
      selectedUserId: null,
      messages: [],
    },
    streamMsg: {
      loaded: false,
      selectedStreamId: null,
      selectedTopic: '',
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
        streams: {
          ...state.streams,
          loaded: false
        }
      };
    case messagingActions.MessagingActionsTypes.LOAD_ALL_STREAMS_SUCCESS:
      return {
        ...state,
        loading: false,
        streams: {
          ...state.streams,
          loaded: true,
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
            ...state.messaging.streamMsg,
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
    case messagingActions.MessagingActionsTypes.SELECTED_STREAM_ID:
      return {
        ...state,
        messaging: {
          ...state.messaging,
          streamMsg: {
            ...state.messaging.streamMsg,
            selectedStreamId: action.payload.streamId,
            selectedTopic: action.payload.topic
          }
        }
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
    case messagingActions.MessagingActionsTypes.CREATE_PRIVATE_MESSAGE_SUCCESS:
      return {
        ...state,
        messaging: {
          ...state.messaging,
          privateMsgs: {
            ...state.messaging.privateMsgs,
            messages: [...state.messaging.privateMsgs.messages, action.payload]
          }
        }
      };
    case messagingActions.MessagingActionsTypes.CREATE_STREAM_MESSAGE_SUCCESS:
      return {
        ...state,
        messaging: {
          ...state.messaging,
          streamMsg: {
            ...state.messaging.streamMsg,
            messages: [...state.messaging.streamMsg.messages, action.payload]
          }
        }
      };
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
    case messagingActions.MessagingActionsTypes.SELECTED_USER_ID:
      return {
        ...state,
        messaging: {
          ...state.messaging,
          privateMsgs: {
            ...state.messaging.privateMsgs,
            selectedUserId: action.payload
          }
        }
      };
    case messagingActions.MessagingActionsTypes.UPDATE_PRIVATE_MESSAGE:
      return {
        ...state,
        messaging: {
          ...state.messaging,
          privateMsgs: {
            ...state.messaging.privateMsgs,
            messages: [
              ...state.messaging.privateMsgs.messages.map(
                (message: SingleMessageModel) => {
                  if (message.id === action.payload) {
                    return {
                      ...message,
                      flags: ['read']
                    };
                  }
                  return message;
                }
              )
            ]
          }
        }
      };
    // Updating read flag
    case messagingActions.MessagingActionsTypes.UPDATE_READ_MESSAGE_SUCCESS:
      const messageItem = state.messaging.streamMsg.messages.find((message) => message.id === action.payload);
      const index = state.messaging.streamMsg.messages.findIndex(
        (message: SingleMessageModel) => message.id === action.payload);
      console.log('Message id ==>>', action.payload);
      return {
        ...state,
        messaging: {
          ...state.messaging,
          streamMsg: {
            ...state.messaging.streamMsg,
            messages: [
              ...state.messaging.streamMsg.messages.map(
                (message: SingleMessageModel) => {
                  if (message.id === action.payload) {
                    return {
                      ...message,
                      flags: ['read']
                    };
                  }
                  return message;
                }
              )
            ]
          }
        }
      } as MessagingState;
    case messagingActions.MessagingActionsTypes.HANDLE_SEND_MESSAGE:
      return {
        ...state,
        msgReceiver: action.payload,
      };

    default:
      return state;
  }
}
