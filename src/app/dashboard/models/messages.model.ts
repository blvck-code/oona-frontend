export interface MessagesModel {
  oz: OzModel;
  zulip: {
    result: string,
    msg: string,
    messages: SingleMessageModel[]
  };
}

export interface OzModel {
  anchor: string;
  use_first_unread_anchor: boolean;
  num_before: number;
  num_after: number;
  type: [{
    operator: string;
    operand: string
  }];
  client_gravatar: boolean;
  apply_markdown: boolean;
}

export interface SingleMessageModel  {
  id?: number;
  sender_id: number;
  content: string;
  recipient_id: number;
  timestamp: number;
  client: string;
  subject: string;
  topic_links: any[];
  reactions: any[];
  submessages: any[];
  flags: string[];
  sender_full_name: string;
  sender_email: string;
  display_recipient: DisplayRecipientModel[] | string;
  type: string;
  stream_id: number;
  avatar_url: string;
  content_type: string;
}

export interface DisplayRecipientModel {
  email: string;
  full_name: string;
  id: number;
  is_mirror_dummy: boolean;
}
