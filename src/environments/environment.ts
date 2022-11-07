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
  getStreamID: oonaBaseUrl + '/streams/get-stream-id', // Get  payload id
  archiveStream: oonaBaseUrl + '/streams/archive-a-stream', // Get payload stream id
  getStreamTopics: oonaBaseUrl + '/streams/get-topics-in-a-stream?stream_id=',  // Get append stream id in the URL
  streamSubscribers: oonaBaseUrl + '/streams/get-stream-members', // Get
  subscribeToStream: oonaBaseUrl + '/streams/subscribe-to-a-stream', // Post
  unsubscribeToStream: oonaBaseUrl + '/streams/unsubscribe-from-stream', // Post
  subscribeSubscriptionStatus: oonaBaseUrl + '/streams/get-subscription-status', // Post
  updateSubscriptionSettings: oonaBaseUrl + '/streams/update-subscription-settings', // Post
  allStreams: oonaBaseUrl + '/streams/', // Post
  updateStream: oonaBaseUrl + '/streams/update-a-stream', // Post
  muteTopic: oonaBaseUrl + '/streams/topic-muting', // Post
  sendMessageToStream: oonaBaseUrl + '/streams/send-message-to-stream', // Post
  sendFileToStream: oonaBaseUrl + '/streams/send-file-to-stream', // Post
  addDefaultStream: oonaBaseUrl + '/streams/add-default-stream', // Post
  removeDefaultStream: oonaBaseUrl + '/streams/remove-default-stream', // Post
  deleteTopic: oonaBaseUrl + '/streams/delete-a-topic', // Post


  // Messaging Urls
  users: oonaBaseUrl + '/api/v1/accounts/z/user/',
  zulipUsers: oonaBaseUrl + '/api/v1/accounts/z/user/',
  teams: oonaBaseUrl + '/api/v1/streams/all',
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
