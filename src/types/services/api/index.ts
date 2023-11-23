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
      favorites: string;
    };
    verses: {
      bySongId: string;
      byVerseId: string;
    };
    ssoToken: string;
  };
  post: {
    songs: {
      addFavorite: string;
      removeFavorite: string;
      addOrUpdate: string;
    };
    ssoSignInAuthRedirect: string;
    ssoUser: string;
    ssoDataToApi: string;
    ssoSignOutAuthRedirect: string;
  };
  delete: {
    song: string;
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
