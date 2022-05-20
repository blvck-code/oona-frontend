import {createFeatureSelector, createSelector} from "@ngrx/store";
import {AuthState} from './auth.reducer';

export const authSelector = 'userCenter';

const getAuthState = createFeatureSelector<AuthState>(authSelector);

export const getAccessToken = createSelector(
  getAuthState,
  state => state.userInfo?.access
);

export const getUserDetails = createSelector(
  getAuthState,
  state => state.userInfo
);

export const getErrorMessage = createSelector(
  getAuthState,
  state => state.message
);

export const getIsLoggedIn = createSelector(
  getAuthState,
  state => state.loginStatus.isLoggedIn
);

export const getIsAuthLoading = createSelector(
  getAuthState,
  state => state.loginStatus.isLoading
);
