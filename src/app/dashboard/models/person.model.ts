export interface PersonResponseModel {
  result: string;
  msg: string;
  members: PersonModel[];
}

export interface PersonModel {
  email: string;
  user_id: number;
  avatar_version: number;
  is_admin: boolean;
  is_owner: boolean;
  is_guest: boolean;
  is_billing_admin: boolean;
  role: number;
  is_bot: boolean;
  full_name: string;
  timezone: string;
  is_active: boolean;
  date_joined: string;
  avatar_url: any;
  presence?: PresenceModel;
  unread?: false;
}

export interface PresenceModel {
  website: {
    status: string;
    client?: string;
    timestamp: number;
  };
  aggregated: {
    status: string;
    pushable?: boolean;
    client?: string;
    timestamp: number;
  };
}
