export type AuthInitiatorRequest = {
  serviceUrl: string;
};

export type AuthInitiatorResponse = {
  authUrl: string;
};

export type SSOTokenResponse = {
  token: string;
};

export type UserDataRequest = {
  token: string;
};

export type UserData = {
  firstName: string;
  lastName: string;
  isAdmin: boolean;
};
