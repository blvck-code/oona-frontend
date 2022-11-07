import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {StreamsModel, SubStreamsModel} from '../../models/streams.model';
import {Action, createSelector} from '@ngrx/store';

// Actions
import * as dashActions from '../dash.actions';
import {streamStateKey} from '../dash.selectors';


export interface StreamsState extends EntityState<SubStreamsModel> {
  loading: boolean;
  loaded: boolean;
  selectedStreamId: number | null;
  selectedTopic: string;
  error: string;
}

export const streamsAdapter: EntityAdapter<SubStreamsModel> = createEntityAdapter<SubStreamsModel>({
  selectId: (stream: SubStreamsModel) => stream.stream_id
});

export const defaultStreams: StreamsState = {
  ids: [],
  entities: {},
  loading: false,
  loaded: false,
  selectedStreamId: null,
  selectedTopic: '',
  error: ''
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
        loading: true
      };

    case dashActions.DashActions.LOAD_SUB_STREAMS_SUCCESS:
      return streamsAdapter.addMany(action.payload.subscriptions, {
        ...state,
        loading: false,
        loaded: true
      });
      // Todo Error handling
    default:
      return state;
  }
}

// Selectors
export const getStreams = createSelector(
  streamStateKey,
  streamsAdapter.getSelectors().selectAll
);
export const getSelectedStream = createSelector(
  streamStateKey,
  state => state.selectedStreamId
);
export const getSelectedTopic = createSelector(
  streamStateKey,
  state => state.selectedTopic
)
