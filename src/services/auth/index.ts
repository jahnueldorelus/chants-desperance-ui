import { APIRequestMethod, SSODataRequest } from "@app-types/services/api";
import {
  AuthInitiatorRequest,
  AuthInitiatorResponse,
  SSOTokenResponse,
  UserData,
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
   * Attempts to sign in the user.
   * @returns The url to authorize the user or null if an error occurred
   */
  public async signInUser(): Promise<string | null> {
    if (!this.isUserAuthorized()) {
      const requestData: AuthInitiatorRequest = {
        serviceUrl: location.href,
      };
      const response = await this.sendSSORequest(
        apiService.routes.post.ssoSignInAuthRedirect,
        "POST",
        requestData
      );

      return isAxiosError(response)
        ? null
        : (<AuthInitiatorResponse>response.data).authUrl;
    } else {
      return null;
    }
  }

  /**
   * Attempts to sign out the user.
   */
  public async signOutUser(): Promise<string | false> {
    if (this.isUserAuthorized()) {
      const requestData = { serviceUrl: location.href };

      const result = await this.sendSSORequest(
        apiService.routes.post.ssoSignOutAuthRedirect,
        "POST",
        requestData
      );

      this.resetUserInfo();

      return !isAxiosError(result) ? <string>result.data : false;
    } else {
      return false;
    }
  }

  /**
   * Retrieves the user's decrypted CSRF token.
   */
  public async getUserReauthorized(): Promise<UserData | null> {
    if (!this.isUserAuthorized()) {
      return await this.getUserToken();
    }

    return null;
  }

  /**
   * Attempts to retrieve the user's decrypted CSRF token to make
   * authenticated requests.
   */
  private async getUserToken(): Promise<UserData | null> {
    const response = await this.sendSSORequest(
      apiService.routes.get.ssoToken,
      "GET"
    );

    if (isAxiosError(response)) {
      if (response.status === 401) {
        this.resetUserInfo();
      }

      return null;
    } else {
      const result = <SSOTokenResponse>response.data;
      this.csrfToken = result.token;

      return await this.getUserInfo();
    }
  }

  /**
   * Retrieves the user's information.
   */
  public async getUserInfo(): Promise<UserData | null> {
    const response = await this.sendSSORequest(
      apiService.routes.post.ssoUser,
      "POST"
    );

    return isAxiosError(response) ? null : <UserData>response.data;
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
}

export const authService = new AuthService();
