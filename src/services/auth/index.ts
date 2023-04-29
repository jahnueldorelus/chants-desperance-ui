import { APIRequestMethod, SSODataRequest } from "@app-types/services/api";
import {
  AuthInitiatorRequest,
  AuthInitiatorResponse,
  SSOTokenResponse,
  UserData,
  UserDataRequest,
} from "@app-types/services/auth";
import { apiService } from "@services/api";
import { isAxiosError } from "axios";

class AuthService {
  private csrfToken: string | null;

  constructor() {
    this.csrfToken = null;
  }

  private isUserAuthorized(): boolean {
    return !!this.csrfToken;
  }

  /**
   * Resets the auth service's authentication info
   */
  private resetUserInfo(): void {
    this.csrfToken = null;
  }

  /**
   * Attempts to authorize the user through SSO.
   * @returns The url to authorize the user or null if an error occurred
   */
  public async getUserAuthorized(): Promise<string | null> {
    try {
      const requestData: AuthInitiatorRequest = {
        serviceUrl: location.href,
      };
      const response = await this.sendSSORequest(
        apiService.routes.post.sso,
        "POST",
        requestData
      );

      if (isAxiosError(response)) {
        throw response;
      }

      const { authUrl } = <AuthInitiatorResponse>response.data;

      return authUrl;
    } catch (error) {
      return null;
    }
  }

  /**
   * Attempts to sign out the user through SSO.
   */
  public async signOutUser(): Promise<boolean> {
    if (this.isUserAuthorized()) {
      try {
        const response = await this.sendSSORequest(
          apiService.routes.post.ssoSignOut,
          "POST"
        );

        if (isAxiosError(response)) {
          throw Error();
        }

        this.resetUserInfo();
        return true;
      } catch (error) {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Attempts to sign in the user through SSO only if they're not
   * signed in.
   */
  public async signInUser(): Promise<UserData | string | null> {
    if (!this.isUserAuthorized()) {
      const userData = await this.getUserToken();
      if (!userData) {
        return await this.getUserAuthorized();
      }

      return userData;
    }
    
    return null;
  }

  public async getUserReauthorized(): Promise<UserData | null> {
    if (!this.isUserAuthorized()) {
      return await this.getUserToken();
    }

    return null;
  }

  /**
   * Attempts to retrieve a new token to validate the user's future requests.
   */
  private async getUserToken(): Promise<UserData | null> {
    try {
      const response = await this.sendSSORequest(
        apiService.routes.get.ssoToken,
        "GET"
      );

      if (isAxiosError(response)) {
        throw Error();
      }

      const result = <SSOTokenResponse>response.data;
      this.csrfToken = result.token;

      return await this.getUserInfo();
    } catch (error) {
      return null;
    }
  }

  /**
   * Retrieves the user's information.
   */
  public async getUserInfo(): Promise<UserData | null> {
    try {
      const requestData: UserDataRequest = {
        token: this.csrfToken || "",
      };
      const response = await this.sendSSORequest(
        apiService.routes.post.ssoUser,
        "POST",
        requestData
      );

      if (isAxiosError(response)) {
        throw Error();
      }

      return <UserData>response.data;
    } catch (error) {
      return null;
    }
  }

  /**
   * Sends an API request with required SSO info
   * @param url The url to send the request to
   * @param method The method of the API request
   * @param data The data to send along with the request
   */
  public async sendSSORequest(
    url: string,
    method: APIRequestMethod,
    data?: object
  ) {
    const requestData = data ? data : {};

    return await apiService.request(url, {
      method,
      data: { ...requestData, token: this.csrfToken || undefined },
      withCredentials: true,
    });
  }

  /**
   * Sends an API request that requires SSO validation from the authentication
   * API before being sent to this service's API.
   * @param url The url of where the request will be sent
   *            after passing SSO validation
   * @param method The method of the API request that will be
   *               sent after passing SSO validation
   * @param data The data to tag along to the request
   */
  public async sendSSODataToAPI(
    url: string,
    method: APIRequestMethod,
    data?: object
  ) {
    // Signs in the user if they're not signed in
    this.signInUser();

    // The host of this service's api server
    const apiHost =
      // @ts-ignore
      import.meta.env.VITE_ENVIRONMENT === "production"
        ? // @ts-ignore
          import.meta.env.VITE_API_PROD_URL
        : // @ts-ignore
          import.meta.env.VITE_API_DEV_URL;

    /**
     * Required request body info for the authentication server to
     * proxy a request to this service's API with the user's credentials
     * validated.
     */
    const ssoData: SSODataRequest = {
      apiHost,
      apiUrl: url,
      apiMethod: method,
    };

    return await this.sendSSORequest(
      apiService.routes.post.ssoDataToApi,
      "POST",
      {
        ...ssoData,
        ...data,
      }
    );
  }

  /**
   * Creates a text in title case form.
   * (First letter is capitalized and the rest are
   * lowercased).
   * @param text The text to title case
   */
  public titleCase(text: string): string {
    if (text.length === 0) {
      return "";
    } else if (text.length === 1) {
      return text.toLocaleUpperCase();
    } else {
      return text[0]?.toLocaleUpperCase() + text.slice(1).toLocaleLowerCase();
    }
  }
}

export const authService = new AuthService();
