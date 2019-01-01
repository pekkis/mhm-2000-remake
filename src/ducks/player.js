import { Map, List, fromJS } from "immutable";
import { GAME_ADVANCE } from "./game";

export const PLAYER_NEXT = "PLAYER_NEXT";

const defaultState = Map({
  active: 0,
  players: List.of(
    Map({
      id: 0,
      name: "Gaylord Lohiposki",
      team: 12,
      difficulty: 3,
      services: Map({
        insurance: true,
        microphone: false,
        cheerleaders: false
      }),
      balance: 20000000,
      arena: Map({
        name: "Anonyymi Areena",
        level: 1
      }),
      extra: 0,
      insuranceExtra: 0
    })
  )
});

export const buyPlayer = (player, playerType) => {
  return {
    type: "PLAYER_BUY_PLAYER",
    payload: {
      player,
      playerType
    }
  };
};

export const selectStrategy = (player, strategy) => {
  return {
    type: "PLAYER_SELECT_STRATEGY",
    payload: {
      player,
      strategy
    }
  };
};

export const sellPlayer = (player, playerType) => {
  return {
    type: "PLAYER_SELL_PLAYER",
    payload: {
      player,
      playerType
    }
  };
};

export default function playerReducer(state = defaultState, action) {
  const { type, payload } = action;

  switch (type) {
    case "META_QUIT_TO_MAIN_MENU":
      return defaultState;

    case "META_GAME_LOAD_STATE":
      return fromJS(payload.player);

    case "PLAYER_INCREMENT_BALANCE":
      return state.updateIn(
        ["players", payload.player, "balance"],
        b => b + payload.amount
      );

    case "PLAYER_DECREMENT_BALANCE":
      return state.updateIn(
        ["players", payload.player, "balance"],
        b => b - payload.amount
      );

    case "PLAYER_INCREMENT_INSURANCE_EXTRA":
      return state.updateIn(
        ["players", payload.player, "insuranceExtra"],
        ie => ie + payload.amount
      );

    case "PLAYER_INITIALIZE":
      return state.updateIn(["players", payload.player], p => {
        return p
          .set("name", payload.details.name)
          .set("difficulty", parseInt(payload.details.difficulty, 10))
          .setIn(["arena", "name"], payload.details.arena);
      });

    case "PLAYER_RENAME_ARENA":
      return state.setIn(
        ["players", payload.player, "arena", "name"],
        payload.name
      );

    case GAME_ADVANCE:
      return state.set("active", 0);

    case PLAYER_NEXT:
      return state.update("active", a => a + 1);

    default:
      return state;
  }
}
