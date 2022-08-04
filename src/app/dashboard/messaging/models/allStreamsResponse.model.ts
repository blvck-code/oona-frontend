import {AllStreamsModel} from './streams.model';

export interface AllStreamsResponseModel{
  result: string;
  msg: string;
  streams: AllStreamsModel[];
}
