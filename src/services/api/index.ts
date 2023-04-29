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

  private baseApiBooksPath = this.baseApiPath + "/api/categories";
  private baseApiSongsPath = this.baseApiPath + "/api/songs";
  private baseApiVersesPath = this.baseApiPath + "/api/verses";
  private baseApiFavoritesPath = this.baseApiSongsPath + "/favorites";

  private baseAuthApiPath =
    // @ts-ignore
    import.meta.env.VITE_ENVIRONMENT === "production"
      ? // @ts-ignore
        import.meta.env.VITE_AUTH_API_PROD_URL
      : // @ts-ignore
        import.meta.env.VITE_AUTH_API_DEV_URL;

  private baseAuthSSOPath = this.baseAuthApiPath + "/api/sso";

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
          favorites: this.baseApiFavoritesPath,
        },
        verses: {
          bySongId: this.baseApiVersesPath.concat("/song/"),
          byVerseId: this.baseApiVersesPath,
        },
        ssoToken: this.baseAuthSSOPath + "/sso-token",
      },
      post: {
        songs: {
          addFavorite: this.baseApiFavoritesPath.concat("/add"),
          removeFavorite: this.baseApiFavoritesPath.concat("/remove"),
        },
        sso: this.baseAuthSSOPath + "/sso",
        ssoUser: this.baseAuthSSOPath + "/sso-user",
        ssoDataToApi: this.baseAuthSSOPath + "/sso-data",
        ssoSignOut: this.baseAuthSSOPath + "/sign-out"
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
