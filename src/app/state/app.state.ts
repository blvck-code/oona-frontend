import {ActionReducerMap} from '@ngrx/store';
import * as fromAuth from '../auth/state/auth.reducer'

export interface AppState {
  userCenter: fromAuth.AuthState;
}

export const appReducer: ActionReducerMap<AppState> = {
  userCenter: fromAuth.authReducer
};
