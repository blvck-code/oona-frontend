import {createFeatureSelector, createSelector} from '@ngrx/store';
import {DashboardState} from './dash.reducer';

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

export const messagesStateKey = createSelector(
  getDashboardStateKey,
  state => state.messages
);
