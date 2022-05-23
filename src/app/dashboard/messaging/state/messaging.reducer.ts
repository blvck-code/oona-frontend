import * as messagingActions from './messaging.actions';
import {AllStreamsModel, SubscribedStreams} from '../models/streams.model';

export interface MessagingState {
  loading: boolean;
  streams: {
    allStreams: AllStreamsModel[],
    subStreams: SubscribedStreams[]
  };
}

export const initialState: MessagingState = {
  loading: false,
  streams: {
    allStreams: [],
    subStreams: []
  }
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
    case messagingActions.MessagingActionsTypes.LOAD_ALL_STREAMS_SUCCESS:
      console.log('Payload all streams ==>>', action.payload);
      return {
        ...state,
        loading: false,
        streams: {
          ...state.streams,
          allStreams: action?.payload?.streams
        }
      };
    case messagingActions.MessagingActionsTypes.LOAD_SUB_STREAMS_SUCCESS:
      console.log('Payload sub streams ==>>', action.payload);
      return {
        ...state,
        loading: false,
        streams: {
          ...state.streams,
          subStreams: action?.payload?.subscriptions
        }
      };

    default:
      return state;
  }
}
