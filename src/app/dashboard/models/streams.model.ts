
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
}
