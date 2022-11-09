import {DisplayRecipientModel} from './messages.model';


export interface SocketMessageModel {
  type: string;
  id: number;
  flags: string[];
  message: {
    id: number;
    avatar_url: string;
    client: string;
    content: string;
    content_type: string;
    display_recipient: DisplayRecipientModel | string;
    flag: string[];
    is_me_message: boolean;
    reactions: any[];
    recipient_id: number;
    sender_email: string;
    sender_full_name: string;
    sender_id: number;
    sender_realm_str: string;
    subject: string;
    timestamp: number;
    topic_links: any[];
    submessages?: any;
    type: string;
  }
}

export interface StreamCounterModel {
  message_id: number;
  stream_id: number; // General
  unread: number;
  topics: [
    {
      subject: string,
      unread: number;
    },
  ]
}
