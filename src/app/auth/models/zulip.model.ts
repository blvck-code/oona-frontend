export interface ProfileModel {
  zulip: {
    result: string,
    msg: string,
    email: string,
    user_id: number,
    avatar_version: number,
    is_admin: string,
    is_owner: boolean,
    is_guest: boolean,
    role: number,
    is_bot: boolean,
    full_name: string,
    timezone: string | any,
    is_active: boolean,
    date_joined: string,
    avatar_url: string,
    profile_data: any
    max_message_id: number
  };
  oz: {
    id: string,
    first_name: string,
    last_name: string,
    email: string
  };
}
