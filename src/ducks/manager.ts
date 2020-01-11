import { SEASON_START } from "./game";
import { Manager } from "../types/base";

export const MANAGER_NEXT = "MANAGER_NEXT";

export interface ManagerState {
  active: string | undefined;
  managers: {
    [key: string]: Manager;
  };
}

const defaultState: ManagerState = {
  active: undefined,
  managers: {}
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

export default function managerReducer(state = defaultState, action) {
  const { type, payload } = action;

  switch (type) {
    case "META_QUIT_TO_MAIN_MENU":
      return defaultState;

    case "META_GAME_LOAD_STATE":
      return payload.manager;

    case SEASON_START:
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

    case "TEAM_REMOVE_MANAGER":
      return state.removeIn([
        "managers",
        state.get("managers").findKey(m => m.get("team") === payload.team),
        "team"
      ]);

    case "TEAM_ADD_MANAGER":
      return state.setIn(["managers", payload.manager, "team"], payload.team);

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

    case "MANAGER_ADD":
      return state.setIn(
        ["managers", payload.manager.get("id")],
        payload.manager
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
