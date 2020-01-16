import {
  GAME_QUIT_TO_MAIN_MENU,
  GAME_LOAD_STATE,
  GAME_SEASON_START,
  GAME_NEXT_TURN
} from "./game";
import { assoc, over, lensProp, append } from "ramda";

export const BETTING_BET = "BETTING_BET";
export const BETTING_BET_REQUEST = "BETTING_BET_REQUEST";
export const BETTING_BET_CHAMPION = "BETTING_BET_CHAMPION";
export const BETTING_BET_CHAMPION_REQUEST = "BETTING_BET_CHAMPION_REQUEST";

export interface BettingState {
  championshipBets: ChampionshipBet[];
  bets: Bet[];
}

const defaultState: BettingState = {
  championshipBets: [],
  bets: []
};

export type BettingCouponRow = "1" | "x" | "2";

export interface Bet {
  manager: string;
  coupon: BettingCouponRow[];
  amount: number;
}

export interface ChampionshipBet {
  manager: string;
  team: number;
  amount: number;
  odds: number;
}

export interface BettingBetChampionRequestAction {
  type: typeof BETTING_BET_CHAMPION_REQUEST;
  payload: ChampionshipBet;
}

export interface BettingBetRequestAction {
  type: typeof BETTING_BET_REQUEST;
  payload: Bet;
}

export interface BettingBetAction {
  type: typeof BETTING_BET;
  payload: Bet;
}

export interface BettingBetChampionAction {
  type: typeof BETTING_BET_CHAMPION;
  payload: ChampionshipBet;
}

export const betChampion = (
  manager: string,
  team: number,
  amount: number,
  odds: number
): BettingBetChampionRequestAction => {
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

export const bet = (
  manager: string,
  coupon: BettingCouponRow[],
  amount: number
): BettingBetRequestAction => {
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
    case GAME_QUIT_TO_MAIN_MENU:
      return defaultState;

    case GAME_LOAD_STATE:
      return payload.betting;

    case GAME_SEASON_START:
      return assoc("championshipBets", [], state);

    case BETTING_BET_CHAMPION:
      return over(lensProp("championshipBets"), append(payload), state);

    case BETTING_BET:
      return over(lensProp("bets"), append(payload), state);

    case GAME_NEXT_TURN:
      return assoc("bets", [], state);

    default:
      return state;
  }
}
