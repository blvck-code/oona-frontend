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
  FETCH_PROFILE_LOAD = 'userCenter/fetchProfile',
  FETCH_PROFILE_SUCCESS = 'userCenter/fetchProfileSuccess',
  FETCH_PROFILE_FAIL = 'userCenter/fetchProfileFail',

  // Log Out
  LOGOUT_USER = 'userCenter/logoutUser',
  LOGOUT_USER_SUCCESS = 'userCenter/logoutUserSuccess',
  LOGOUT_USER_FAIL = 'userCenter/logoutUserFail',
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
    console.log(payload);
  }
}

// FETCH USER PROFILE
export class LoadProfile implements Action {
  readonly type = AuthActionsTypes.FETCH_PROFILE_LOAD;
  constructor() {
    console.log('Loading current user profile');
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
  constructor() {}
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
  | LoadProfile
  | LoadProfileSuccess
  | LoadProfileError
  // UPDATE STATE
  | UpdateState;

