import {createFeatureSelector, createSelector} from '@ngrx/store';
import {DashboardState} from './dash.reducer';
import {getStreamMessages} from './entities/messages/stream.messages.entity';
import {getPrivateMessages} from './entities/messages/private.messages.entity';

export const dashboardStateKey = 'dashboard';
export const getDashboardStateKey = createFeatureSelector<DashboardState>(dashboardStateKey);

export const streamStateKey = createSelector(
  getDashboardStateKey,
  state => state.streams
);

export const userStateKey = createSelector(
  getDashboardStateKey,
  state => state.users
);

export const privateMsgStateKey = createSelector(
  getDashboardStateKey,
  state => state.privateMsg
);
export const streamMsgStateKey = createSelector(
  getDashboardStateKey,
  state => state.streamMsg
);
// export const allMessages = createSelector(
//   getStreamMessages,
//   getPrivateMessages,
//   (streams, privateMsg) => {
//     return [...streams, ...privateMsg]
//       .sort((a, b) => a.timestamp - b.timestamp )
//   }
// )
