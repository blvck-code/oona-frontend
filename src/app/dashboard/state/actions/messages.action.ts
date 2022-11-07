
// Load Private Messages
import {Action} from '@ngrx/store';
import {DashActions} from '../dash.actions';

export class LoadMessage implements Action {
  readonly type = DashActions.LOAD_MESSAGE;
  constructor(public payload: any) {}
}
export class LoadMessageSuccess implements Action {
  readonly type = DashActions.LOAD_MESSAGE_SUCCESS;
  constructor(public payload: any) {
    console.log('Payload ==>>', payload);
  }
}
export class LoadMessageFail implements Action {
  readonly type = DashActions.LOAD_MESSAGE_FAIL;
  constructor(public payload: any) {
  }
}

export type MessagesActions =
  // Private Messages
  | LoadMessage
  | LoadMessageSuccess
  | LoadMessageFail;
