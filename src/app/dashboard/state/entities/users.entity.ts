import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {PersonModel} from '../../models/person.model';

// Actions
import * as dashActions from '../dash.actions';
import {createSelector} from '@ngrx/store';
import {userStateKey} from '../dash.selectors';

export interface UsersState extends EntityState<PersonModel> {
  loading: boolean;
  loaded: boolean;
  selectedUserId: number | null;
  error: string;
}

export const userAdapter: EntityAdapter<PersonModel> = createEntityAdapter<PersonModel>({
  selectId: (user: PersonModel) => user.user_id
});

export const defaultUsers: UsersState = {
  ids: [],
  entities: {},
  loading: false,
  loaded: false,
  selectedUserId: null,
  error: ''
};

export const initialState = userAdapter.getInitialState(defaultUsers);

export function usersReducer(
  state = initialState,
  action: any
): UsersState {
  switch (action.type) {
    case dashActions.DashActions.LOAD_PRESENT_USERS:
    case dashActions.DashActions.LOAD_ZULIP_USERS:
      return {
        ...state,
        loading: true
      };
    case dashActions.DashActions.LOAD_ZULIP_USERS_SUCCESS:
      return userAdapter.addMany(action.payload.members, {
        ...state,
        loading: false,
        loaded: true
      });
    case dashActions.DashActions.LOAD_PRESENT_USERS_SUCCESS:
      return userAdapter.upsertMany(action.payload.members, {
        ...state,
        loading: false,
        loaded: true
      });
      // Selected user
    case dashActions.DashActions.SELECTED_USER:
      return {
        ...state,
        selectedUserId: +action.payload
      };
    default:
      return state;
  }
}

// Selectors
export const getUsers = createSelector(
  userStateKey,
  userAdapter.getSelectors().selectAll
);
export const usersLoaded = createSelector(
  userStateKey,
  state => state.loaded
);
export const usersLoading = createSelector(
  userStateKey,
  state => state.loading
);
export const selectedUserId = createSelector(
  userStateKey,
  state => state.selectedUserId
);
export const currentUser = createSelector(
  getUsers,
  selectedUserId,
  (users, userId) => users.find(
    user => user.user_id === userId
  )
);
