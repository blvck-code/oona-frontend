import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {SingleMessageModel} from '../../../models/messages.model';
import * as dashActions from '../../dash.actions';
import {createSelector} from '@ngrx/store';
import {selectedStream, selectedTopic} from '../streams.entity';
import {privateMsgAdapter} from './private.messages.entity';
import {streamMsgStateKey} from '../../dash.selectors';
// import * as userActions from '../../../auth/state/auth.actions';

export interface StreamMessagesState extends EntityState<SingleMessageModel> {
  loading: boolean;
  loaded: boolean;
  error: string;
}

export const streamMsgAdapter: EntityAdapter<SingleMessageModel> = createEntityAdapter<SingleMessageModel>();

export const defaultMessages: StreamMessagesState = {
  ids: [],
  entities: {},
  loading: false,
  loaded: false,
  error: '',
};

export const initialState = streamMsgAdapter.getInitialState(defaultMessages);

export function streamMsgReducer(
  state = initialState,
  action: any
): StreamMessagesState {
  switch (action.type) {
    case dashActions.DashActions.LOAD_STREAM_MESSAGE:
      return {
        ...state,
        loading: true
      };
    case dashActions.DashActions.LOAD_STREAM_MESSAGE_SUCCESS:
      return streamMsgAdapter.addMany(action.payload.zulip.messages, {
        ...state,
        loading: false,
        loaded: true
      });
    default:
      return state;
  }
}

// Selectors
export const getStreamMessages = createSelector(
  streamMsgStateKey,
  streamMsgAdapter.getSelectors().selectAll
);
export const streamMessagesLoading = createSelector(
  streamMsgStateKey,
  state => state.loading
);
export const streamMessagesLoaded = createSelector(
  streamMsgStateKey,
  state => state.loaded
);

export const filteredStreamMsg = createSelector(
  getStreamMessages,
  selectedStream,
  selectedTopic,
  (messages, streamId, topic) => topic ?
    messages.filter(message => message.stream_id === streamId && message.subject.toLowerCase() === topic.toLowerCase())
    : messages.filter(message => message.stream_id === streamId)
      .sort((a: SingleMessageModel, b: SingleMessageModel) => a.timestamp - b.timestamp)
);
