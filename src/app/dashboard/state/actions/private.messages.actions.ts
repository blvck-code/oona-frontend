// Load Private Messages
import {Action} from '@ngrx/store';
import {DashActions} from '../dash.actions';

export class LoadPrivateMsg implements Action {
  readonly type = DashActions.LOAD_PRIVATE_MESSAGE;
  constructor(public payload: any) {}
}
export class LoadPrivateMsgSuccess implements Action {
  readonly type = DashActions.LOAD_PRIVATE_MESSAGE_SUCCESS;
  constructor(public payload: any) {
  }
}
export class LoadPrivateMsgFail implements Action {
  readonly type = DashActions.LOAD_PRIVATE_MESSAGE_FAIL;
  constructor(public payload: any) {
  }
}

export type MessagesActions =
// Private Messages
  | LoadPrivateMsg
  | LoadPrivateMsgSuccess
  | LoadPrivateMsgFail;
