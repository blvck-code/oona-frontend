import {Action, ActionReducer, ActionReducerMap} from '@ngrx/store';
import * as fromStreamEnt from './entities/streams.entity';
import * as fromUserEnt from './entities/users.entity';
import * as fromMessageEnt from './entities/messages.entity';
import {messagesReducer} from './entities/messages.entity';

export interface DashboardState {
  streams: fromStreamEnt.StreamsState;
  users: fromUserEnt.UsersState;
  messages: fromMessageEnt.MessagesState;
}

export const dashReducer: ActionReducerMap<DashboardState> = {
  streams: fromStreamEnt.streamsReducer,
  users: fromUserEnt.usersReducer,
  messages: fromMessageEnt.messagesReducer
};
