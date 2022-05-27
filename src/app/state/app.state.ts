import {ActionReducerMap} from '@ngrx/store';
import * as fromAuth from '../auth/state/auth.reducer';
import * as fromShared from '../shared/state/shared.reducer';

export interface AppState {
  userCenter: fromAuth.AuthState;
  shared: fromShared.SharedReducerState;
}

export const appReducer: ActionReducerMap<AppState> = {
  userCenter: fromAuth.authReducer,
  shared: fromShared.sharedReducer
};
