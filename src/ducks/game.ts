import { Map, List } from "immutable";

import teams from "../data/teams";
import managers from "../data/managers";

import { META_QUIT_TO_MAIN_MENU, META_GAME_LOAD_STATE } from "./meta";
import { Reducer } from "redux";
import { getCalendar } from "../services/calendar";
import {
  MHMTurnPhase,
  MHMCalendar,
  Turn,
  Flags,
  ServiceBasePrices,
  ComputerManager,
  Team
} from "../types/base";

export const GAME_START = "GAME_START";
export const GAME_ADVANCE_REQUEST = "GAME_ADVANCE_REQUEST";
export const GAME_ADVANCE = "GAME_ADVANCE";
export const GAME_DECREMENT_DURATIONS = "GAME_DECREMENT_DURATIONS";
export const GAME_CLEAR_EXPIRED = "GAME_CLEAR_EXPIRED";
export const GAME_NEXT_TURN = "GAME_NEXT_TURN";
export const GAME_SET_PHASE = "GAME_SET_PHASE";

export const SEASON_START = "SEASON_START";
export const SEASON_END = "SEASON_END";

export interface GameState {
  turn: Turn;
  flags: Flags;
  serviceBasePrices: ServiceBasePrices;
  managers: ComputerManager[];
  calendar: MHMCalendar;
  teams: Team[];
}

const defaultState: GameState = {
  turn: {
    season: 0,
    round: 0,
    phase: undefined
  },

  flags: {
    jarko: false,
    usa: false,
    canada: false
  },

  serviceBasePrices: {
    insurance: 1000,
    coach: 3200,
    microphone: 500,
    cheer: 3000
  },

  managers,

  teams,

  calendar: getCalendar(),

  competitions: Map({
    phl: Map({
      weight: 500,
      id: "phl",
      abbr: "phl",
      phase: -1,
      name: "PHL",
      teams: List.of(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11),
      phases: List()
    }),
    division: Map({
      abbr: "div",
      weight: 1000,
      id: "division",
      phase: -1,
      name: "Divisioona",
      teams: List.of(13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24),
      phases: List()
    }),
    mutasarja: Map({
      abbr: "mut",
      weight: 2000,
      id: "mutasarja",
      phase: -1,
      name: "Mutasarja",
      teams: List.of(
        12,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47
      ),
      phases: List()
    }),
    tournaments: Map({
      weight: 2000,
      id: "tournaments",
      phase: -1,
      name: "Joulutauon turnaukset",
      abbr: "tournaments",
      phases: List(),
      teams: List()
    }),
    ehl: Map({
      weight: 2000,
      id: "ehl",
      phase: -1,
      name: "EHL",
      abbr: "ehl",
      phases: List()
    })
  }),

  worldChampionshipResults: undefined
};

export const advance = payload => {
  return {
    type: GAME_ADVANCE_REQUEST,
    payload
  };
};

export interface GameSetPhaseAction {
  type: typeof GAME_SET_PHASE;
  payload: MHMTurnPhase;
}

export const setPhase = (phase: MHMTurnPhase): GameSetPhaseAction => ({
  type: GAME_SET_PHASE,
  payload: phase
});

const gameReducer: Reducer<typeof defaultState> = (
  state = defaultState,
  action
) => {
  const { type, payload } = action;

  switch (type) {
    case META_QUIT_TO_MAIN_MENU:
      return defaultState;

    case META_GAME_LOAD_STATE:
      return payload.game;

    case "COMPETITION_REMOVE_TEAM":
      return state.updateIn(
        ["competitions", payload.competition, "teams"],
        teams => teams.filterNot(t => t === payload.team)
      );

    case "COMPETITION_ADD_TEAM":
      return state.updateIn(
        ["competitions", payload.competition, "teams"],
        teams => teams.push(payload.team)
      );

    case "COMPETITION_UPDATE_STATS":
      return state.setIn(
        [
          "competitions",
          payload.competition,
          "phases",
          payload.phase,
          "groups",
          payload.group,
          "stats"
        ],
        payload.stats
      );

    case "COMPETITION_SET_TEAMS":
      return state.setIn(
        ["competitions", payload.competition, "teams"],
        payload.teams
      );

    case "COMPETITION_START":
      return state.updateIn(["competitions", payload.competition], c => {
        return c.set("phases", List());
      });

    case "COMPETITION_SEED":
      return state
        .setIn(
          ["competitions", payload.competition, "phases", payload.phase],
          payload.seed
        )
        .setIn(["competitions", payload.competition, "phase"], payload.phase);

    case SEASON_START:
      return state
        .update("teams", teams =>
          teams.map(t => {
            return t
              .set("effects", List())
              .set("opponentEffects", List())
              .set("morale", 0)
              .set("strategy", 2)
              .set("readiness", 0);
          })
        )
        .setIn(["flags", "jarko"], false)
        .update("competitions", competitions => {
          return competitions.map(competition =>
            competition.set("phase", -1).set("phases", List())
          );
        });

    case SEASON_END:
      return state.update("turn", turn => {
        return turn.update("season", season => season + 1).set("round", -1);
      });

    case "GAME_GAME_RESULT":
      // console.log("pl", payload);

      return state.updateIn(
        [
          "competitions",
          payload.competition,
          "phases",
          payload.phase,
          "groups",
          payload.group,
          "schedule",
          payload.round,
          payload.pairing
        ],
        r => r.set("result", payload.result)
      );

    case "GAME_GAMEDAY_COMPLETE":
      return state.updateIn(
        [
          "competitions",
          payload.competition,
          "phases",
          payload.phase,
          "groups",
          payload.group
        ],
        group => {
          return group.update("round", r => r + 1);
        }
      );

    case GAME_SET_PHASE:
      return state.setIn(["turn", "phase"], payload);

    case "TEAM_INCREMENT_MORALE":
      return state.updateIn(["teams", payload.team, "morale"], m => {
        return Math.min(payload.max, Math.max(payload.min, m + payload.amount));
      });

    case "TEAM_SET_MORALE":
      return state.setIn(
        ["teams", payload.team, "morale"],
        Math.min(payload.max, Math.max(payload.min, payload.morale))
      );

    case "TEAM_SET_STRATEGY":
      return state.setIn(["teams", payload.team, "strategy"], payload.strategy);

    case "TEAM_SET_READINESS":
      return state.setIn(
        ["teams", payload.team, "readiness"],
        payload.readiness
      );

    case "TEAM_INCUR_PENALTY":
      return state.updateIn(
        [
          "competitions",
          payload.competition,
          "phases",
          payload.phase,
          "groups",
          payload.group,
          "penalties"
        ],
        List(),
        penalties => {
          return penalties.push(
            Map({
              team: payload.team,
              penalty: payload.penalty
            })
          );
        }
      );

    case "TEAM_INCREMENT_READINESS":
      return state.updateIn(
        ["teams", payload.team, "readiness"],
        r => r + payload.amount
      );

    case "TEAM_INCREMENT_STRENGTH":
      return state.updateIn(
        ["teams", payload.team, "strength"],
        m => m + payload.amount
      );

    case "TEAM_SET_STRENGTH":
      return state.setIn(["teams", payload.team, "strength"], payload.amount);

    case "TEAM_SET_STRENGTHS":
      return payload.reduce((state, entry) => {
        return state.setIn(["teams", entry.id, "strength"], entry.strength);
      }, state);

    case "TEAM_DECREMENT_STRENGTH":
      return state.updateIn(
        ["teams", payload.team, "strength"],
        m => m - payload.amount
      );

    case "TEAM_RENAME":
      return state.setIn(["teams", payload.team, "name"], payload.name);

    case "TEAM_ADD_EFFECT":
      return state.updateIn(["teams", payload.team, "effects"], effects =>
        effects.push(Map(payload.effect))
      );

    case "TEAM_ADD_OPPONENT_EFFECT":
      return state.updateIn(
        ["teams", payload.team, "opponentEffects"],
        opponentEffects => opponentEffects.push(Map(payload.effect))
      );

    case "TEAM_REMOVE_MANAGER":
      return state.removeIn(["teams", payload.team, "manager"]);

    case "TEAM_ADD_MANAGER":
      return state.setIn(["teams", payload.team, "manager"], payload.manager);

    case GAME_DECREMENT_DURATIONS:
      return state.update("teams", teams => {
        return teams.map(team => {
          return team
            .update("effects", effects => {
              return effects.map(e => e.update("duration", d => d - 1));
            })
            .update("opponentEffects", effects => {
              return effects.map(e => e.update("duration", d => d - 1));
            });
        });
      });

    case GAME_CLEAR_EXPIRED:
      return state.update("teams", teams => {
        return teams.map(team => {
          return team
            .update("effects", effects => {
              return effects.filter(e => e.get("duration") > 0);
            })
            .update("opponentEffects", effects => {
              return effects.filter(e => e.get("duration") > 0);
            });
        });
      });

    case GAME_NEXT_TURN:
      return state.updateIn(["turn", "round"], r => r + 1);

    case "GAME_SET_FLAG":
      return state.setIn(["flags", payload.flag], payload.value);

    case "GAME_SET_SERVICE_BASE_PRICE":
      return state.setIn(
        ["serviceBasePrices", payload.service],
        payload.amount
      );

    case "GAME_WORLD_CHAMPIONSHIP_RESULTS":
      return state.set("worldChampionshipResults", payload);

    default:
      return state;
  }
};

export default gameReducer;
