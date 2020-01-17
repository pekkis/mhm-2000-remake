import {
  GAME_SEASON_START,
  GAME_QUIT_TO_MAIN_MENU,
  GAME_LOAD_STATE,
  GameQuitToMainMenuAction,
  GameLoadStateAction,
  GameSeasonStartAction
} from "./game";
import { MapOf } from "../types/base";
import { HumanManager, Manager } from "../types/manager";
import {
  append,
  over,
  assocPath,
  dissocPath,
  ifElse,
  values,
  find
} from "ramda";
import {
  TeamRemoveManagerAction,
  TeamAddManagerAction,
  TEAM_REMOVE_MANAGER,
  TEAM_ADD_MANAGER
} from "./team";

export const MANAGER_NEXT = "MANAGER_NEXT";
export const MANAGER_ADD = "MANAGER_ADD";

export interface ManagerAddManagerAction {
  type: typeof MANAGER_ADD;
  payload: HumanManager;
}

export interface ManagerState {
  active: string | undefined;
  managers: MapOf<Manager>;
}

const defaultState: ManagerState = {
  active: undefined,
  managers: {}
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

export const selectStrategy = (manager, strategy) => {
  return {
    type: "MANAGER_SELECT_STRATEGY",
    payload: {
      manager,
      strategy
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
  | TeamAddManagerAction;

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
      return dissocPath(["managers", manager.id, "team"]);

    case TEAM_ADD_MANAGER:
      return assocPath(
        ["managers", action.payload.manager, "team"],
        action.payload.team,
        state
      );

    case GAME_SEASON_START:
      return state.update("managers", managers => {
        return managers.map(manager => {
          return manager
            .set("pranksExecuted", 0)
            .setIn(["flags", "rally"], false);
        });
      });

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

    case "MANAGER_SET_ACTIVE":
      return state.set("active", payload);

    case "PRANK_ORDER":
      return state.updateIn(
        ["managers", payload.manager, "pranksExecuted"],
        p => p + 1
      );

    default:
      return state;
  }
}
