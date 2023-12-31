
export interface AuthResponseModel {
  user: {
    id: string,
    first_name: string,
    last_name: string,
    email: string
  };
  message?: string;
  token: {
    expiry_time?: string,
    lifetime?: string,
    access?: string,
    refresh?: string
  };
}
