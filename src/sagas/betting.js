import { put, all, call } from "redux-saga/effects";
import { BETTING_BET_CHAMPION } from "../ducks/betting";
import { decrementBalance } from "./manager";

export function* betChampion(manager, team, amount, odds) {
  yield all([
    put({
      type: BETTING_BET_CHAMPION,
      payload: {
        manager,
        team,
        amount,
        odds
      }
    }),
    call(decrementBalance, manager, amount)
  ]);
}
