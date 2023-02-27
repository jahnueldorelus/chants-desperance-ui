import { ParentWindowMessage } from "@app-types/services/parent-window";

type ApiRequestAction = "api";
export type ApiRequestMethod = "GET" | "PUT" | "POST" | "PATCH" | "DELETE";

export type ApiRequestPayload = {
  apiPath: string;
  apiMethod: ApiRequestMethod;
  data?: any;
};

export interface ApiRequest extends ParentWindowMessage {
  action: ApiRequestAction;
  payload: ApiRequestPayload;
}

export interface ApiResponse extends ParentWindowMessage {
  action: ApiRequestAction;
  payload: {
    apiPath: string;
    apiMethod: ApiRequestMethod;
    error?: any;
    data?: any;
  };
}

/**
 * Determines if a message from the parent window is an api response.
 * @param messageEventData The message event data to check
 */
export const isApiMessage = (
  messageEventData: ApiResponse
): messageEventData is ApiResponse => {
  return messageEventData.action === "api";
};
