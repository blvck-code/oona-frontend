import {strict} from 'assert';

export interface UserModel {
  user: {
    id: string,
    first_name: string,
    last_name: string,
    email: string
  };
  message?: string;
  token: {
    expiry_time: string,
    lifetime: string,
    access: string,
    refresh: string
  };
}

export interface ZulipUsersResponse {
  result: string;
  msg: string;
  members: ZulipSingleUser[];
}

export interface ZulipSingleUser {
  email: string;
  user_id: number;
  avatar_version: number;
  is_admin: boolean;
  is_owner: boolean;
  is_guest: boolean;
  is_billing_admin: boolean;
  role: number;
  is_bot: number;
  full_name: string;
  timezone: string;
  is_active: boolean;
  date_joined: string;
  avatar_url: string | null;
}

export interface PresentUsersResponse {
  msg: string;
  result: string;
  members: SinglePresentUser[];
}

export interface SinglePresentUser {
  role: number;
  email: string;
  is_bot: boolean;
  user_id: number;
  is_admin: boolean;
  is_owner: boolean;
  presence?: {
    website: {
      status: string;
      timestamp: number;
    },
    aggregated: {
      status: string;
      timestamp: number;
    }
  };
  timezone: string;
  full_name: string;
  is_active: boolean;
  avatar_url: string | null;
  date_joined: string;
  avatar_version: number;
  is_billing_admin: boolean;
}
