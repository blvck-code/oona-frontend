export interface AuthResponseModel {
  message: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string
  };
  token: {
    access: string;
    expiry_time: string;
    lifetime: string;
    refresh: string
  };
}
