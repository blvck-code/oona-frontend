import {createFeatureSelector, createSelector} from "@ngrx/store";
import {AuthState} from './auth.reducer';

export const authSelector = 'userCenter';

const getAuthState = createFeatureSelector<AuthState>(authSelector);

export const getAccessToken = createSelector(
  getAuthState,
  state => state.userInfo?.access
);

export const getZulipProfile = createSelector(
  getAuthState,
  state => state.zulipProfile
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

export const getLoadingUsers = createSelector(
  getAuthState,
  state => state.users.loading
);

export const getZulipUsers = createSelector(
  getAuthState,
  state => state.users.zulipUsers
);

export const getZulipUsersMembers = createSelector(
  getAuthState,
  state => state.users.zulipUsers.members
);

export const getAllUsers = createSelector(
  getAuthState,
  state => state?.users?.all?.members
);

export const getSelectedUser = createSelector(
  getAuthState,
  state => state.users.selectedUser
);

