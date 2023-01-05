// Load Private Messages
import { Action } from '@ngrx/store';
import { DashActions } from '../dash.actions';
import { SubStreamsModel } from '../../models/streams.model';

// Load Stream Messages
export class LoadStreamMsg implements Action {
  readonly type = DashActions.LOAD_STREAM_MESSAGE;
  constructor(public payload: any) {}
}
export class LoadStreamMsgSuccess implements Action {
  readonly type = DashActions.LOAD_STREAM_MESSAGE_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadStreamMsgFail implements Action {
  readonly type = DashActions.LOAD_STREAM_MESSAGE_FAIL;
  constructor(public payload: any) {}
}

// Create Stream Messages
export class CreateStreamMessage implements Action {
  readonly type = DashActions.CREATE_STREAM;
  constructor(public payload: any) {}
}
export class CreateStreamMessageSuccess implements Action {
  readonly type = DashActions.CREATE_STREAM_MESSAGE_SUCCESS;
  constructor(public payload: any) {
    console.log('Create stream messages success ===>>>', payload);
  }
}

export class CreateStreamMessageFail implements Action {
  readonly type = DashActions.CREATE_STREAM_MESSAGE_FAIL;
  constructor(public payload: any) {
    console.log('Fail create stream message ===>>', payload);
  }
}

export class SocketStreamMessage implements Action {
  readonly type = DashActions.SOCKET_STREAM_MESSAGE;
  constructor(public payload: any) {}
}

export type MessagesActions =
  // Private Messages
  | LoadStreamMsg
  | LoadStreamMsgSuccess
  | LoadStreamMsgFail
  // Create Stream Message
  | CreateStreamMessage
  | CreateStreamMessageSuccess
  | CreateStreamMessageFail;
