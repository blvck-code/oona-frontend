import {AllStreamsModel} from '../../models/streams.model';

export interface StreamSocketModel {
  id: number;
  op: string;
  stream?: AllStreamsModel[];
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
