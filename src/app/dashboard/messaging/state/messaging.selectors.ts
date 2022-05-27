import {createFeatureSelector, createSelector} from '@ngrx/store';
import {MessagingState} from './messaging.reducer';


export const messagingSelector = 'messaging';

const getMessagingState = createFeatureSelector<MessagingState>(messagingSelector);

export const getAllStreams = createSelector(
  getMessagingState,
  state => state.streams.allStreams
);

export const getStreamsLoading = createSelector(
  getMessagingState,
  state => state.loading
);

export const getTopics = createSelector(
  getMessagingState,
  state => state.streams.topics
);
