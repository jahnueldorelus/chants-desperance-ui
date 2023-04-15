import { AxiosRequestConfig, Method } from "axios";

export type APIRoute = {
  get: {
    books: {
      all: string;
      byId: string;
    };
    songs: {
      all: string;
      byBookId: string;
      bySongId: string;
    };
    verses: {
      bySongId: string;
      byVerseId: string;
    };
    ssoToken: string;
  };
  post: {
    songs: {
      favorites: string;
    };
    sso: string;
    ssoUser: string;
    ssoDataToApi: string;
  };
};

export type APIRequestMethod = Method;

export interface APIRequestConfig extends AxiosRequestConfig {
  method: APIRequestMethod;
}

export type DataRequest = {
  serviceId: string;
  apiPath: string;
  apiMethod: string;
};

export type SSODataRequest = {
  [key: string]: string;
  apiUrl: string;
  apiHost: string;
  apiMethod: APIRequestMethod;
};
