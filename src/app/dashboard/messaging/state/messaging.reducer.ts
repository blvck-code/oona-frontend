import {initialState} from '../../../auth/state/auth.reducer';


export interface MessagingState {

}

export function messagingReducer (
  state = initialState,
  action: any
): MessagingState {
  switch (action.type) {
    default:
      return state;
  }
}
