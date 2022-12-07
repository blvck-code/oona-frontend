// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const backendPort = ':2443';
export const frontendPort = ':3443';
export const jitsiPort = ':8443';

export const backendProtocol = 'https://';
export const domain = '192.168.0.42';

export const oonaBaseUrl = `${backendProtocol}${domain}${backendPort}`;
export const oonaVersion = '/api/v1';
export const jitsiURL = `${domain}${jitsiPort}`;

export const oonaFrontendUrl = `${backendProtocol}${domain}${frontendPort}`;
export const userChannel = `${domain}${backendPort}/ws/on/event/`;
export const messageChannel = `${domain}${backendPort}/ws/on/message/`;
export const firmName = '8teq';
const whiteBoard = 'http://192.168.0.37:8030';
const etherPad = 'http://192.168.0.37:9001/';

export const environment = {
  production: false,
  // User Management Urls
  loginUrl: oonaBaseUrl + '/api/v1/accounts/login/',
  requestResetUrl: oonaBaseUrl + '/api/v1/accounts/password/reset/request/',
  resetPassUrl: oonaBaseUrl + '/api/v1/accounts/password/reset/',
  registrationUrl: oonaBaseUrl + '/api/v1/accounts/register/',
  verificationUrl: oonaBaseUrl + '/api/v1/accounts/verify/otp/',
  generateOTPUrl: oonaBaseUrl + '/api/v1/accounts/generate/otp/',
  userProfileURL: oonaBaseUrl + '/api/v1/accounts/profile/',
  getUsersUrl: oonaBaseUrl + '/api/v1/accounts/users',
  getUserUrl: oonaBaseUrl + '/api/v1/accounts/user',
  allUsers: oonaBaseUrl + '/api/v1/accounts/user/',
  refreshTokenUrl: oonaBaseUrl + '/api/v1/accounts/token/refresh/',
  logoutUrl: oonaBaseUrl + '/api/v1/accounts/logout',
  meetingDetailsUrl: oonaBaseUrl + '/api/v1/meet/meetings/',
  changePasswordUrl: oonaBaseUrl + '/api/v1/accounts/password/change/',

  // Streams
  subscribedStream: oonaBaseUrl + oonaVersion + '/streams/get-subscribed-streams', // Get
  getStreamID: oonaBaseUrl + oonaVersion + '/streams/get-stream-id', // Get  payload id
  archiveStream: oonaBaseUrl + oonaVersion + '/streams/archive-a-stream', // Get payload stream id
  getStreamTopics: oonaBaseUrl + oonaVersion + '/streams/get-topics-in-a-stream?stream_id=',  // Get append stream id in the URL
  streamSubscribers: oonaBaseUrl + oonaVersion + '/streams/get-stream-members', // Get
  subscribeToStream: oonaBaseUrl + oonaVersion + '/streams/subscribe-to-a-stream', // Post
  unsubscribeToStream: oonaBaseUrl + oonaVersion + '/streams/unsubscribe-from-stream', // Post
  subscribeSubStatus: oonaBaseUrl + oonaVersion + '/streams/get-subscription-status', // Post
  updateSubscriptionSettings: oonaBaseUrl + oonaVersion + '/streams/update-subscription-settings', // Post
  allStreams: oonaBaseUrl + oonaVersion + '/streams/', // Post
  updateStream: oonaBaseUrl + oonaVersion + '/streams/update-a-stream', // Post
  muteTopic: oonaBaseUrl + oonaVersion + '/streams/topic-muting', // Post
  sendMessageToStream: oonaBaseUrl + oonaVersion + '/streams/send-message-to-stream', // Post
  sendFileToStream: oonaBaseUrl + oonaVersion + '/streams/send-file-to-stream', // Post
  addDefaultStream: oonaBaseUrl + oonaVersion + '/streams/add-default-stream', // Post
  removeDefaultStream: oonaBaseUrl + oonaVersion + '/streams/remove-default-stream', // Post
  deleteTopic: oonaBaseUrl + oonaVersion + '/streams/delete-a-topic', // Post

  // Messages
  sendMessage: oonaBaseUrl + '/message/send-a-message', // Post
  uploadFile: oonaBaseUrl + '/message/upload-a-file', // Post
  editMessage: oonaBaseUrl + '/message/edit-a-message', // Post
  deleteMessage: oonaBaseUrl + '/message/delete-a-message', // Post
  getMessages: oonaBaseUrl + '/message/', // Post
  messagesMatchNarrow: oonaBaseUrl + '/message/check-if-messages-match-a-narrow', // Post
  addEmojiReaction: oonaBaseUrl + '/message/add-emoji', // Post
  removeEmojiReaction: oonaBaseUrl + '//message/remove-emoji', // Post
  singleMessage: oonaBaseUrl + '/message/fetch-a-single-message?message_id=', // Get
  idsWithRead: oonaBaseUrl + '/message/get-list-of-id-that-read?message_id=', // Get
  messageEditHistory: oonaBaseUrl + '/message/get-a-message-edit-history', // Post
  updatePersonalMessageFlag: oonaBaseUrl + '/message/update-personal-message-flags', // Post
  markAllMessagesRead: oonaBaseUrl + '/message/all/read', // Get
  markMessageInStreamRead: oonaBaseUrl + '/message/mark-messages-in-stream-as-read', // Post
  markMessageInTopicAsRead: oonaBaseUrl + '/message/mark-messages-in-topic-as-read', // Post
  renderMessage: oonaBaseUrl + '/message/render-message', // Post

  // Messaging Urls
  users: oonaBaseUrl + '/api/v1/accounts/z/user/',
  zulipUsers: oonaBaseUrl + '/api/v1/accounts/z/user/',
  teams: oonaBaseUrl + '/api/v1/streams/get-subscribed-streams',
  subscribedStreams: oonaBaseUrl + '/api/v1/streams',
  presentUsers: oonaBaseUrl + '/api/v1/accounts/present/user/',
  userProfile: oonaBaseUrl + '/api/v1/accounts/profile/',
  streamMessages: oonaBaseUrl + '/api/v1/message/s',
  sendStreamMessageURL: oonaBaseUrl + '/api/v1/streams/message',
  sendIndividualMessageWithFileURL: oonaBaseUrl + '/api/v1/message/file',
  individualMessage: oonaBaseUrl + '/api/v1/message/',
  streamTopic: oonaBaseUrl + '/api/v1/streams/all/topic?stream_id=',
  newTeam: oonaBaseUrl + '/api/v1/streams/subscribe',
  newChannel: oonaBaseUrl + '/api/v1/streams/message',
  newMeeting: oonaBaseUrl + '/api/v1/meet/meetings/',
  oonaProfileUrl: oonaBaseUrl + '/api/v1/accounts/users/',
  streamUnsubscribe: oonaBaseUrl + '/api/v1/streams/unsubscribe',
  streamSubscribe: oonaBaseUrl + '/api/v1/streams/subscribe',
  oonaMemberProfileDetail: oonaBaseUrl + '/api/v1/accounts/user/?email=',
  filteredMeetings: oonaBaseUrl + '/api/v1/meet/meeting/dm/?host=',
  filteredAttendeeMeetings: oonaBaseUrl + '/api/v1/meet/meeting/dm/?attendees=',
  updateMessageFlag: oonaBaseUrl + '/api/v1/message/flag',

  sendStreamMessageWithFileURL: oonaBaseUrl + '/api/v1/message/stream/file',

  domain,
  jitsiURL,
  whiteBoard: 'http://192.168.0.37:8030',
  etherPad: 'http://192.168.0.37:9001/',
  userChannel,
  messageChannel,

  // Chat
  // sendStreamMessageWithFileURL: oonaBaseUrl + '/api/v1/message/stream/file',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
