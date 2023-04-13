import {
  AuthInitiatorRequest,
  AuthInitiatorResponse,
  SSOTokenResponse,
} from "@app-types/services/auth";
import { apiService } from "@services/api";
import { isAxiosError } from "axios";

class AuthService {
  private setAuthUrl: ((url: string) => void) | null;
  private csrfToken: string | null;

  constructor() {
    this.setAuthUrl = null;
    this.csrfToken = null;
  }

  get userToken() {
    return this.csrfToken;
  }

  set authUrlMethod(arg0: (url: string) => void) {
    this.setAuthUrl = arg0;
  }

  isUserAuthorized(): boolean {
    return !!this.csrfToken;
  }

  private async getUserAuthorized(): Promise<void> {
    if (this.setAuthUrl) {
      try {
        const requestData: AuthInitiatorRequest = {
          serviceUrl: location.href,
        };
        const response = await apiService.request(apiService.routes.post.sso, {
          method: "POST",
          data: requestData,
          withCredentials: true,
        });

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

  async getUserToken(): Promise<void> {
    try {
      const response = await apiService.request(
        apiService.routes.get.ssoToken,
        { method: "GET", withCredentials: true }
      );

      if (isAxiosError(response)) {
        throw Error();
      }

      const result = <SSOTokenResponse>response.data;
      this.csrfToken = result.token;
    } catch (error) {
      await this.getUserAuthorized();
    }
  }
}

export const authService = new AuthService();
