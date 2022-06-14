export interface CurrentUserModel {
  avatar_url: string;
  avatar_version: number;
  date_joined: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  is_billing_admin: boolean;
  is_bot: boolean;
  is_guest: boolean;
  is_owner: boolean;
  presence: {
    aggregated: {
      status: string;
      timestamp: number;
    },
    website: {
      status: string;
      timestamp: number;
    }
  };
  role: number;
  timezone: string;
  user_id: number;
}
