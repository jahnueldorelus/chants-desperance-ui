import { APIRequestMethod } from "@app-types/services/api";
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
   * Sends an API request to process SSO.
   * @param url The url to send the request to
   * @param method The method of the API request
   * @param data The data to send along with the request
   */
  public async sendSSORequest(
    url: string,
    method: APIRequestMethod,
    data?: object
  ) {
    return await apiService.request(url, {
      method,
      data: { ...data, token: this.csrfToken },
      withCredentials: true,
    });
  }

  /**
   * Sends an authenticated API request.
   * @param url The url to send the request to
   * @param method The method of the API request
   * @param data The data to send along with the request
   */
  public async sendAuthenticatedRequest(
    url: string,
    method: APIRequestMethod,
    data?: object
  ) {
    return await apiService.request(url, {
      method,
      data,
      withCredentials: true,
      headers: {
        "sso-token": this.csrfToken,
      },
    });
  }
}

export const authService = new AuthService();
