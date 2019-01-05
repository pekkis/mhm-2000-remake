import { Map, List, fromJS } from "immutable";
import { GAME_ADVANCE } from "./game";

export const MANAGER_NEXT = "MANAGER_NEXT";

const defaultState = Map({
  active: 0,
  managers: List.of(
    Map({
      id: 0,
      name: "Gaylord Lohiposki",
      difficulty: 2,
      services: Map({
        coach: true,
        insurance: false,
        microphone: false,
        cheer: false
      }),
      balance: 20000000,
      arena: Map({
        name: "Anonyymi Areena",
        level: 0
      }),
      extra: 0,
      insuranceExtra: 0
    })
  )
});

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
      return fromJS(payload.manager);

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
      return state.removeIn(
        [
          "managers",
          state.get("managers").findIndex(m => m.get("team") === payload.team)
        ],
        "team"
      );

    case "TEAM_ADD_MANAGER":
      return state.setIn(["managers", payload.manager, "team"], payload.team);

    case "MANAGER_INCREMENT_INSURANCE_EXTRA":
      return state.updateIn(
        ["managers", payload.manager, "insuranceExtra"],
        ie => ie + payload.amount
      );

    case "MANAGER_INITIALIZE":
      return state.updateIn(["managers", payload.manager], p => {
        return p
          .set("name", payload.details.name)
          .set("difficulty", parseInt(payload.details.difficulty, 10))
          .setIn(["arena", "name"], payload.details.arena);
      });

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

    case GAME_ADVANCE:
      return state.set("active", 0);

    case MANAGER_NEXT:
      return state.update("active", a => a + 1);

    default:
      return state;
  }
}
