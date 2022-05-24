import {TopicsModel} from './topics.model';

export interface AllStreamsModel {
  date_created: number;
  description: string;
  first_message_id: number;
  history_public_to_subscribers: boolean;
  stream_id: number;
  invite_only: boolean;
  is_web_public: boolean;
  message_retention_days: any;
  name: string;
  rendered_description: string;
  stream_post_policy: number;
  is_announcement_only: boolean;
  topics: any;
}

export interface TopicModel {
  stream_id: [
    {
      name: string,
      max_id: number
    }
  ];
}

// {
//   "zulip": {
//   "result": "success",
//     "msg": "",
//     "topics": [
//     {
//       "name": "new streams",
//       "max_id": 95
//     },
//     {
//       "name": "swimming turtles",
//       "max_id": 93
//     },
//     {
//       "name": "topic demonstration",
//       "max_id": 4
//     }
//   ]
// },
//   "oz": {
//   "stream_id": 1
// }
// }

export interface SubscribedStreams {
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
    wildcard_mentions_notify: any
}


// My Streams
// {
//   "result": "success",
//   "msg": "",
//   "subscriptions": [
//   {
//     "audible_notifications": null,
//     "color": "#76ce90",
//     "date_created": 1651657969,
//     "description": "Everyone is added to this stream by default. Welcome! :octopus:",
//     "desktop_notifications": null,
//     "email_address": "",
//     "email_notifications": null,
//     "first_message_id": 5,
//     "history_public_to_subscribers": true,
//     "in_home_view": true,
//     "invite_only": false,
//     "is_announcement_only": false,
//     "is_muted": false,
//     "is_web_public": false,
//     "message_retention_days": null,
//     "name": "general",
//     "pin_to_top": false,
//     "push_notifications": null,
//     "rendered_description": "<p>Everyone is added to this stream by default. Welcome! <span aria-label=\"octopus\" class=\"emoji emoji-1f419\" role=\"img\" title=\"octopus\">:octopus:</span></p>",
//     "role": 50,
//     "stream_id": 1,
//     "stream_post_policy": 1,
//     "stream_weekly_traffic": 1,
//     "wildcard_mentions_notify": null
//   }
// ]
// }
