import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MessagingState } from './messaging.reducer';
import {SingleMessageModel} from '../models/messages.model';
import {AuthState} from '../../../auth/state/auth.reducer';
import {getZulipUsers} from "../../../auth/state/auth.selectors";
import {ZulipSingleUser} from "../../../auth/models/user.model";



export const messagingSelector = 'messaging';
export const authSelector = 'userCenter';

const getAuthState =
  createFeatureSelector<AuthState>(authSelector);

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
);

export const getStreamUnreadMessages = createSelector(
  getStreamMessages,
  (messages: SingleMessageModel[]) =>
    messages.filter((message: SingleMessageModel) => !message.flags.includes('read')).length
);

export const getStreamUnread = createSelector(
  getStreamMessages,
  (messages: SingleMessageModel[]) =>
    messages.filter((message: SingleMessageModel) => !message.flags.includes('read'))
);

export const getPrivateUnreadMessages = createSelector(
  getPrivateMessages,
  (messages: SingleMessageModel[]) =>
    messages.filter((message: SingleMessageModel) => !message.flags.includes('read')).length
);

export const getPrivateUnread = createSelector(
  getPrivateMessages,
  (messages: SingleMessageModel[]) =>
    messages.filter((message: SingleMessageModel) => !message.flags.includes('read'))
);

export const getSelectedStreamId = createSelector(
  getMessagingState,
  state => state.messaging.streamMsg.selectedStreamId
);

export const getSelectedTopic = createSelector(
  getMessagingState,
  state => state.messaging.streamMsg.selectedTopic
);

export const getSelectedStreamMessages = createSelector(
  getStreamMessages,
  getSelectedStreamId,
  getSelectedTopic,
  (messages: SingleMessageModel[], streamId: number | null, topic: string) => topic ?
    messages.filter(message => message.stream_id === streamId && message.subject.toLowerCase() === topic.toLowerCase())
    : messages.filter(message => message.stream_id === streamId)
      .sort((a: SingleMessageModel, b: SingleMessageModel) => a.timestamp - b.timestamp)
);

export const getBothMessages = createSelector(
  getPrivateMessages,
  getStreamMessages,
  (streamMessages, privateMessages) => {
    return [...streamMessages, ...privateMessages]
      .sort((a: SingleMessageModel, b: SingleMessageModel) =>
        a.timestamp - b.timestamp
    );
  }
);

export const getSelectedUserId = createSelector(
  getMessagingState,
  state => state.messaging.privateMsgs.selectedUserId
);

export const getPrivateUser = createSelector(
  getAuthState,
  getSelectedUserId,
  (state, userId) => state.users.zulipUsers.members.find(
    (user: any) => user.user_id === userId
  )
);

export const getSelectedUserMessages = createSelector(
  getPrivateMessages,
  getSelectedUserId,
  (privateMessages, userId) =>
      privateMessages.filter(message => (
          // tslint:disable-next-line:max-line-length
          (message.display_recipient[0].id === userId) || (message.display_recipient[1] ? (message.display_recipient[1].id === userId) : null)
          )
        || message.sender_id === userId
      )
      .sort((a: SingleMessageModel, b: SingleMessageModel) =>
        a.timestamp - b.timestamp
      )
);

export const getUserUnreadMessages = createSelector(
  getPrivateMessages,
  getSelectedUserId,
  (privateMessages, userId) =>
    privateMessages.filter(message =>
      ((message.display_recipient[0].id === userId) || message.sender_id === userId )
      && !message.flags.includes('read')
    )
);

export const getUnreadStreamMessages = createSelector(
  getStreamMessages,
  getSelectedStreamId,
  getSelectedTopic,
  // tslint:disable-next-line:max-line-length
  (messages: SingleMessageModel[], streamId: number | null, topic: string) => topic ? messages.filter((message: SingleMessageModel) => (message.stream_id === streamId && message.subject.toLowerCase() === topic.toLowerCase()) && !message.flags.includes('read'))
    : messages.filter((message: SingleMessageModel) => message.stream_id === streamId  && !message.flags.includes('read'))
);
