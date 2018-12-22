import { Map, List } from "immutable";
import { GAME_ADVANCE } from "./game";

export const PLAYER_NEXT = "PLAYER_NEXT";

const defaultState = Map({
  active: 0,
  players: List.of(
    Map({
      name: "Gaylord Lohiposki"
    })
    /*
    Map({
      name: "Tussi Lärvilöinen"
    })
    */
  )
});

export default function playerReducer(state = defaultState, action) {
  const { type, payload } = action;

  switch (type) {
    case GAME_ADVANCE:
      return state.set("active", 0);

    case PLAYER_NEXT:
      return state.update("active", a => a + 1);

    default:
      return state;
  }
}
