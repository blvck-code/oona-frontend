import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AuthState} from './auth.reducer';
import {ZulipSingleUser} from '../models/user.model';

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

export const getZulipProfileInfo = createSelector(
  getZulipProfile,
  zulipProfile => zulipProfile?.zulip
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

export const getUserId = createSelector(
  getAuthState,
  // @ts-ignore
  state => state.zulipProfile?.zulip?.user_id
);

export const getIsAuthLoading = createSelector(
  getAuthState,
  state => state.loginStatus.isLoading
);

export const usersLoaded = createSelector(
  getAuthState,
  state => state.users.loaded
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
  state => state?.users?.all
);

export const getSelectedUser = createSelector(
  getAuthState,
  state => state.users.selectedUser
);

export const getPresentUser = createSelector(
  getAuthState,
  state => state.users.all
);
//
// export const getPresentUsers = createSelector(
//   getZulipUsers,
//   getPresentUser,
//   (zulipUsers, presentUser) => {
//     zulipUsers.map(
//       (zulip: ZulipSingleUser) => {
//         presentUser.map((user: any) => {
//           if (zulip.user_id === user.user_id) {
//             zulip = {
//               ...zulip,
//               ...user
//             };
//           }
//         });
//       }
//     )
//   }
// );

