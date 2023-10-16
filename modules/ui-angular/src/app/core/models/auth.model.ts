export type AccessTokenResponse = {
  accessToken: string;
  tokenType: 'jwt';
  expiresIn: number; // date in ms
  scope: null;
  state: null;
};

export type TokenData = {
  /** The LEOS API access token. */
  accessToken?: string;
  /** Expiry date of this token, in Unix time */
  expiresIn: number; // date in ms
};
