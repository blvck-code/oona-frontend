import {Action, ActionReducer, ActionReducerMap} from '@ngrx/store';
import * as fromStreamEnt from './entities/streams.entity';
import * as fromUserEnt from './entities/users.entity';
import * as fromPrivateMsgEntity from './entities/messages/private.messages.entity';
import * as fromStreamMsgEntity from './entities/messages/stream.messages.entity';

export interface DashboardState {
  streams: fromStreamEnt.StreamsState;
  users: fromUserEnt.UsersState;
  privateMsg: fromPrivateMsgEntity.PrivateMessagesState;
  streamMsg: fromStreamMsgEntity.StreamMessagesState;
}

export const dashReducer: ActionReducerMap<DashboardState> = {
  streams: fromStreamEnt.streamsReducer,
  users: fromUserEnt.usersReducer,
  privateMsg: fromPrivateMsgEntity.privateMsgReducer,
  streamMsg: fromStreamMsgEntity.streamMsgReducer,
};
