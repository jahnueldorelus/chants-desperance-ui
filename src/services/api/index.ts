import {
  ApiRequest,
  ApiRequestPayload,
  ApiResponse,
} from "@app-types/services/api";
import { parentWindowService } from "@services/parent-window";

class ApiService {
  handleRequestResponse(response: ApiResponse) {
    // SEND MESSAGE TO API CONTEXT [type ApiResponse]----------------------------------------
  }

  /**
   * Sends an api request to the parent window.
   * @param requestPayload The info to send with the request
   */
  request(requestPayload: ApiRequestPayload) {
    const request: ApiRequest = {
      action: "api",
      payload: requestPayload,
    };
    parentWindowService.request(request);
  }
}

export const apiService = new ApiService();
