import { META_QUIT_TO_MAIN_MENU, META_GAME_LOAD_STATE } from "./meta";
import { SEASON_START, SEASON_END } from "./game";
import { assoc } from "ramda";
import {
  ManagerSeasonStats,
  Streak,
  ForEveryCompetition,
  CompetitionStatistics
} from "../types/base";

export const STATS_UPDATE_FROM_FACTS = "STATS_UPDATE_FROM_FACTS";
export const STATS_SET_SEASON_STAT = "STATS_SET_SEASON_STAT";

export interface SeasonStats {
  ehlChampion: number;
  presidentsTrophy: number;
  medalists: number[];
  worldChampionships: number[];
  promoted: number[];
  relegated: number[];
  managers: {
    [key: string]: ManagerSeasonStats;
  };
}

const emptyStreak: Streak = {
  win: 0,
  draw: 0,
  loss: 0,
  noLoss: 0,
  noWin: 0
};

const emptySeasonStats: Partial<SeasonStats> = {
  ehlChampion: undefined,
  presidentsTrophy: undefined,
  medalists: undefined,
  worldChampionships: undefined,
  promoted: undefined,
  relegated: undefined,
  managers: {}
};

export interface StatsState {
  currentSeason: Partial<SeasonStats>;

  managers: {
    [key: string]: {
      games: ForEveryCompetition<CompetitionStatistics>;
    };
  };

  seasons: {
    [key: string]: SeasonStats;
  };

  streaks: {
    teams: {
      [key: string]: Streak;
    };
    managers: {
      [key: string]: Streak;
    };
  };
}

const defaultState: StatsState = {
  currentSeason: emptySeasonStats,
  managers: {},
  seasons: {},
  streaks: {
    teams: {},
    managers: {}
  }
};

export default function statsReducer(state = defaultState, action): StatsState {
  const { type, payload } = action;

  switch (type) {
    case META_QUIT_TO_MAIN_MENU:
      return defaultState;

    case META_GAME_LOAD_STATE:
      return payload.stats;

    case SEASON_START:
      return assoc("currentSeason", emptySeasonStats, state);

    case SEASON_END:
      return state.update("seasons", seasons =>
        seasons.push(state.get("currentSeason"))
      );

    case STATS_SET_SEASON_STAT:
      return state.setIn(["currentSeason", ...payload.path], payload.value);

    case STATS_UPDATE_FROM_FACTS:
      return state
        .updateIn(
          ["streaks", "team", payload.team, payload.competition],
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
        )
        .update("managers", managerStats => {
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
            stats => {
              if (payload.facts.isWin) {
                return stats.update("win", stat => stat + 1);
              } else if (payload.facts.isLoss) {
                return stats.update("loss", stat => stat + 1);
              } else {
                return stats.update("draw", stat => stat + 1);
              }
            }
          );
        });

    default:
      return state;
  }
}
