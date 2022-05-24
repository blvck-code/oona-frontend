import * as messagingActions from './messaging.actions';
import {AllStreamsModel, SubscribedStreams} from '../models/streams.model';
import {TopicsModel} from '../models/topics.model';

export interface MessagingState {
  loading: boolean;
  streams: {
    allStreams: AllStreamsModel[],
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
      return {
        ...state,
        streams: {
          ...state.streams,
          allStreams: [
            ...state.streams.allStreams,
          ],
          // topics: [...state.streams.topics, addTopicToStream(action.payload)]
        }
      };

    default:
      return state;
  }
}
