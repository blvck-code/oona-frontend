import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {SingleMessageModel} from '../../models/messages.model';
import * as dashActions from '../dash.actions';
// import * as userActions from '../../../auth/state/auth.actions';

export interface MessagesState extends EntityState<SingleMessageModel> {
  loading: boolean;
  loaded: boolean;
  error: string;
}

export const messagesAdapter: EntityAdapter<SingleMessageModel> = createEntityAdapter<SingleMessageModel>();

export const defaultMessages: MessagesState = {
  ids: [],
  entities: {},
  loading: false,
  loaded: false,
  error: '',
};

export const initialState = messagesAdapter.getInitialState(defaultMessages);

export function messagesReducer(
  state = initialState,
  action: any
): MessagesState {
  switch (action.type) {
    case dashActions.DashActions.LOAD_MESSAGE:
      return {
        ...state,
        loading: true
      };
    case dashActions.DashActions.LOAD_MESSAGE_SUCCESS:
      console.log('Reducer =>', action.payload.zulip.messages);
      return messagesAdapter.addMany(action.payload.zulip.messages, {
        ...state,
        loading: false,
        loaded: true
      });
      // Todo reset state on log out
    // case userActions.LogoutUserSuccess:
    //   return state = initialState;
    default:
      return state;
  }
}
