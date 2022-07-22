// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const oonaBaseUrl = 'http://192.168.0.100:8000';
export const apiURL = 'https://192.168.0.';
export const basePort = '42';
// export const oonaBaseUrl = 'https://192.168.0.100:2443';
export const oonaBaseUrl = `${apiURL}${basePort}:2443`;
export const userChannel = 'ws://192.168.0.100:2443/ws/on/event/';
export const messageChannel = 'ws://192.168.0.100:2443/ws/on/message/';
export const firmName = '8teq';
const whiteBoard = 'http://192.168.0.37:8030';
const etherPad = 'http://192.168.0.37:9001/';
const domain = '192.168.0.37:8443';

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
  newMeeting: oonaBaseUrl + '/api/v1/meet/meetings/',
  oonaProfileUrl: oonaBaseUrl + '/api/v1/accounts/users/',
  streamUnsubscribe: oonaBaseUrl + '/api/v1/streams/unsubscribe',
  streamSubscribe: oonaBaseUrl + '/api/v1/streams/subscribe',
  oonaMemberProfileDetail: oonaBaseUrl + '/api/v1/accounts/user/?email=',
  filteredMeetings: oonaBaseUrl + '/api/v1/meet/meeting/dm/?host=',
  filteredAttendeeMeetings: oonaBaseUrl + '/api/v1/meet/meeting/dm/?attendees=',

  sendStreamMessageWithFileURL: oonaBaseUrl + '/api/v1/message/stream/file',

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
