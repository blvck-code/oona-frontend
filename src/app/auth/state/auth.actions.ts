import { Action } from '@ngrx/store';
import {UserModel} from '../models/user.model';
import { AuthResponseModel } from '../models/authResponse.model';

export enum AuthActionsTypes {
  // Log In
  LOGIN_USER= 'userCenter/loginUser',
  LOGIN_USER_SUCCESS= 'userCenter/loginUserSuccess',
  LOGIN_USER_FAIL= 'userCenter/loginUserFail',

  UPDATE_USER_INFO = 'userCenter/updateUserInfo',

  // User Profile
  CURRENT_USER_PROFILE = 'userCenter/setProfile',
  FETCH_PROFILE_SUCCESS = 'userCenter/fetchProfileSuccess',
  FETCH_PROFILE_FAIL = 'userCenter/fetchProfileFail',

  // Log Out
  LOGOUT_USER = 'userCenter/logoutUser',
  LOGOUT_USER_SUCCESS = 'userCenter/logoutUserSuccess',
  LOGOUT_USER_FAIL = 'userCenter/logoutUserFail',

  // All Users
  LOAD_ALL_USERS = 'userCenter/loadAllUsers',
  LOAD_ALL_USERS_SUCCESS = 'userCenter/loadAllUsersSuccess',
  LOAD_ALL_USERS_FAIL = 'userCenter/loadAllUsersFail',

  // Zulip Users
  LOAD_ZULIP_USERS = 'userCenter/loadZulipUsers',
  LOAD_ZULIP_USERS_SUCCESS = 'userCenter/loadZulipUsersSuccess',
  LOAD_ZULIP_USERS_FAIL = 'userCenter/loadZulipUsersFail',

  // Selected User
  SET_SELECTED_USER = 'userCenter/setSelectedUser',
  LOAD_SELECTED_USER = 'userCenter/loadSelectedUser',
  // LOAD_SELECTED_USER_SUCCESS = 'userCenter/loadSelectedUserSuccess',
  // LOAD_SELECTED_USER_FAIL = 'userCenter/loadSelectedUserFail',

  // Register

  // Forgot Password

  // OTP
}

// LOGIN USER ACTIONS
export class LoginUser implements Action {
  readonly type = AuthActionsTypes.LOGIN_USER;
  constructor( public payload: any) {
  }
}
export class LoginUserSuccess implements Action {
  readonly type = AuthActionsTypes.LOGIN_USER_SUCCESS;
  constructor(public payload: AuthResponseModel) {
  }
}
export class LoginUserFail implements Action {
  readonly type = AuthActionsTypes.LOGIN_USER_FAIL;
  constructor( public payload: any) {
  }
}

// LOGOUT USER ACTIONS
export class LogoutUser implements Action {
  readonly type = AuthActionsTypes.LOGOUT_USER;
  constructor() {
  }
}
export class LogoutUserSuccess implements Action {
  readonly type = AuthActionsTypes.LOGOUT_USER_SUCCESS;
  constructor(public payload: string) {
  }
}
export class LogoutUserFail implements Action {
  readonly type = AuthActionsTypes.LOGOUT_USER_FAIL;
  constructor(public payload: string) {
  }
}

// FETCH USER PROFILE
export class CurrentUserProfile implements Action {
  readonly type = AuthActionsTypes.CURRENT_USER_PROFILE;
  constructor() {
  }
}
export class LoadProfileSuccess implements Action {
  readonly type = AuthActionsTypes.FETCH_PROFILE_SUCCESS;
  constructor(public payload: any) {
    console.log('Current user profile loaded successfully ====>>>>', payload);
  }
}
export class LoadProfileError implements Action {
  readonly type = AuthActionsTypes.FETCH_PROFILE_FAIL;
  constructor(public payload: any) {
    console.log('Load current user profile error ===>>', payload);
  }
}
export class UpdateState implements Action {
  readonly type = AuthActionsTypes.UPDATE_USER_INFO;
  constructor() {
    console.log('Auto login');
  }
}

// ALL USERS
export class LoadAllUsers implements Action {
  readonly type = AuthActionsTypes.LOAD_ALL_USERS;
  constructor() {
  }
}
export class LoadAllUsersSuccess implements Action {
  readonly type = AuthActionsTypes.LOAD_ALL_USERS_SUCCESS;
  constructor(public payload: any) {
  }
}
export class LoadAllUsersFail implements Action {
  readonly type = AuthActionsTypes.LOAD_ALL_USERS_FAIL;
  constructor(public payload: any) {
    // console.log('load all users fail ===>>', payload);
  }
}

// Zulip Users
export class LoadZulipUsers implements Action {
  readonly type = AuthActionsTypes.LOAD_ZULIP_USERS;
  constructor() {
    // console.log('Loading zulip users');
  }
}
export class LoadZulipUsersSuccess implements Action {
  readonly type = AuthActionsTypes.LOAD_ZULIP_USERS_SUCCESS;
  constructor(public payload: any) {
  }
}
export class LoadZulipUsersFail implements Action {
  readonly type = AuthActionsTypes.LOAD_ZULIP_USERS_FAIL;
  constructor(public payload: any) {
    // console.log('Load zulip users fail ====>>', payload);
  }
}

// Selected User
export class SetSelectedUser implements Action {
  readonly type = AuthActionsTypes.SET_SELECTED_USER;
  constructor(public payload: any) {
  }
}
export class LoadSelectedUser implements Action {
  readonly type = AuthActionsTypes.LOAD_SELECTED_USER;
  constructor(public payload: any) {
  }
}

export type AuthActions =
  // LOGIN USER ACTIONS
  | LoginUser
  | LoginUserSuccess
  | LoginUserFail
  // LOGOUT USER ACTION
  | LogoutUser
  | LogoutUserSuccess
  | LogoutUserFail
  // FETCH USER PROFILE
  | CurrentUserProfile
  // | LoadProfileSuccess
  // | LoadProfileError
  // UPDATE STATE
  | UpdateState
  // LOAD ALL USERS
  | LoadAllUsers
  | LoadAllUsersSuccess
  | LoadAllUsersFail
  // Load Zulip Users
  | LoadZulipUsers
  | LoadZulipUsersSuccess
  | LoadZulipUsersFail
  // Selected User
  | SetSelectedUser
  | LoadSelectedUser;


