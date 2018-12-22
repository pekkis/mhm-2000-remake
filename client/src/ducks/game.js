import { Map } from "immutable";
import turnService from "../services/turn";

export const GAME_ADVANCE_REQUEST = "GAME_ADVANCE_REQUEST";
export const GAME_ADVANCE = "GAME_ADVANCE";

const defaultState = Map({
  turn: Map({
    season: 1999,
    round: 1,
    phase: 1
  })
});

export const advance = () => {
  return {
    type: GAME_ADVANCE_REQUEST
  };
};

export default function gameReducer(state = defaultState, action) {
  const { type, payload } = action;

  switch (type) {
    case GAME_ADVANCE:
      return state.update("turn", turn => turnService.advance(turn));

    default:
      return state;
  }
}
