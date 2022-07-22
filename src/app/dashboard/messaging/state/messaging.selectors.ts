import {createFeatureSelector, createSelector} from '@ngrx/store';
import {MessagingState} from './messaging.reducer';


export const messagingSelector = 'messaging';

const getMessagingState = createFeatureSelector<MessagingState>(messagingSelector);

export const getAllStreams = createSelector(
  getMessagingState,
  state => state.streams.allStreams
);

export const getSubStreams = createSelector(
  getMessagingState,
  state => state.streams.subStreams
);

export const getStreamsLoading = createSelector(
  getMessagingState,
  state => state.loading
);

export const getTopics = createSelector(
  getMessagingState,
  state => state.streams.topics
);

 // ALL MESSAGE SELECTORS
export const getLoadingAllMsg = createSelector(
  getMessagingState,
  state => state.messaging.allMessages.loading
);

export const getAllMessages = createSelector(
  getMessagingState,
  state => state.messaging.allMessages?.messages?.zulip?.messages
);

export const getAllFilteredMsg = createSelector(
  getMessagingState,
  state => state.messaging.selectedStreamMsg.messages
);

export const getStreamDataLoading = createSelector(
  getMessagingState,
  state => state.streams.streamData.loading
);

export const getStreamData = createSelector(
  getMessagingState,
  state => state.streams.streamData.messages
);

// export const filteredState = createSelector(
//   getMessagingState,
//   state => state.messaging.filtered
// );

// export const getFilteredMsg = createSelector(
//   getMessagingState,
//   state => state.messaging.filteredMsg
// );

export const getMessageType = createSelector(
  getMessagingState,
  state => state.messaging.allMessages?.messages?.oz.type
);

export const getReceiverInfo = createSelector(
  getMessagingState,
  state => state.msgReceiver
);

// PRIVATE MESSAGES SELECTORS
export const getLoadingPrivateMsgs = createSelector(
  getMessagingState,
  state => state.messaging.privateMsgs.loading
);

export const getPrivateMessages = createSelector(
  getMessagingState,
  state => state.messaging.privateMsgs?.messages?.zulip?.messages
);

export const getFilteredPrvMsgs = createSelector(
  getMessagingState,
  state => state.messaging.privateMsgs.filteredMsg
);
