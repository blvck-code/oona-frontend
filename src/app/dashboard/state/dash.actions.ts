export enum DashActions {
  // SUBSCRIBED STREAMS
  LOAD_SUB_STREAMS = 'dash/loadSubStreams',
  LOAD_SUB_STREAMS_SUCCESS = 'dash/loadSubStreamsSuccess',
  LOAD_SUB_STREAMS_FAIL = 'dash/loadSubStreamsFail',

  // Present Users
  LOAD_PRESENT_USERS = 'dash/loadPresentUsers',
  LOAD_PRESENT_USERS_SUCCESS = 'dash/loadPresentUsersSuccess',
  LOAD_PRESENT_USERS_FAIL = 'dash/loadPresentUsersFail',

  // Zulip Users
  LOAD_ZULIP_USERS = 'dash/loadZulipUsers',
  LOAD_ZULIP_USERS_SUCCESS = 'dash/loadZulipUsersSuccess',
  LOAD_ZULIP_USERS_FAIL = 'dash/loadZulipUsersFail',
}
