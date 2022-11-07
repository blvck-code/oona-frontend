import {Action, ActionReducer, ActionReducerMap} from '@ngrx/store';
import * as fromStreamEnt from './entities/streams.entity';

// export interface DashState {
//   streams: any;
//   users: any;
//   messages: any;
// }

export interface DashboardState {
  streams: fromStreamEnt.StreamsState;
}

export const dashReducer: ActionReducerMap<DashboardState> = {
  streams: fromStreamEnt.streamsReducer,
};

