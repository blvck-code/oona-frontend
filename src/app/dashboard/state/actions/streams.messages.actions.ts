// Load Private Messages
import {Action} from '@ngrx/store';
import {DashActions} from '../dash.actions';
import {SubStreamsModel} from '../../models/streams.model';

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


export type MessagesActions =
// Private Messages
  | LoadStreamMsg
  | LoadStreamMsgSuccess
  | LoadStreamMsgFail;
