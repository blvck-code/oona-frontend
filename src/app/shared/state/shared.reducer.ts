import {UsersModel} from '../models/users.model';
import * as sharedActions from './shared.actions';

export interface SharedReducerState {
  users: UsersModel[];
}

export const initialState: SharedReducerState = {
  users: []
};

export function sharedReducer(
  state= initialState,
  action: any
): SharedReducerState{
  switch (action.type){

    default:
      return state;
  }
}
