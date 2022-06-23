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

export const getLoadingMsg = createSelector(
  getMessagingState,
  state => state.messaging.loading
);

export const getMessages = createSelector(
  getMessagingState,
  state => state.messaging.messages?.zulip?.messages
);

export const filteredState = createSelector(
  getMessagingState,
  state => state.messaging.filtered
);

export const getFilteredMsg = createSelector(
  getMessagingState,
  state => state.messaging.filteredMsg
);

export const getMessageType = createSelector(
  getMessagingState,
  state => state.messaging.messages?.oz.type
);
