import {AllStreamsModel, SubStreamsModel} from '../../models/streams.model';

export interface StreamSocketModel {
  id: number;
  op: string;
  streams: SubStreamsModel[];
  type: string;
}

export interface SubscriptionSocketModel {
  id: number;
  op: string;
  stream_ids: number[];
  type: string;
  users_ids: number[];
}

export interface AddSocketModel {
  id: number;
  op: string;
  subscription: SubStreamsModel[];
  type: string;
}

export interface TypingSocketModel {
  // Todo Content pending
  type: string;
}

export interface PrivateSocketModel {
  // Todo Content pending
  type: string;
}

export interface PresenceSocketModel {
  // Todo Content pending
  type: string;
}
