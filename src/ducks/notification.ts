import { GAME_QUIT_TO_MAIN_MENU, GameQuitToMainMenuAction } from "./game";
import { Reducer } from "redux";
import { dissocPath, assocPath } from "ramda";

export interface MHMNotification {
  id: string;
  message: string;
}

export interface NotificationState {
  notifications: {
    [key: string]: MHMNotification;
  };
}

export const NOTIFICATION_ADD = "NOTIFICATION_ADD";
export const NOTIFICATION_DISMISS = "NOTIFICATION_DISMISS";

const defaultState: NotificationState = {
  notifications: {}
};

export interface NotificationDismissAction {
  type: typeof NOTIFICATION_DISMISS;
  payload: string;
}

export interface NotificationAddAction {
  type: typeof NOTIFICATION_ADD;
  payload: MHMNotification;
}

export const dismissNotification = (id: string): NotificationDismissAction => {
  return {
    type: NOTIFICATION_DISMISS,
    payload: id
  };
};

type NotificationActions =
  | GameQuitToMainMenuAction
  | NotificationDismissAction
  | NotificationAddAction;

const notificationReducer: Reducer<NotificationState, NotificationActions> = (
  state = defaultState,
  action: NotificationActions
): NotificationState => {
  switch (action.type) {
    case GAME_QUIT_TO_MAIN_MENU:
      return defaultState;

    case NOTIFICATION_ADD:
      return assocPath<MHMNotification, NotificationState>(
        ["notifications", action.payload.id],
        action.payload
      )(state);

    case NOTIFICATION_DISMISS:
      return dissocPath<NotificationState>(["notifications", action.payload])(
        state
      );

    default:
      return state;
  }
};

export default notificationReducer;
