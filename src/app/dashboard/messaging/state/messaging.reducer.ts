import * as messagingActions from './messaging.actions';
import {AllStreamsModel, SubscribedStreams} from '../models/streams.model';
import {All} from '@ngrx/store-devtools/src/actions';
import {MessagesModel, SingleMessageModel} from '../models/messages.model';
import {TopicsModel} from '../models/topics.model';
import {CurrentUserModel} from '../models/currentUser.model';
import {act} from '@ngrx/effects';

export interface MessagingState {
  loading: boolean;
  streams: {
    allStreams: AllStreamsModel[] | any,
    subStreams: SubscribedStreams[],
    topics: any
  };
  currentUser: CurrentUserModel | null;
  msgReceiver: any;
  messaging: {
    loading: boolean,
    filtered: boolean,
    messages: MessagesModel | null;
    filteredMsg: SingleMessageModel[] | undefined;
  };
}

export const initialState: MessagingState = {
  loading: false,
  streams: {
    allStreams: [],
    subStreams: [],
    topics: []
  },
  currentUser: null,
  msgReceiver: null,
  messaging: {
    loading: false,
    filtered: false,
    messages: null,
    filteredMsg: undefined,
  }
};

// const addTopicToStream = ( state: MessagingState, payload: any) => {
//   const stream_id = payload?.oz?.stream_id;
//   const allStreams = state?.streams.allStreams;
//
//   let newStreams: any = [];
//   let trys: any = [];
//
//   allStreams.forEach((stream: any) => {
//     // tslint:disable-next-line:triple-equals
//     if (stream.stream_id == stream_id){
//       // @ts-ignore
//       stream = {
//         ...stream,
//         topics: payload
//       };
//
//       newStreams = [...newStreams, stream];
//     }
//   });
//
//   trys.push(newStreams);
// };

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
    case messagingActions.MessagingActionsTypes.LOAD_STREAM_TOPIC_SUCCESS:
      // addTopicToStream(state, action.payload);

      // const topicStreamId = action.payload.oz.stream_id;
      // console.log('topicStreamId ===>>>', topicStreamId);
      // const updatedStream: any[] = state?.streams?.allStreams.map((stream: AllStreamsModel) => {
      //   // tslint:disable-next-line:no-unused-expression
      //   stream.stream_id === topicStreamId ? stream.topics = action.payload : null;
      // });

      // console.log('Target ==>>', updatedStream);
      return {
        ...state,
        streams: {
          ...state.streams,
          // allStreams: [...state.streams.allStreams, updatedStream]
          // allStreams: updatedStream
          // topics: [...state.streams.topics, addTopicToStream(action.payload)]
        }
      };

    // Handle Messages
    case messagingActions.MessagingActionsTypes.LOAD_MESSAGES:
      return {
        ...state,
        messaging: {
          ...state.messaging,
          loading: true,
          filtered: false,
          messages: null
        }
      };
    case messagingActions.MessagingActionsTypes.LOAD_MESSAGES_SUCCESS:
      return {
        ...state,
        messaging: {
          ...state.messaging,
          loading: false,
          filtered: false,
          messages: action.payload
        }
      };
    case messagingActions.MessagingActionsTypes.LOAD_MORE_MESSAGE:
      return {
        ...state,
        messaging: {
          ...state.messaging,
        }
      };
    case messagingActions.MessagingActionsTypes.LOAD_MESSAGES_FAIL:
      return {
        ...state,
      };
    case messagingActions.MessagingActionsTypes.HANDLE_SEND_MESSAGE:
      return {
        ...state,
        msgReceiver: action.payload
      };

    default:
      return state;
  }
}

