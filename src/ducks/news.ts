import {
  GAME_NEXT_TURN,
  GameNextTurnAction,
  GAME_QUIT_TO_MAIN_MENU,
  GAME_LOAD_STATE,
  GameQuitToMainMenuAction,
  GameLoadStateAction
} from "./game";
import { ForEveryManager } from "../types/base";
import { over, lensPath, append, assoc } from "ramda";
import { NewsPiece, Announcement } from "../types/base";

export interface NewsState {
  news: NewsPiece[];
  announcements: ForEveryManager<Announcement[]>;
}

const defaultState: NewsState = {
  news: [],
  announcements: {}
};

export const NEWS_ANNOUNCEMENT_ADD = "NEWS_ANNOUNCEMENT_ADD";
export const NEWS_ANNOUNCEMENTS_CLEAR = "NEWS_ANNOUNCEMENTS_CLEAR";
export const NEWS_ADD = "NEWS_ADD";

export interface NewsAnnouncementAddAction {
  type: typeof NEWS_ANNOUNCEMENT_ADD;
  payload: {
    manager: string;
    announcement: Announcement;
  };
}

export interface NewsAnnouncementsClearAction {
  type: typeof NEWS_ANNOUNCEMENTS_CLEAR;
}

export interface NewsNewsPieceAddAction {
  type: typeof NEWS_ADD;
  payload: NewsPiece;
}

type NewsActions =
  | NewsAnnouncementAddAction
  | NewsNewsPieceAddAction
  | NewsAnnouncementsClearAction
  | GameNextTurnAction
  | GameQuitToMainMenuAction
  | GameLoadStateAction;

export default function newsReducer(
  state = defaultState,
  action: NewsActions
): NewsState {
  switch (action.type) {
    case GAME_QUIT_TO_MAIN_MENU:
      return defaultState;

    case GAME_LOAD_STATE:
      return action.payload.news;

    case GAME_NEXT_TURN:
      return assoc("news", [], state);

    case NEWS_ANNOUNCEMENT_ADD:
      return over(
        lensPath(["announcements", action.payload.manager]),
        (announcements?: Announcement[]) => {
          return append(action.payload.announcement, announcements || []);
        },
        state
      );

    case NEWS_ANNOUNCEMENTS_CLEAR:
      return assoc("announcements", {}, state);

    case NEWS_ADD:
      return assoc("news", append(action.payload, state.news), state);

    default:
      return state;
  }
}
