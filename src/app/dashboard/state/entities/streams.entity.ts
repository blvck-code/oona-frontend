import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { StreamsModel, SubStreamsModel } from '../../models/streams.model';
import { Action, createSelector } from '@ngrx/store';

// Actions
import * as dashActions from '../dash.actions';
import { streamStateKey } from '../dash.selectors';
import { streamMsgAdapter } from './messages/stream.messages.entity';

export interface StreamsState extends EntityState<SubStreamsModel> {
  loading: boolean;
  loaded: boolean;
  selectedStreamId: number | null;
  selectedTopic: string;
  error: string;
}

export const streamsAdapter: EntityAdapter<SubStreamsModel> =
  createEntityAdapter<SubStreamsModel>({
    selectId: (stream: SubStreamsModel) => stream.stream_id,
  });

export const defaultStreams: StreamsState = {
  ids: [],
  entities: {},
  loading: false,
  loaded: false,
  selectedStreamId: null,
  selectedTopic: '',
  error: '',
};

export const initialState = streamsAdapter.getInitialState(defaultStreams);

export function streamsReducer(
  state = initialState,
  action: any
): StreamsState {
  switch (action.type) {
    case dashActions.DashActions.LOAD_SUB_STREAMS:
      return {
        ...state,
        loading: true,
      };
    case dashActions.DashActions.LOAD_SUB_STREAMS_SUCCESS:
      return streamsAdapter.addMany(action.payload.subscriptions, {
        ...state,
        loading: false,
        loaded: true,
      });
    // Todo Error handling
    // Selected stream / topic
    case dashActions.DashActions.SELECTED_STREAM:
      const streamId = action.payload.streamId;
      const topic = action.payload?.topic;
      return {
        ...state,
        selectedTopic: topic ? topic : '',
        selectedStreamId: streamId,
      };
    case dashActions.DashActions.LOAD_TOPICS:
      const newState = streamsAdapter.map(
        (stream: SubStreamsModel) =>
          stream.stream_id === action.payload.oz.stream_id
            ? {
                ...stream,
                topic: action.payload.zulip.topics,
              }
            : stream,
        state
      );
      return newState;
    case dashActions.DashActions.CREATE_STREAM:
      console.log('Payload payload ==>>>', action);
      return streamsAdapter.addOne(action.payload, {
        ...state,
      });

    default:
      return state;
  }
}

// Selectors
export const getStreams = createSelector(
  streamStateKey,
  streamsAdapter.getSelectors().selectAll
);
export const streams = createSelector(
  streamStateKey,
  streamsAdapter.getSelectors().selectEntities
);
export const getStreamsId = createSelector(
  streamStateKey,
  streamsAdapter.getSelectors().selectIds
);
export const getSelectedStream = createSelector(
  streamStateKey,
  (state) => state.selectedStreamId
);
export const getSelectedTopic = createSelector(
  streamStateKey,
  (state) => state.selectedTopic
);
export const getStreamsLoaded = createSelector(
  streamStateKey,
  (state) => state.loaded
);
export const getStreamsLoading = createSelector(
  streamStateKey,
  (state) => state.loading
);
export const privateStreams = createSelector(getStreams, (streams) =>
  streams.filter((stream: SubStreamsModel) => stream.invite_only)
);
export const publicStreams = createSelector(getStreams, (streams) =>
  streams.filter((stream: SubStreamsModel) => !stream.invite_only)
);
export const selectedStream = createSelector(
  streamStateKey,
  (state) => state.selectedStreamId
);
export const selectedStreamName = createSelector(
  getStreams,
  selectedStream,
  (stream, id) => stream.find((item) => item.stream_id === id)
);
export const selectedTopic = createSelector(
  streamStateKey,
  (state) => state.selectedTopic
);
