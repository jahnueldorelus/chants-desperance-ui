export type AuthInitiatorRequest = {
  serviceUrl: string;
};

export type AuthInitiatorResponse = {
  authUrl: string;
};

export type SSOTokenResponse = {
  token: string;
};
