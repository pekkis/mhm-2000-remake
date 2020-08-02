import {
  GAME_SEASON_START,
  GAME_SEASON_END,
  GAME_QUIT_TO_MAIN_MENU,
  GAME_LOAD_STATE,
  GameQuitToMainMenuAction,
  GameLoadStateAction,
  GameSeasonEndAction
} from "./game";
import { assoc, over, lensProp, append, pipe, reduce, lensPath } from "ramda";
import {
  ManagerStatistic,
  TeamStatistic,
  SeasonStatistic
} from "../types/stats";
import { initialTeamStats, initialSeasonStats } from "../services/team";
import { MapOf } from "../types/base";

export const STATS_UPDATE_FROM_FACTS = "STATS_UPDATE_FROM_FACTS";
export const STATS_SET_SEASON_STAT = "STATS_SET_SEASON_STAT";

export interface StatsState {
  managers: MapOf<ManagerStatistic>;

  teams: MapOf<TeamStatistic>;

  seasons: SeasonStatistic[];
}

const defaultState: StatsState = {
  managers: {},
  teams: initialTeamStats(),
  seasons: initialSeasonStats()
};

type StatsActions =
  | GameQuitToMainMenuAction
  | GameLoadStateAction
  | GameSeasonEndAction;

export default function statsReducer(
  state = defaultState,
  action: StatsActions
): StatsState {
  switch (action.type) {
    case GAME_QUIT_TO_MAIN_MENU:
      return defaultState;

    case GAME_LOAD_STATE:
      return action.payload.stats;

    /*
    case GAME_SEASON_START:
      return assoc("currentSeason", emptySeasonStats, state);
    */

    case GAME_SEASON_END:
      return pipe<StatsState, StatsState, StatsState>(
        over(lensProp("seasons"), append(action.payload.seasonStats)),
        (state) =>
          reduce(
            (s, ranking) => {
              return over(
                lensPath(["teams", ranking.id, "ranking"]),
                append(ranking.ranking),
                s
              );
            },
            state,
            action.payload.rankings
          )
      )(state);

    case STATS_SET_SEASON_STAT:
      return state.setIn(["currentSeason", ...payload.path], payload.value);

    case STATS_UPDATE_FROM_FACTS:
      return state
        .updateIn(
          ["streaks", "team", payload.team, payload.competition],
          emptyStreak,
          (streak) => {
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
        )
        .update("managers", (managerStats) => {
          if (!payload.manager) {
            return managerStats;
          }

          return managerStats.updateIn(
            [payload.manager, "games", payload.competition, payload.phase],
            Map({
              win: 0,
              draw: 0,
              loss: 0
            }),
            (stats) => {
              if (payload.facts.isWin) {
                return stats.update("win", (stat) => stat + 1);
              } else if (payload.facts.isLoss) {
                return stats.update("loss", (stat) => stat + 1);
              } else {
                return stats.update("draw", (stat) => stat + 1);
              }
            }
          );
        });

    default:
      return state;
  }
}
