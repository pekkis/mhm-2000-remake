import {
  GameQuitToMainMenuAction,
  GameLoadStateAction,
  GAME_QUIT_TO_MAIN_MENU,
  GAME_LOAD_STATE
} from "./game";
import { MHMEvent } from "../types/base";
import { assoc, assocPath } from "ramda";

export const EVENT_ADD = "EVENT_ADD";
export const EVENT_RESOLVE = "EVENT_RESOLVE";
export const EVENT_CLEAR_EVENTS = "EVENT_CLEAR_EVENTS";
export const EVENT_SET_PROCESSED = "EVENT_SET_PROCESSED";

export interface EventAddAction {
  type: typeof EVENT_ADD;
  payload: MHMEvent;
}

export interface EventResolveAction {
  type: typeof EVENT_RESOLVE;
  payload: MHMEvent;
}

export interface EventClearEventsAction {
  type: typeof EVENT_CLEAR_EVENTS;
}

export interface EventSetProcessedAction {
  type: typeof EVENT_SET_PROCESSED;
  payload: string;
}

export interface EventState {
  events: {
    [key: string]: MHMEvent;
  };
}

const defaultState: EventState = {
  events: {}
};

export const resolveEvent = (event, value) => {
  return {
    type: "EVENT_RESOLVE_REQUEST",
    payload: {
      event,
      value
    }
  };
};

type EventActions =
  | EventAddAction
  | EventClearEventsAction
  | EventResolveAction
  | EventSetProcessedAction
  | GameQuitToMainMenuAction
  | GameLoadStateAction;

export default function eventReducer(
  state = defaultState,
  action: EventActions
) {
  switch (action.type) {
    case GAME_QUIT_TO_MAIN_MENU:
      return defaultState;

    case GAME_LOAD_STATE:
      return action.payload.event;

    case EVENT_ADD:
      return assocPath(["events", action.payload.id], action.payload, state);

    case EVENT_RESOLVE:
      // TODO: Wut?
      return assocPath(["events", action.payload.id], action.payload, state);

    case EVENT_CLEAR_EVENTS:
      return assoc("events", {}, state);

    case EVENT_SET_PROCESSED:
      return assocPath(["events", action.payload, "processed"], true, state);

    default:
      return state;
  }
}
