import { Map, List } from "immutable";
import { META_QUIT_TO_MAIN_MENU, META_GAME_LOAD_STATE } from "./meta";
import { SEASON_START, GAME_NEXT_TURN } from "./game";

export const BETTING_BET = "BETTING_BET";
export const BETTING_BET_REQUEST = "BETTING_BET_REQUEST";
export const BETTING_BET_CHAMPION = "BETTING_BET_CHAMPION";
export const BETTING_BET_CHAMPION_REQUEST = "BETTING_BET_CHAMPION_REQUEST";

const defaultState = Map({
  championshipBets: List(),
  bets: List()
});

export const betChampion = (manager, team, amount, odds) => {
  console.log("KVAAK BET", manager, team, amount, odds);

  return {
    type: BETTING_BET_CHAMPION_REQUEST,
    payload: {
      manager,
      team,
      amount,
      odds
    }
  };
};

export const bet = (manager, coupon, amount) => {
  return {
    type: BETTING_BET_REQUEST,
    payload: {
      manager,
      coupon,
      amount
    }
  };
};

export default function bettingReducer(state = defaultState, action) {
  const { type, payload } = action;

  switch (type) {
    case META_QUIT_TO_MAIN_MENU:
      return defaultState;

    case META_GAME_LOAD_STATE:
      return payload.betting;

    case SEASON_START:
      return state.set("championshipBets", List());

    case BETTING_BET_CHAMPION:
      return state.update("championshipBets", bets => bets.push(Map(payload)));

    case BETTING_BET:
      return state.update("bets", bets => bets.push(Map(payload)));

    case GAME_NEXT_TURN:
      return state.set("bets", List());

    default:
      return state;
  }
}
