import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MessagingState } from './messaging.reducer';
import {SingleMessageModel} from "../models/messages.model";

export const messagingSelector = 'messaging';

const getMessagingState =
  createFeatureSelector<MessagingState>(messagingSelector);

export const getAllStreams = createSelector(
  getMessagingState,
  (state) => state.streams.allStreams
);

export const getSubStreams = createSelector(
  getMessagingState,
  (state) => state.streams.subStreams
);

export const getStreamsLoading = createSelector(
  getMessagingState,
  (state) => state.loading
);

export const getTopics = createSelector(
  getMessagingState,
  (state) => state.streams.topics
);

// ALL MESSAGE SELECTORS
export const getLoadingAllMsg = createSelector(
  getMessagingState,
  (state) => state.messaging.allMessages.loading
);

export const getAllMessages = createSelector(
  getMessagingState,
  (state) => state.messaging.allMessages?.messages
);

export const getAllFilteredMsg = createSelector(
  getMessagingState,
  (state) => state.messaging.selectedStreamMsg.messages
);

export const getAllStreamData = createSelector(
  getMessagingState,
  (state) => state.streams.streamData
);

export const getUnreadMessages = createSelector(
  getMessagingState,
  state => state.messaging.unreadMsg
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
  (state) => state.messaging.allMessages
);

export const getReceiverInfo = createSelector(
  getMessagingState,
  (state) => state.msgReceiver
);

// PRIVATE MESSAGES SELECTORS
export const getLoadingPrivateMsgs = createSelector(
  getMessagingState,
  (state) => state.messaging.privateMsgs.loading
);

export const getPrivateMessages = createSelector(
  getMessagingState,
  (state) => state.messaging.privateMsgs.messages
);

// ge stream messages
export const getStreamMessages = createSelector(
  getMessagingState,
  (state) => state.messaging.streamMsg.messages
);

export const getStreamMsgStatus = createSelector(
  getMessagingState,
  state => state.messaging.streamMsg.loaded
)
