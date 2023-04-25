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
  private setAuthUrl: ((url: string) => void) | null;
  private csrfToken: string | null;
  private userData: UserData | null;

  constructor() {
    this.setAuthUrl = null;
    this.csrfToken = null;
    this.userData = null;
  }

  get userInfo(): UserData | null {
    return this.userData;
  }

  set authUrlMethod(arg0: (url: string) => void) {
    this.setAuthUrl = arg0;
  }

  isUserAuthorized(): boolean {
    return !!this.csrfToken && !!this.userData;
  }

  /**
   * Attempts to authorize the user through SSO.
   */
  private async getUserAuthorized(): Promise<void> {
    if (this.setAuthUrl) {
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

        this.setAuthUrl(authUrl);
      } catch (error) {
        // Error will be shown in the UI through the authentication component
      }
    }
  }

  /**
   * Attempts to retrieve a new token to validate the user's future requests.
   */
  async getUserToken(): Promise<void> {
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

      await this.getUserInfo();
    } catch (error) {
      await this.getUserAuthorized();
    }
  }

  /**
   * Retrieves the user's information.
   */
  async getUserInfo(): Promise<void> {
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

      this.userData = <UserData>response.data;
    } catch (error) {
      // Error will be shown in the UI through the authentication component
    }
  }

  /**
   * Sends an API request with required SSO info
   * @param url The url to send the request to
   * @param method The method of the API request
   * @param data The data to send along with the request
   */
  async sendSSORequest(url: string, method: APIRequestMethod, data?: object) {
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
  async sendSSODataToAPI(url: string, method: APIRequestMethod, data?: object) {
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
  titleCase(text: string): string {
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
