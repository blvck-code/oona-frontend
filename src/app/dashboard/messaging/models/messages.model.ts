import {numbers} from '@material/dialog/constants';

export interface MessagesModel {
  oz: {
    use_first_unread_anchor: boolean,
    num_before: number,
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
    messages: SingleMessageModel[],
    found_anchor: boolean,
    found_oldest: boolean,
    found_newest: boolean,
    history_limited: boolean,
    anchor: number
  };
}

export interface SingleMessageModel {
      id: number;
      sender_id: number;
      content: string;
      recipient_id: number;
      timestamp: number;
      client: string;
      subject: string;
      topic_links: [];
      is_me_message: boolean;
      reactions: [];
      submessages: [];
      flags: string[];
      sender_full_name: string;
      sender_email: string;
      sender_realm_str: string;
      display_recipient: string;
      type: string;
      stream_id: number;
      avatar_url: any;
      content_type: string;
}

export interface StreamDetail {
  use_first_unread_anchor: boolean;
  apply_markdown: boolean;
  num_before: number;
  type: [
    {
      operator: string,
      operand: string,
    }
  ];
}

export interface MsgReceiver {
  avatar_url: any;
  client: string;
  content: string;
  content_type: string;
  display_recipient: string;
  flags: string[];
  id: number;
  is_me_message: boolean;
  reactions: any[];
  recipient_id: number;
  sender_email: string;
  sender_full_name: string;
  sender_id: number;
  sender_realm_str: string;
  submessages: any[];
  timestamp: number;
  topic_links: any[];
  type: string;
}

// {
//   "oz": {
//   "use_first_unread_anchor": true,
//     "num_before": 30,
//     "num_after": 0,
//     "type": [
//     {
//       "operator": "stream",
//       "operand": "general"
//     }
//   ],
//     "client_gravatar": true,
//     "apply_markdown": true
// },
//   "zulip": {
//   "result": "success",
//     "msg": "",
//     "messages": [
//     {
//       "id": 3,
//       "sender_id": 7,
//       "content": "<p>This is a message on stream <a class=\"stream\" data-stream-id=\"1\" href=\"/#narrow/stream/1-general\">#general</a> with the topic <code>topic demonstration</code>.</p>",
//       "recipient_id": 8,
//       "timestamp": 1651657970,
//       "client": "Internal",
//       "subject": "topic demonstration",
//       "topic_links": [],
//       "is_me_message": false,
//       "reactions": [],
//       "submessages": [],
//       "flags": [
//         "read"
//       ],
//       "sender_full_name": "Welcome Bot",
//       "sender_email": "welcome-bot@zulip.com",
//       "sender_realm_str": "zulipinternal",
//       "display_recipient": "general",
//       "type": "stream",
//       "stream_id": 1,
//       "avatar_url": null,
//       "content_type": "text/html"
//     },
//     {
//       "id": 4,
//       "sender_id": 7,
//       "content": "<p>Topics are a lightweight tool to keep conversations organized. You can learn more about topics at <a href=\"/help/about-streams-and-topics\">Streams and topics</a>.</p>",
//       "recipient_id": 8,
//       "timestamp": 1651657970,
//       "client": "Internal",
//       "subject": "topic demonstration",
//       "topic_links": [],
//       "is_me_message": false,
//       "reactions": [],
//       "submessages": [],
//       "flags": [
//         "read"
//       ],
//       "sender_full_name": "Welcome Bot",
//       "sender_email": "welcome-bot@zulip.com",
//       "sender_realm_str": "zulipinternal",
//       "display_recipient": "general",
//       "type": "stream",
//       "stream_id": 1,
//       "avatar_url": null,
//       "content_type": "text/html"
//     },
//     {
//       "id": 5,
//       "sender_id": 7,
//       "content": "<p>This is a message on stream <a class=\"stream\" data-stream-id=\"1\" href=\"/#narrow/stream/1-general\">#general</a> with the topic <code>swimming turtles</code>.</p>\n<div class=\"message_inline_image\"><a href=\"/static/images/cute/turtle.png\"><img src=\"/static/images/cute/turtle.png\"></a></div><p><a href=\"/help/start-a-new-topic\">Start a new topic</a> any time you're not replying to a         previous message.</p>",
//       "recipient_id": 8,
//       "timestamp": 1651657970,
//       "client": "Internal",
//       "subject": "swimming turtles",
//       "topic_links": [],
//       "is_me_message": false,
//       "reactions": [
//         {
//           "emoji_name": "turtle",
//           "emoji_code": "1f422",
//           "reaction_type": "unicode_emoji",
//           "user": {
//             "email": "welcome-bot@zulip.com",
//             "id": 7,
//             "full_name": "Welcome Bot"
//           },
//           "user_id": 7
//         }
//       ],
//       "submessages": [],
//       "flags": [
//         "read"
//       ],
//       "sender_full_name": "Welcome Bot",
//       "sender_email": "welcome-bot@zulip.com",
//       "sender_realm_str": "zulipinternal",
//       "display_recipient": "general",
//       "type": "stream",
//       "stream_id": 1,
//       "avatar_url": null,
//       "content_type": "text/html"
//     },
//     {
//       "id": 93,
//       "sender_id": 12,
//       "content": "<p>Just testing.</p>",
//       "recipient_id": 8,
//       "timestamp": 1653293646,
//       "client": "ZulipPython",
//       "subject": "swimming turtles",
//       "topic_links": [],
//       "is_me_message": false,
//       "reactions": [],
//       "submessages": [],
//       "flags": [
//         "read"
//       ],
//       "sender_full_name": "Maurice Oluoch",
//       "sender_email": "maurice.oluoch@8teq.co.ke",
//       "sender_realm_str": "",
//       "display_recipient": "general",
//       "type": "stream",
//       "stream_id": 1,
//       "avatar_url": null,
//       "content_type": "text/html"
//     },
//     {
//       "id": 95,
//       "sender_id": 6,
//       "content": "<p><span class=\"user-mention silent\" data-user-id=\"12\">Maurice Oluoch</span> created a new stream <a class=\"stream\" data-stream-id=\"3\" href=\"/#narrow/stream/3-testing\">#testing</a>.</p>",
//       "recipient_id": 8,
//       "timestamp": 1653300872,
//       "client": "Internal",
//       "subject": "new streams",
//       "topic_links": [],
//       "is_me_message": false,
//       "reactions": [],
//       "submessages": [],
//       "flags": [
//         "read"
//       ],
//       "sender_full_name": "Notification Bot",
//       "sender_email": "notification-bot@zulip.com",
//       "sender_realm_str": "zulipinternal",
//       "display_recipient": "general",
//       "type": "stream",
//       "stream_id": 1,
//       "avatar_url": null,
//       "content_type": "text/html"
//     }
//   ],
//     "found_anchor": false,
//     "found_oldest": true,
//     "found_newest": true,
//     "history_limited": false,
//     "anchor": 10000000000000000
// }
// }
