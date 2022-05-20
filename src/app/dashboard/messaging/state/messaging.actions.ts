import {Action} from '@ngrx/store';


export enum MessagingActionsTypes {
  // GET MESSAGES
  LOAD_MESSAGES = 'messaging/loadMessages',
  LOAD_MESSAGES_SUCCESS = 'messaging/loadMessagesSuccess',
  LOAD_MESSAGES_FAIL = 'messaging/loadMessagesFail',

}

export class LoadMessaging implements Action {
  readonly type = MessagingActionsTypes.LOAD_MESSAGES;
  constructor() {
    console.log('Loading messaging');
  }
}

export class LoadMessagingSuccess implements Action {
  readonly type = MessagingActionsTypes.LOAD_MESSAGES_SUCCESS;
  constructor(public payload: any) {
    console.log('Loading messaging success ===>>>', payload);
  }
}

export class LoadMessagingFail implements Action {
  readonly type = MessagingActionsTypes.LOAD_MESSAGES_FAIL;
  constructor(public payload: any) {
    console.log('Loading messaging fail ====>>>', payload);
  }
}

export type MessagingActions =
  // MESSAGING ACTIONS
  | LoadMessaging
  | LoadMessagingSuccess
  | LoadMessagingFail;
