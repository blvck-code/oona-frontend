// ALL USERS
import {Action} from '@ngrx/store';
import { DashActions } from '../dash.actions';
import {PersonResponseModel} from '../../models/person.model';

// Present Users
export class LoadPresentUsers implements Action {
  readonly type = DashActions.LOAD_PRESENT_USERS;
  constructor() {
  }
}
export class LoadPresentUsersSuccess implements Action {
  readonly type = DashActions.LOAD_PRESENT_USERS_SUCCESS;
  constructor(public payload: PersonResponseModel) {
  }
}
export class LoadPresentUsersFail implements Action {
  readonly type = DashActions.LOAD_PRESENT_USERS_FAIL;
  constructor(public payload: any) {
  }
}
// Zulip Users
export class LoadZulipUsers implements Action {
  readonly type = DashActions.LOAD_ZULIP_USERS;
  constructor() {
  }
}
export class LoadZulipUsersSuccess implements Action {
  readonly type = DashActions.LOAD_ZULIP_USERS_SUCCESS;
  constructor(public payload: PersonResponseModel) {
  }
}
export class LoadZulipUsersFail implements Action {
  readonly type = DashActions.LOAD_ZULIP_USERS_FAIL;
  constructor(public payload: any) {
  }
}

// Selected User
export class CurrentUser implements Action {
  readonly type = DashActions.SELECTED_USER;
  constructor(public payload: string | number) {
  }
}

export type UserActions =
  // Load Present Users
  | LoadPresentUsers
  | LoadPresentUsersSuccess
  | LoadPresentUsersFail
  // Zulip Users
  | CurrentUser;
