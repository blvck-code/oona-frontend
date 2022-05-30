import * as messagingActions from './messaging.actions';
import {AllStreamsModel, SubscribedStreams} from '../models/streams.model';
import {All} from '@ngrx/store-devtools/src/actions';
import {MessagesModel} from '../models/messages.model';
import {TopicsModel} from '../models/topics.model';

export interface MessagingState {
  loading: boolean;
  streams: {
    allStreams: AllStreamsModel[] | any,
    subStreams: SubscribedStreams[],
    topics: any
  };
  messaging: {
    loading: boolean,
    messages: MessagesModel | null;
  };
}

export const initialState: MessagingState = {
  loading: false,
  streams: {
    allStreams: [],
    subStreams: [],
    topics: []
  },
  messaging: {
    loading: false,
    messages: null
  }
};

const addTopicToStream = ( payload: any) => {
  const stream_id = payload?.oz?.stream_id;
  const content = [...payload?.zulip?.topics];

  const topics  = {
    stream_id: {
      content
    }
  };

  return  topics;
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
        loading: true
      };
    case messagingActions.MessagingActionsTypes.LOAD_STREAM_TOPIC_FAIL:
    case messagingActions.MessagingActionsTypes.LOAD_SUB_STREAMS_FAIL:
    case messagingActions.MessagingActionsTypes.LOAD_ALL_STREAMS_FAIL:
      return {
        ...state,
        loading: false
      };
    case messagingActions.MessagingActionsTypes.LOAD_ALL_STREAMS_SUCCESS:
      return {
        ...state,
        loading: false,
        streams: {
          ...state.streams,
          allStreams: action?.payload?.streams
        }
      };
    case messagingActions.MessagingActionsTypes.LOAD_SUB_STREAMS_SUCCESS:
      return {
        ...state,
        loading: false,
        streams: {
          ...state.streams,
          subStreams: action?.payload?.subscriptions
        }
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

    // Handle Messages
    case messagingActions.MessagingActionsTypes.LOAD_MESSAGES:
      return {
        ...state,
        messaging: {
          loading: true,
          messages: null
        }
      };
    case messagingActions.MessagingActionsTypes.LOAD_MESSAGES_SUCCESS:
      return {
        ...state,
        messaging: {
          loading: false,
          messages: action.payload
        }
      };
    case messagingActions.MessagingActionsTypes.LOAD_MESSAGES_FAIL:
      return {
        ...state,
      };


    default:
      return state;
  }
}

