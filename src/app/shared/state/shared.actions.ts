import {Action} from '@ngrx/store';


export enum SharedActionsTypes {
  LOAD_USERS = 'shared/loadUsers',
  LOAD_USERS_SUCCESS = 'shared/loadUsersSuccess',
  LOAD_USERS_FAIL = 'shared/loadUsersFail',
}

// LOAD USERS CLASSES
export class LoadUsers implements Action {
  readonly type = SharedActionsTypes.LOAD_USERS;
  constructor() {
    console.log('Fetching users');
  }
}

export class LoadUsersSuccess implements Action {
  readonly type = SharedActionsTypes.LOAD_USERS_SUCCESS;
  constructor(public payload: any) {
    console.log('Fetching users success ===>>', payload);
  }
}

export class LoadUsersFail implements Action {
  readonly type = SharedActionsTypes.LOAD_USERS_FAIL;
  constructor(public payload: any) {
    console.log('Fetching users fail ===>>>', payload);
  }
}

export type SharedActions =
  // LOAD USERS ACTIONS
  | LoadUsers
  | LoadUsersSuccess
  | LoadUsersFail;
