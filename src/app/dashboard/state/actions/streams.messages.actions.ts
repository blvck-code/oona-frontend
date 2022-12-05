// Load Private Messages
import {Action} from '@ngrx/store';
import {DashActions} from '../dash.actions';

export class LoadStreamMsg implements Action {
  readonly type = DashActions.LOAD_STREAM_MESSAGE;
  constructor(public payload: any) {}
}
export class LoadStreamMsgSuccess implements Action {
  readonly type = DashActions.LOAD_STREAM_MESSAGE_SUCCESS;
  constructor(public payload: any) {
  }
}
export class LoadStreamMsgFail implements Action {
  readonly type = DashActions.LOAD_STREAM_MESSAGE_FAIL;
  constructor(public payload: any) {
  }
}

// Create Stream
export class CreateStream implements Action {
  readonly type = DashActions.CREATE_STREAM;

}

export type MessagesActions =
// Private Messages
  | LoadStreamMsg
  | LoadStreamMsgSuccess
  | LoadStreamMsgFail;
