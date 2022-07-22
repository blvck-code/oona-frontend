export interface StreamDataModel {
  oz: {
    anchor: string,
    use_first_unread_anchor?: boolean,
    num_before?: number,
    num_after: number,
    type: [
      {
        operator: string,
        operand: string
      }
    ],
    client_gravatar: boolean,
    apply_markdown: boolean
  };
  zulip: {
    result: string,
    msg: string,
    messages: StreamMessageModel[]
  };
  found_anchor: boolean;
  found_oldest: boolean;
  found_newest: boolean;
  history_limited: boolean;
  anchor: number;
}

export interface StreamMessageModel {
  id: number;
  sender_id: number;
  content: string;
  recipient_id: number;
  timestamp: number;
  client: number;
  subject: string;
  topic_links: any[];
  is_me_message: boolean;
  reactions: any[];
  submessages: any[];
  flags: string[];
  sender_full_name: string;
  sender_email: string;
  sender_realm_str: string;
  display_recipient: string;
  type: string;
  stream_id: number;
  avatar_url?: string;
  content_type: string;
}
