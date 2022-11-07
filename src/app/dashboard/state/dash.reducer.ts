import {Action, ActionReducer, ActionReducerMap} from '@ngrx/store';
import * as fromStreamEnt from './entities/streams.entity';
import * as fromUserEnt from './entities/users.entity';

export interface DashboardState {
  streams: fromStreamEnt.StreamsState;
  users: fromUserEnt.UsersState;
}

export const dashReducer: ActionReducerMap<DashboardState> = {
  streams: fromStreamEnt.streamsReducer,
  users: fromUserEnt.usersReducer
};
