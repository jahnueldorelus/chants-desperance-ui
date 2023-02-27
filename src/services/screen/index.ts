import {
  EnterFullScreenRequest,
  ExitFullScreenRequest,
  FullscreenStatusResponse,
} from "@app-types/services/screen";
import { parentWindowService } from "@services/parent-window";

class ScreenService {
  private isBrowswerInFullscreen: boolean;

  constructor() {
    this.isBrowswerInFullscreen = false;
  }

  /**
   * Saves the new fullscreen status.
   */
  setFullscreenStatus(response: FullscreenStatusResponse) {
    const updatedStatus = response.payload;
    // SEND MESSAGE TO SCREEN CONTEXT [type FullscreenStatusResponse]------------------------------
  }

  /**
   * Sends an enter fullscreen request to the parent window.
   */
  enterFullscreen() {
    const fullScreenMessage: EnterFullScreenRequest = {
      action: "enter-fullscreen",
    };
    parentWindowService.request(fullScreenMessage);
    this.isBrowswerInFullscreen = true;
  }

  /**
   * Sends an exit fullscreen request to the parent window.
   */
  exitFullscreen() {
    const fullScreenMessage: ExitFullScreenRequest = {
      action: "exit-fullscreen",
    };
    parentWindowService.request(fullScreenMessage);
    this.isBrowswerInFullscreen = false;
  }

  /**
   * Toggles fullscreen mode of the parent window
   */
  toggleFullscreen() {
    if (this.isBrowswerInFullscreen) {
      this.exitFullscreen();
    } else {
      this.enterFullscreen();
    }
  }
}

export const screenService = new ScreenService();
