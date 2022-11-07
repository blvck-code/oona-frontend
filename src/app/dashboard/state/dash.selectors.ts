import {createFeatureSelector, createSelector} from '@ngrx/store';
import {DashboardState} from './dash.reducer';

export const dashboardStateKey = 'dashboard';
export const getDashboardStateKey = createFeatureSelector<DashboardState>(dashboardStateKey);

export const streamStateKey = createSelector(
  getDashboardStateKey,
  state => state.streams
);
