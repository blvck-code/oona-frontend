import { UserModel } from '../models/user.model';
import * as authActions from './auth.actions';
import {load} from '@syncfusion/ej2-angular-richtexteditor';

export interface UserInfoState {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  refresh: string | null;
  access: string | null;
}

export interface AuthState {
  message: string;
  loginStatus: {
    isLoggedIn: boolean;
    isLoading: boolean;
  };
  userInfo: UserInfoState | null;
  zulipProfile: null;
  users: {
    loading: boolean,
    all: any;
    zulipUsers: any;
    selectedUser: any;
  };
}

export const initialState: AuthState = {
  message: '',
  loginStatus: {
    isLoggedIn: false,
    isLoading: false,
  },
  userInfo: null,
  zulipProfile: null,
  users: {
    loading: true,
    all: null,
    zulipUsers: null,
    selectedUser: null,
  },
};

function handleSelectedUser(state: AuthState, action: any): void{
  const id = action.payload.userId;
  const users = state;

  // const currentUser = users?.filter((user: any) => user.user_id === id);

  // console.log('State ===>>', users);
}

export function authReducer(state = initialState, action: any): AuthState {
  switch (action.type) {
    // Logging In
    case authActions.AuthActionsTypes.LOGIN_USER:
    case authActions.AuthActionsTypes.LOGOUT_USER:
      return {
        ...state,
        loginStatus: {
          isLoggedIn: false,
          isLoading: true,
        },
        message: '',
      };
    // Logged In Success
    case authActions.AuthActionsTypes.LOGIN_USER_SUCCESS:
      saveUserData(action.payload);
      return {
        ...state,
        loginStatus: {
          isLoading: false,
          isLoggedIn: true,
        },
        userInfo: {
          first_name: action.payload.user.first_name,
          last_name: action.payload.user.last_name,
          email: action.payload.user.email,
          refresh: action.payload.token.refresh,
          access: action.payload.token.access,
        },
        message: '',
      };
    // Login Error
    case authActions.AuthActionsTypes.LOGIN_USER_FAIL:
    case authActions.AuthActionsTypes.LOGOUT_USER_SUCCESS:
      return {
        ...state,
        loginStatus: {
          isLoggedIn: false,
          isLoading: false,
        },
        userInfo: null,
        message: action.payload.message,
      };
    // Logout

      // return {
      //   ...state,
      //   loginStatus: {
      //     isLoggedIn: false,
      //     isLoading: false,
      //   },
      //   userInfo: null,
      //   message: action.payload,
      // };
    case authActions.AuthActionsTypes.LOGOUT_USER_FAIL:
      return {
        ...state,
        loginStatus: {
          isLoggedIn: true,
          isLoading: false,
        },
        userInfo: null,
        message: action.payload,
      };
    // Profile
    case authActions.AuthActionsTypes.UPDATE_USER_INFO:
      return {
        ...state,
        loginStatus: {
          isLoggedIn: localStorage.getItem('accessToken') ? true : false,
          isLoading: false,
        },
        userInfo: updateState(),
      };
    case authActions.AuthActionsTypes.FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        zulipProfile: action.payload
      };
      // Load All Users
    case authActions.AuthActionsTypes.LOAD_ALL_USERS_SUCCESS:
      return {
        ...state,
        users: {
          ...state.users,
          loading: false,
          all: action.payload,
        },
      };
    // Zulips users
    case authActions.AuthActionsTypes.LOAD_ZULIP_USERS_SUCCESS:
      return {
        ...state,
        users: {
          ...state.users,
          loading: false,
          zulipUsers: action.payload
        }
      };
    // Selected User
    case authActions.AuthActionsTypes.SET_SELECTED_USER:
      return {
        ...state,
        users: {
          ...state.users,
          selectedUser: action.payload
        }
      };

    default:
      return state;
  }
}
// Save on local storage
const saveUserData = (userInfo: UserModel) => {
  // console.log('User info ===>>', userInfo);
  const userData = userInfo.user;
  const tokenData = userInfo.token;

  // console.log('User data ====>>>', userData);
  // console.log('Token data =====>>>', tokenData);

  const firstName: string = userData.first_name;
  const lastName: string = userData.last_name;
  const email: string = userData.email;
  const accessToken: string = tokenData.access;
  const refreshToken: string = tokenData.refresh;

  // console.log('Last name ===>>>', lastName);
  // let lastName: string = userInfo.user.last_name;
  // let email: string = userInfo.user.email;
  // let accessToken: string = userInfo.token?.access;
  // let refreshToken: string = userInfo.token?.refresh;
  //
  localStorage.setItem('firstName', firstName);
  localStorage.setItem('lastName', lastName);
  localStorage.setItem('email', email);
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

// Update state management
const updateState = () => {
  const first_name = localStorage?.getItem('firstName');
  const last_name = localStorage?.getItem('lastName');
  const email = localStorage?.getItem('email');
  const access = localStorage?.getItem('accessToken');
  const refresh = localStorage?.getItem('refreshToken');

  return {
    first_name,
    last_name,
    email,
    refresh,
    access,
  };
};

// Handle Login Error
const handleLoginError = (loginErr: any) => {
  let errorMsg = '';
  localStorage.clear();

  if (loginErr) {
    if (loginErr.error[0].non_field_errors[0] === 'Invalid login credentials') {
      errorMsg = 'Invalid login credentials. Please try again.';
    } else if (
      loginErr.error[0].non_field_errors[0] ===
      'Unable to login with provided credentials'
    ) {
      errorMsg = 'A user with the provided credentials does not exist.';
    } else {
      errorMsg = 'Invalid login credentials. Please try again.';
    }
  } else {
    errorMsg = 'Invalid login credentials. Please try again.';
  }
  return errorMsg;
};
