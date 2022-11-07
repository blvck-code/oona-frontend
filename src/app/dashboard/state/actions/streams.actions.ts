import {Action} from '@ngrx/store';
import { DashActions } from '../dash.actions';
import { SubStreamsResponseModel} from '../../models/streams.model';


export class LoadSubStreams implements Action {
  readonly type = DashActions.LOAD_SUB_STREAMS;
  constructor() {}
}
export class LoadSubStreamsSuccess implements Action {
  readonly type = DashActions.LOAD_SUB_STREAMS_SUCCESS;
  constructor(public payload: SubStreamsResponseModel) {}
}
export class LoadSubStreamsFail implements Action {
  readonly type = DashActions.LOAD_SUB_STREAMS_FAIL;
  constructor(public payload: any) {}
}

export type StreamActions =
  // Sub Streams
  | LoadSubStreams
  | LoadSubStreamsSuccess
  | LoadSubStreamsFail;
