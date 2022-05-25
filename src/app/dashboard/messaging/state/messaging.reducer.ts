import * as messagingActions from './messaging.actions';
import {AllStreamsModel, SubscribedStreams} from '../models/streams.model';
import {All} from '@ngrx/store-devtools/src/actions';
// import {TopicsModel} from '../models/topics.model';

export interface MessagingState {
  loading: boolean;
  streams: {
    allStreams: AllStreamsModel[] | any,
    subStreams: SubscribedStreams[],
    topics: any
  };
}

export const initialState: MessagingState = {
  loading: false,
  streams: {
    allStreams: [],
    subStreams: [],
    topics: []
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
    case messagingActions.MessagingActionsTypes.LOAD_STREAM_TOPIC_SUCCESS:

      const topicStreamId = action.payload.oz.stream_id;
      const updatedStream: any[] = state?.streams?.allStreams.map((stream: AllStreamsModel) => {
        // tslint:disable-next-line:no-unused-expression
        stream.stream_id === topicStreamId ? stream.topics = action.payload : null;
      });

      console.log('Target ==>>', updatedStream);
      return {
        ...state,
        streams: {
          ...state.streams,
          // allStreams: [...state.streams.allStreams, updatedStream]
          allStreams: updatedStream
          // topics: [...state.streams.topics, addTopicToStream(action.payload)]
        }
      };

    default:
      return state;
  }
}
