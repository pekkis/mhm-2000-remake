import { Map, List } from "immutable";

import teamData from "../services/data/teams";

import { MapOf } from "../types/base";
import { Team, TeamStrength } from "../types/team";
import {
  dissocPath,
  assocPath,
  reduce,
  over,
  lensProp,
  map,
  mergeLeft,
  pipe,
  evolve,
  dec
} from "ramda";
import {
  GAME_DECREMENT_DURATIONS,
  GAME_CLEAR_EXPIRED,
  GAME_LOAD_STATE,
  GameLoadStateAction,
  GameQuitToMainMenuAction,
  GameSeasonStartAction,
  GAME_SEASON_START,
  GameCleanupAction
} from "./game";

export interface TeamState {
  teams: MapOf<Team>;
}

export const TEAM_ADD_MANAGER = "TEAM_ADD_MANAGER";
export const TEAM_REMOVE_MANAGER = "TEAM_REMOVE_MANAGER";
export const TEAM_SET_STRENGTHS = "TEAM_SET_STRENGTHS";

const defaultState: TeamState = {
  teams: teamData
};

export interface TeamRemoveManagerAction {
  type: typeof TEAM_REMOVE_MANAGER;
  payload: {
    team: string;
  };
}

export interface TeamAddManagerAction {
  type: typeof TEAM_ADD_MANAGER;
  payload: {
    team: string;
    manager: string;
  };
}

export interface TeamSetStrengthsAction {
  type: typeof TEAM_SET_STRENGTHS;
  payload: [string, TeamStrength][];
}

type TeamActions =
  | GameLoadStateAction
  | GameQuitToMainMenuAction
  | TeamRemoveManagerAction
  | TeamAddManagerAction
  | GameSeasonStartAction
  | TeamSetStrengthsAction
  | GameCleanupAction;

const teamReducer = (state: TeamState = defaultState, action: TeamActions) => {
  switch (action.type) {
    case GAME_LOAD_STATE:
      return action.payload.team;

    case GAME_SEASON_START:
      return over(
        lensProp("teams"),
        map(
          mergeLeft({
            effects: [],
            opponentEffects: [],
            morale: 0,
            strategy: 2,
            readiness: 0
          })
        ),
        state
      );

    case TEAM_REMOVE_MANAGER:
      return dissocPath(["teams", action.payload.team, "manager"], state);

    case TEAM_ADD_MANAGER:
      return assocPath(
        ["teams", action.payload.team, "manager"],
        action.payload.manager,
        state
      );

    case TEAM_SET_STRENGTHS:
      return reduce(
        (a, [id, strength]) =>
          assocPath(["teams", id, "strength"], strength, a),
        state,
        action.payload
      );

    case GAME_CLEAR_EXPIRED:
      return over(
        lensProp("teams"),
        map(
          evolve({
            effects: {
              duration: dec
            },
            opponentEffects: {
              duration: dec
            }
          })
        ),
        state
      );

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

    default:
      return state;
  }
};

export default teamReducer;
