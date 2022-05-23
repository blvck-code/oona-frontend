import {createFeatureSelector, createSelector} from '@ngrx/store';
import {MessagingState} from './messaging.reducer';


export const messagingSelector = 'messaging';

const getMessagingState = createFeatureSelector<MessagingState>(messagingSelector);

export const getAllStreams = createSelector(
  getMessagingState,
  state => state.streams.allStreams
);

