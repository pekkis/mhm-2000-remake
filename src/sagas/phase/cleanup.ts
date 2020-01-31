import { putResolve } from "redux-saga/effects";
import { GameCleanupAction, GAME_CLEAR_EXPIRED } from "../../ducks/game";
import {
  NewsAnnouncementsClearAction,
  NEWS_ANNOUNCEMENTS_CLEAR
} from "../../ducks/news";
import { EventClearEventsAction, EVENT_CLEAR_EVENTS } from "../../ducks/event";

export default function* cleanupPhase() {
  yield putResolve<NewsAnnouncementsClearAction>({
    type: NEWS_ANNOUNCEMENTS_CLEAR
  });
  yield putResolve<EventClearEventsAction>({ type: EVENT_CLEAR_EVENTS });
  yield putResolve<GameCleanupAction>({ type: GAME_CLEAR_EXPIRED });
}
