import { OrderedMap, Map, List, fromJS } from "immutable";

const defaultState = OrderedMap({
  notifications: Map()
});

export const dismissNotification = id => {
  return {
    type: "NOTIFICATION_DISMISS",
    payload: id
  };
};

export default function notificationReducer(state = defaultState, action) {
  const { type, payload } = action;

  switch (type) {
    case "META_QUIT_TO_MAIN_MENU":
      return defaultState;

    case "NOTIFICATION_ADD":
      return state.update("notifications", notifications =>
        notifications.set(payload.id, payload)
      );

    case "NOTIFICATION_DISMISS":
      return state.deleteIn(["notifications", payload]);

    default:
      return state;
  }
}
