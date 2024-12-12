export interface QueryParameter {
  key: string;
  value: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export type AuthToken = {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  refreshExpires_in: string;
  idToken: string;
  username: string;
};
