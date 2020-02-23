import { List, Map } from "immutable";
import {
  add,
  assocPath,
  dec,
  dissocPath,
  evolve,
  lensPath,
  lensProp,
  map,
  mergeLeft,
  over,
  pipe,
  reduce
} from "ramda";
import { normalizeMorale, teamData } from "../services/team";
import { MapOf, SeasonStrategies } from "../types/base";
import {
  ComputerControlledTeam,
  HumanControlledTeam,
  Lineup,
  Team,
  TeamEffect,
  TeamOrganization,
  TeamStrength
} from "../types/team";
import {
  GameCleanupAction,
  GameDecrementDurationsActions,
  GameLoadStateAction,
  GameQuitToMainMenuAction,
  GameSeasonStartAction,
  GAME_CLEAR_EXPIRED,
  GAME_DECREMENT_DURATIONS,
  GAME_LOAD_STATE,
  GAME_QUIT_TO_MAIN_MENU,
  GAME_SEASON_START
} from "./game";

export interface TeamState {
  teams: MapOf<HumanControlledTeam | ComputerControlledTeam>;
}

export const TEAM_ADD_MANAGER = "TEAM_ADD_MANAGER";
export const TEAM_REMOVE_MANAGER = "TEAM_REMOVE_MANAGER";
export const TEAM_SET_STRENGTHS = "TEAM_SET_STRENGTHS";
export const TEAM_INCREMENT_READINESS = "TEAM_INCREMENT_READINESS";
export const TEAM_SET_STRATEGY = "TEAM_SET_STRATEGY";
export const TEAM_SET_ORGANIZATION = "TEAM_SET_ORGANIZATION";
export const TEAM_SET_LINEUP = "TEAM_SET_LINEUP";
export const TEAM_INCREMENT_MORALE = "TEAM_INCREMENT_MORALE";
export const TEAM_SET_INTENSITY = "TEAM_SET_INTENSITY";

const defaultState: TeamState = {
  teams: teamData
};

export interface TeamSetLineupAction {
  type: typeof TEAM_SET_LINEUP;
  payload: {
    team: string;
    lineup: Lineup;
  };
}

export interface TeamSetIntensityAction {
  type: typeof TEAM_SET_INTENSITY;
  payload: {
    team: string;
    intensity: number;
  };
}

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
    isHuman: boolean;
  };
}

export interface TeamSetStrengthsAction {
  type: typeof TEAM_SET_STRENGTHS;
  payload: [string, TeamStrength][];
}

export interface TeamSetStrategyAction {
  type: typeof TEAM_SET_STRATEGY;
  payload: {
    team: string;
    strategy: SeasonStrategies;
    readiness: number;
  };
}

export interface TeamSetOrganizationAction {
  type: typeof TEAM_SET_ORGANIZATION;
  payload: {
    team: string;
    organization: TeamOrganization;
  };
}

export interface TeamIncrementReadinessAction {
  type: typeof TEAM_INCREMENT_READINESS;
  payload: {
    team: string;
    amount: number;
  }[];
}

export interface TeamIncrementMoraleAction {
  type: typeof TEAM_INCREMENT_MORALE;
  payload: {
    team: string;
    amount: number;
  }[];
}

type TeamActions =
  | GameLoadStateAction
  | GameQuitToMainMenuAction
  | TeamRemoveManagerAction
  | TeamAddManagerAction
  | GameSeasonStartAction
  | TeamSetStrengthsAction
  | GameCleanupAction
  | TeamIncrementReadinessAction
  | GameDecrementDurationsActions
  | TeamSetStrategyAction
  | TeamSetOrganizationAction
  | TeamSetLineupAction
  | TeamIncrementMoraleAction
  | TeamSetIntensityAction;

const teamReducer = (state: TeamState = defaultState, action: TeamActions) => {
  switch (action.type) {
    case GAME_LOAD_STATE:
      return action.payload.team;

    case GAME_QUIT_TO_MAIN_MENU:
      return defaultState;

    case GAME_SEASON_START:
      return over(
        lensProp("teams"),
        map(
          mergeLeft({
            effects: [],
            opponentEffects: [],
            morale: 0,
            readiness: 0
          })
        ),
        state
      );

    case TEAM_SET_INTENSITY:
      return assocPath(
        ["teams", action.payload.team, "intensity"],
        action.payload.intensity,
        state
      );

    case TEAM_SET_LINEUP:
      return assocPath(
        ["teams", action.payload.team, "lineup"],
        action.payload.lineup,
        state
      );

    case TEAM_REMOVE_MANAGER:
      return dissocPath(["teams", action.payload.team, "manager"], state);

    case TEAM_ADD_MANAGER:
      return over(
        lensPath(["teams", action.payload.team]),
        mergeLeft({
          manager: action.payload.manager,
          isHumanControlled: action.payload.isHuman
        }),
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

    case TEAM_INCREMENT_READINESS:
      return reduce(
        (a, increment) =>
          over(
            lensPath(["teams", increment.team]),
            evolve({
              readiness: add(increment.amount)
            }),
            a
          ),
        state,
        action.payload
      );

    case TEAM_INCREMENT_MORALE:
      return reduce(
        (a, increment) =>
          over(
            lensPath(["teams", increment.team]),
            evolve({
              morale: value => normalizeMorale(value + increment.amount)
            }),
            a
          ),
        state,
        action.payload
      );

    case GAME_DECREMENT_DURATIONS:
      return over(
        lensProp("teams"),
        map<Team, Team>(t => {
          return evolve(
            {
              effects: map<TeamEffect, TeamEffect>(evolve({ duration: dec })),
              opponentEffects: map<TeamEffect, TeamEffect>(
                evolve({ duration: dec })
              )
            },
            t
          );
        }),
        state
      );

    case TEAM_SET_STRATEGY:
      return pipe<TeamState, TeamState, TeamState>(
        assocPath(
          ["teams", action.payload.team, "strategy"],
          action.payload.strategy
        ),
        assocPath(
          ["teams", action.payload.team, "readiness"],
          action.payload.readiness
        )
      )(state);

    case TEAM_SET_ORGANIZATION:
      return assocPath(
        ["teams", action.payload.team, "organization"],
        action.payload.organization,
        state
      );

    case "TEAM_SET_MORALE":
      return state.setIn(
        ["teams", payload.team, "morale"],
        Math.min(payload.max, Math.max(payload.min, payload.morale))
      );

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
