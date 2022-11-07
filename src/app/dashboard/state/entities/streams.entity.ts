import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {StreamsModel} from '../../models/streams.model';
import {Action} from '@ngrx/store';


export interface StreamsState extends EntityState<StreamsModel> {
  loading: boolean;
  loaded: boolean;
  error: string;
}

export const streamsAdapter: EntityAdapter<StreamsModel> = createEntityAdapter<StreamsModel>();

export const defaultStreams: StreamsState = {
  ids: [],
  entities: {},
  loading: false,
  loaded: false,
  error: ''
};

export const initialState = streamsAdapter.getInitialState(defaultStreams);

export function streamsReducer(
  state = initialState,
  action: Action
): StreamsState {
  switch (action.type) {
    default:
      return state;
  }
}
