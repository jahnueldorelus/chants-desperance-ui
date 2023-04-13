import { APIRoute, APIRequestConfig } from "@app-types/services/api";
import axios, { AxiosError, AxiosResponse } from "axios";

class APIService {
  private baseApiPath =
    // @ts-ignore
    import.meta.env.VITE_ENVIRONMENT === "production"
      ? // @ts-ignore
        import.meta.env.VITE_API_PROD_URL
      : // @ts-ignore
        import.meta.env.VITE_API_DEV_URL;

  private baseApiBooksPath = this.baseApiPath + "/categories";
  private baseApiSongsPath = this.baseApiPath + "/songs";
  private baseApiVersesPath = this.baseApiPath + "/verses";

  private baseAuthApiPath =
    // @ts-ignore
    import.meta.env.VITE_ENVIRONMENT === "production"
      ? // @ts-ignore
        import.meta.env.VITE_AUTH_API_PROD_URL
      : // @ts-ignore
        import.meta.env.VITE_AUTH_API_DEV_URL;

  private baseAuthUsersPath = this.baseAuthApiPath + "/users";

  get routes(): APIRoute {
    return {
      get: {
        books: {
          all: this.baseApiBooksPath.concat("/all/"),
          byId: this.baseApiBooksPath,
        },
        songs: {
          all: this.baseApiSongsPath.concat("/all/"),
          byBookId: this.baseApiSongsPath.concat("/all/category/"),
          bySongId: this.baseApiSongsPath,
        },
        verses: {
          bySongId: this.baseApiVersesPath.concat("/song/"),
          byVerseId: this.baseApiVersesPath,
        },
        ssoToken: this.baseAuthUsersPath + "/sso-token",
      },
      post: {
        songs: {
          favorites: this.baseApiSongsPath.concat("/favorites/"),
        },
        sso: this.baseAuthUsersPath + "/sso",
      },
    };
  }

  async request<ResponseType>(
    apiPath: string,
    config?: APIRequestConfig
  ): Promise<AxiosResponse<ResponseType> | AxiosError<any, any>> {
    try {
      return await axios(`${apiPath}`, config);
    } catch (error) {
      return <AxiosError<any, any>>error;
    }
  }
}

export const apiService = new APIService();
