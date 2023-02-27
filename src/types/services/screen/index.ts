import { ParentWindowMessage } from "@app-types/services/parent-window";

export interface ScreenRequest
  extends Pick<Partial<ParentWindowMessage>, "action"> {
  action: "enter-fullscreen" | "exit-fullscreen";
}

export interface EnterFullScreenRequest extends ScreenRequest {
  action: "enter-fullscreen";
}

export interface ExitFullScreenRequest extends ScreenRequest {
  action: "exit-fullscreen";
}

export interface FullscreenStatusResponse extends ParentWindowMessage {
  action: "fullscreen-mode";
  payload: boolean;
}

/**
 * Determines if a message from the parent window is a fullscreen response.
 * @param messageEventData The message event data to check
 */
export const isFullscreenStatusMessage = (
  messageEventData: FullscreenStatusResponse
): messageEventData is FullscreenStatusResponse => {
  return messageEventData.action === "fullscreen-mode";
};
