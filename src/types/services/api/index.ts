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
  };
};

export interface APIRequestConfig extends AxiosRequestConfig {
  method: Method;
}

export type DataRequest = {
  serviceId: string;
  apiPath: string;
  apiMethod: string;
};
