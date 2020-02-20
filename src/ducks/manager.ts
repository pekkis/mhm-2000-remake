import {
  GAME_SEASON_START,
  GAME_QUIT_TO_MAIN_MENU,
  GAME_LOAD_STATE,
  GameQuitToMainMenuAction,
  GameLoadStateAction,
  GameSeasonStartAction
} from "./game";
import { MapOf, SeasonStrategies } from "../types/base";
import { HumanManager, Manager } from "../types/manager";
import {
  append,
  over,
  assocPath,
  dissocPath,
  ifElse,
  values,
  find,
  lensProp,
  map,
  mergeLeft,
  assoc
} from "ramda";
import {
  TeamRemoveManagerAction,
  TeamAddManagerAction,
  TEAM_REMOVE_MANAGER,
  TEAM_ADD_MANAGER
} from "./team";
import { managers } from "../services/manager";
import { TeamOrganization, Lineup } from "../types/team";

export const MANAGER_NEXT = "MANAGER_NEXT";
export const MANAGER_ADD = "MANAGER_ADD";
export const MANAGER_SET_ACTIVE = "MANAGER_SET_ACTIVE";
export const MANAGER_BUDGET_ORGANIZATION = "MANAGER_BUDGET_ORGANIZATION";
export const MANAGER_SELECT_STRATEGY = "MANAGER_SELECT_STRATEGY";
export const MANAGER_LINEUP_AUTOMATE = "MANAGER_LINEUP_AUTOMATE";
export const MANAGER_LINEUP_SET = "MANAGER_LINEUP_SET";
export const MANAGER_SELECT_INTENSITY = "MANAGER_SELECT_INTENSITY";

export interface ManagerSelectIntensityAction {
  type: typeof MANAGER_SELECT_INTENSITY;
  payload: {
    manager: string;
    intensity: number;
  };
}

export interface ManagerLineupAutomateAction {
  type: typeof MANAGER_LINEUP_AUTOMATE;
  payload: {
    manager: string;
  };
}

export interface ManagerLineupSetAction {
  type: typeof MANAGER_LINEUP_SET;
  payload: {
    manager: string;
    lineup: Lineup;
  };
}

export interface ManagerAddManagerAction {
  type: typeof MANAGER_ADD;
  payload: Manager;
}

export interface ManagerSetActiveAction {
  type: typeof MANAGER_SET_ACTIVE;
  payload: HumanManager;
}

export interface ManagerSelectStrategyAction {
  type: typeof MANAGER_SELECT_STRATEGY;
  payload: { manager: string; strategy: SeasonStrategies };
}

export interface ManagerBudgetOrganizationAction {
  type: typeof MANAGER_BUDGET_ORGANIZATION;
  payload: { manager: string; budget: TeamOrganization };
}

export interface ManagerState {
  active: string | undefined;
  managers: MapOf<Manager | HumanManager>;
}

const defaultState: ManagerState = {
  active: undefined,
  managers: managers
};

export const addManager = (manager: HumanManager): ManagerAddManagerAction => {
  return {
    type: MANAGER_ADD,
    payload: manager
  };
};

export const toggleService = (manager, service) => {
  return {
    type: "MANAGER_TOGGLE_SERVICE",
    payload: {
      manager,
      service
    }
  };
};

export const buyPlayer = (manager, playerType) => {
  return {
    type: "MANAGER_BUY_PLAYER",
    payload: {
      manager,
      playerType
    }
  };
};

export const selectStrategy = (
  manager: string,
  strategy: SeasonStrategies
): ManagerSelectStrategyAction => {
  return {
    type: MANAGER_SELECT_STRATEGY,
    payload: {
      manager,
      strategy
    }
  };
};

export const budgetOrganization = (
  manager: string,
  budget: TeamOrganization
): ManagerBudgetOrganizationAction => {
  return {
    type: MANAGER_BUDGET_ORGANIZATION,
    payload: {
      manager,
      budget
    }
  };
};

export const improveArena = manager => {
  return {
    type: "MANAGER_IMPROVE_ARENA",
    payload: {
      manager
    }
  };
};

export const sellPlayer = (manager, playerType) => {
  return {
    type: "MANAGER_SELL_PLAYER",
    payload: {
      manager,
      playerType
    }
  };
};

export const crisisMeeting = manager => {
  return {
    type: "MANAGER_CRISIS_MEETING",
    payload: {
      manager
    }
  };
};

type ManagerActions =
  | GameQuitToMainMenuAction
  | GameLoadStateAction
  | ManagerAddManagerAction
  | GameSeasonStartAction
  | TeamRemoveManagerAction
  | TeamAddManagerAction
  | ManagerSetActiveAction;

export default function managerReducer(
  state: ManagerState = defaultState,
  action: ManagerActions
) {
  switch (action.type) {
    case GAME_QUIT_TO_MAIN_MENU:
      return defaultState;

    case GAME_LOAD_STATE:
      return action.payload.manager;

    case MANAGER_ADD:
      return assocPath(["managers", action.payload.id], action.payload, state);

    case TEAM_REMOVE_MANAGER:
      const manager = find(
        m => m.team === action.payload.team,
        values(state.managers)
      );
      if (!manager) {
        return state;
      }
      return dissocPath(["managers", manager.id, "team"], state);

    case TEAM_ADD_MANAGER:
      return assocPath(
        ["managers", action.payload.manager, "team"],
        action.payload.team,
        state
      );

    case GAME_SEASON_START:
      return over(
        lensProp("managers"),
        map(
          mergeLeft({
            pranksExecuted: 0
          })
        ),
        state
      );

    case MANAGER_SET_ACTIVE:
      return assoc("active", action.payload, state);

    case "MANAGER_SET_FLAG":
      return state.setIn(
        ["managers", payload.manager, "flags", payload.flag],
        payload.value
      );

    case "MANAGER_SET_SERVICE":
      return state.setIn(
        ["managers", payload.manager, "services", payload.service],
        payload.value
      );

    case "MANAGER_INCREMENT_BALANCE":
      return state.updateIn(
        ["managers", payload.manager, "balance"],
        b => b + payload.amount
      );

    case "MANAGER_SET_BALANCE":
      return state.setIn(
        ["managers", payload.manager, "balance"],
        payload.amount
      );

    case "MANAGER_DECREMENT_BALANCE":
      return state.updateIn(
        ["managers", payload.manager, "balance"],
        b => b - payload.amount
      );

    case "MANAGER_INCREMENT_INSURANCE_EXTRA":
      return state.updateIn(
        ["managers", payload.manager, "insuranceExtra"],
        ie => ie + payload.amount
      );

    case "MANAGER_SET_EXTRA":
      return state.setIn(["managers", payload.manager, "extra"], payload.extra);

    case "MANAGER_SET_INSURANCE_EXTRA":
      return state.setIn(
        ["managers", payload.manager, "insuranceExtra"],
        payload.value
      );

    case "MANAGER_RENAME_ARENA":
      return state.setIn(
        ["managers", payload.manager, "arena", "name"],
        payload.name
      );

    case "MANAGER_SET_ARENA_LEVEL":
      return state.setIn(
        ["managers", payload.manager, "arena", "level"],
        payload.level
      );

    case "PRANK_ORDER":
      return state.updateIn(
        ["managers", payload.manager, "pranksExecuted"],
        p => p + 1
      );

    default:
      return state;
  }
}
