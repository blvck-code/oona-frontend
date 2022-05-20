// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const oonaBaseUrl = 'https://192.168.0.100:2443';
const userChannel = 'wss://192.168.0.100:2443/ws/on/event/';
const messageChannel = 'wss://192.168.0.100:2443/ws/on/message/';
const whiteBoard = 'http://192.168.0.100:8030';
const etherPad = 'http://192.168.0.100:9001/';
const domain = '192.168.0.100:8443';

export const environment = {
  production: false,
  oona: 'https://192.168.0.100:2443',
  userChannel: 'wss://192.168.0.100:2443/ws/on/event/',
  messageChannel: 'wss://192.168.0.100:2443/ws/on/message/',
  whiteBoard: 'http://192.168.0.100:8030',
  etherPad: 'http://192.168.0.100:9001/',
  domain: '192.168.0.100:8443',

  // User Management Urls
  loginUrl: oonaBaseUrl + '/api/v1/accounts/login/',
  requestResetUrl: oonaBaseUrl + '/api/v1/accounts/password/reset/request/',
  resetPassUrl: oonaBaseUrl + '/api/v1/accounts/password/reset/',
  registrationUrl: oonaBaseUrl + '/api/v1/accounts/register/',
  verificationUrl: oonaBaseUrl + '/api/v1/accounts/verify/otp/',
  generateOTPUrl: oonaBaseUrl + '/api/v1/accounts/generate/otp/',
  userProfileURL: oonaBaseUrl + '/api/v1/accounts/profile/',
  getUserUrl: oonaBaseUrl + '/api/v1/accounts/users',
  refreshTokenUrl: oonaBaseUrl + '/api/v1/accounts/token/refresh/',
  logoutUrl: oonaBaseUrl + '/api/v1/accounts/logout',
  meetingDetailsUrl: oonaBaseUrl + '/api/v1/meet/meetings/',
  changePasswordUrl: oonaBaseUrl + '/api/v1/accounts/password/change/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
