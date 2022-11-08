import {TopicResponseModel, TopicsModel} from './topics.model';

export interface StreamsResponseModel {
  result: string;
  msg: string;
  streams: StreamsModel[];
}

export interface StreamsModel{
  date_created: number;
  description: string;
  first_message_id: number;
  history_public_to_subscribers: boolean;
  stream_id: number;
  invite_only: boolean;
  is_web_public: boolean;
  message_retention_days: null | number;
  name: string;
  rendered_description: string;
  stream_post_policy: number;
  is_announcement_only: boolean;
  unread?: number;
}

export interface SubStreamsResponseModel {
  result: string;
  msg: string;
  subscriptions: SubStreamsModel[];
}

export interface SubStreamsModel {
  audible_notifications: any;
  color: string;
  date_created: number;
  description: string;
  desktop_notifications: any;
  email_address: string;
  email_notifications: any;
  first_message_id: number;
  history_public_to_subscribers: boolean;
  in_home_view: boolean;
  invite_only: boolean;
  is_announcement_only: boolean;
  is_muted: boolean;
  is_web_public: boolean;
  message_retention_days: any;
  name: string;
  pin_to_top: boolean;
  push_notifications: any;
  rendered_description: string;
  role: number;
  stream_id: number;
  stream_post_policy: number;
  stream_weekly_traffic: number;
  wildcard_mentions_notify: any;
  topic?: TopicsModel[];
  subscribers?: number[];
}

export interface SubscribersResponseModel {
  result: string;
  msg: string;
  subscribers: number[];
}
