import { Map, List, fromJS } from "immutable";
import { META_QUIT_TO_MAIN_MENU, META_GAME_LOAD_STATE } from "./meta";

export const STATS_UPDATE_TEAM_STREAK_FROM_FACTS =
  "STATS_UPDATE_TEAM_STREAK_FROM_FACTS";

const emptyStreak = Map({
  win: 0,
  draw: 0,
  loss: 0,
  noLoss: 0,
  noWin: 0
});

const defaultState = Map({
  streaks: Map({
    team: Map(),
    manager: Map()
  })
});

export default function statsReducer(state = defaultState, action) {
  const { type, payload } = action;

  switch (type) {
    case META_QUIT_TO_MAIN_MENU:
      return defaultState;

    case META_GAME_LOAD_STATE:
      return fromJS(payload.stats);

    case STATS_UPDATE_TEAM_STREAK_FROM_FACTS:
      return state.updateIn(
        ["streaks", "team", payload.team.toString(), payload.competition],
        emptyStreak,
        streak => {
          return streak.merge({
            win: payload.facts.isWin ? streak.get("win") + 1 : 0,
            draw: payload.facts.isDraw ? streak.get("draw") + 1 : 0,
            loss: payload.facts.isLoss ? streak.get("loss") + 1 : 0,
            noLoss:
              payload.facts.isWin || payload.facts.isDraw
                ? streak.get("noLoss") + 1
                : 0,
            noWin:
              payload.facts.isLoss || payload.facts.isDraw
                ? streak.get("noWin") + 1
                : 0
          });
        }
      );

    default:
      return state;
  }
}
