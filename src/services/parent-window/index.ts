import { ApiRequest, ApiResponse, isApiMessage } from "@app-types/services/api";
import {
  EnterFullScreenRequest,
  ExitFullScreenRequest,
  FullscreenStatusResponse,
  isFullscreenStatusMessage,
} from "@app-types/services/screen";
import { apiService } from "@services/api";
import { screenService } from "@services/screen";

class ParentWindowService {
  private parentWindow: Window | null;
  private trustedOrigin: string;

  constructor() {
    this.parentWindow = window.top || null;
    this.trustedOrigin = "https://cloud-dev.jahnueldorelus.com";
    this.setupListenerForParentWindow();
  }

  setupListenerForParentWindow() {
    if (this.parentWindow) {
      window.onmessage = (event: MessageEvent) => {
        const origin = event.origin;

        // Checks to make sure the message is from a trusted origin
        if (origin === this.trustedOrigin) {
          // If response is from an api request
          if (isApiMessage(event.data)) {
            const response: ApiResponse = event.data;
            apiService.handleRequestResponse(response);
          }

          // If response is from a fullscreen status update
          else if (isFullscreenStatusMessage(event.data)) {
            const response: FullscreenStatusResponse = event.data;
            screenService.setFullscreenStatus(response);
          }
        }
      };
    }
  }

  /**
   * Sends a request to the parent window.
   * @param request The request to send
   */
  request(
    request: ApiRequest | EnterFullScreenRequest | ExitFullScreenRequest
  ) {
    if (this.parentWindow) {
      this.parentWindow.postMessage(request, this.trustedOrigin);
    }
  }

  /**
   * Removes the function that handles receiving events from the window.
   */
  destroyListener(): void {
    if (this.parentWindow) {
      window.onmessage = null;
    }
  }
}

export const parentWindowService = new ParentWindowService();
