export interface TopicResponseModel {
  zulip: {
    result: string;
    msg: string;
    topics: TopicsModel[];
  };
  oz: {
    stream_id: number
  };
}

export interface TopicsModel {
  name: string;
  max_id: number;
}
