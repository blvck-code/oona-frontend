import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {SingleMessageModel} from '../../../models/messages.model';
import * as dashActions from '../../dash.actions';
import {createSelector} from '@ngrx/store';
import { privateMsgStateKey} from '../../dash.selectors';

export interface PrivateMessagesState extends EntityState<SingleMessageModel> {
  loading: boolean;
  loaded: boolean;
  error: string;
}

export const sortByTime = (a: SingleMessageModel, b: SingleMessageModel) => {
  return a.timestamp - b.timestamp;
};

export const privateMsgAdapter: EntityAdapter<SingleMessageModel> = createEntityAdapter<SingleMessageModel>({
  sortComparer: sortByTime
});

export const defaultMessages: PrivateMessagesState = {
  ids: [],
  entities: {},
  loading: false,
  loaded: false,
  error: '',
};

export const initialState = privateMsgAdapter.getInitialState(defaultMessages);

export function privateMsgReducer(
  state = initialState,
  action: any
): PrivateMessagesState {
  switch (action.type) {
    case dashActions.DashActions.LOAD_PRIVATE_MESSAGE:
      return {
        ...state,
        loading: true
      };
    case dashActions.DashActions.LOAD_PRIVATE_MESSAGE_SUCCESS:
      return privateMsgAdapter.upsertMany(action.payload.zulip.messages, {
        ...state,
        loading: false,
        loaded: true
      });
    default:
      return state;
  }
}

// Selectors
export const getPrivateMessages = createSelector(
  privateMsgStateKey,
  privateMsgAdapter.getSelectors().selectAll
);
export const privateMessagesLoading = createSelector(
  privateMsgStateKey,
  state => state.loading
);
export const privateMessagesLoaded = createSelector(
  privateMsgStateKey,
  state => state.loaded
);

// export const filteredMsg = createSelector(
//   getMessages,
//   selectedStream,
//   selectedTopic,
//   (messages, streamId, topic) => topic ?
//     messages.filter(message => message.stream_id === streamId && message.subject.toLowerCase() === topic.toLowerCase())
//     : messages.filter(message => message.stream_id === streamId)
//       .sort((a: SingleMessageModel, b: SingleMessageModel) => a.timestamp - b.timestamp)
// );
