import axios, { AxiosResponse, AxiosError } from "axios";
import { UserConsumerMethods } from "@app-types/context/user";
import { apiService } from "@services/api";

class AxiosInterceptorsService {
  private userMethods: UserConsumerMethods;

  constructor(userConsumerMethods: UserConsumerMethods) {
    this.userMethods = userConsumerMethods;
    this.setupResponseInterceptors();
  }

  /**
   * Handles unauthorized requests by sending the user to the
   * login page.
   */
  private setupResponseInterceptors() {
    axios.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        // If the request was unauthorized, the user is sent to the auth login page
        if (
          error.response &&
          error.response.status === 401 &&
          error.response.config.url !==
            apiService.routes.post.ssoSignOutAuthRedirect
        ) {
          await this.userMethods.signInUser();
        }

        return Promise.reject(error);
      }
    );
  }
}

let axiosInterceptorsService: AxiosInterceptorsService | null = null;

export const setupAxiosInterceptors = (
  userConsumerMethods: UserConsumerMethods
) => {
  if (!axiosInterceptorsService) {
    axiosInterceptorsService = new AxiosInterceptorsService(
      userConsumerMethods
    );
  }
};
