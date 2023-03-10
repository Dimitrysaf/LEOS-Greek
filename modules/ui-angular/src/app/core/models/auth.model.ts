export type AccessTokenResponse = {
  accessToken: string;
  tokenType: 'jwt';
  expiresIn: number; // date in ms
  scope: null;
  state: null;
};

export type TokenData = {
  accessToken?: string;
  expiresIn: number; // date in ms
};
