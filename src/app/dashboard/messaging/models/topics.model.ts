
export interface TopicsModel {
  zulip: {
    result: string,
    msg: string,
    topics: Topics[]
  };
  oz: {
    stream_id: number
  };
}
export interface Topics {
  name: string;
  max_id: number;
  unread?: number;
}

