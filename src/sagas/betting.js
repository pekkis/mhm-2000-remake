import { put, all, call, select } from "redux-saga/effects";
import { BETTING_BET_CHAMPION } from "../ducks/betting";
import { decrementBalance, incrementBalance } from "./manager";
import { addAnnouncement } from "./news";
import { amount as a } from "../services/format";

export function* processChampionBets() {
  const bets = yield select(state => state.betting.get("championshipBets"));
  const stats = yield select(state => state.stats.get("currentSeason"));

  console.log("stats", stats.toJS());

  const champion = stats.getIn(["medalists", 0]);

  for (const bet of bets) {
    if (bet.get("team") === champion) {
      const amount = Math.round(bet.get("amount") * bet.get("odds"));
      yield call(incrementBalance, bet.get("manager"), amount);
      yield call(
        addAnnouncement,
        bet.get("manager"),
        `Voitit __${a(amount)}__ pekkaa mestariveikkauksessa. Hyvin veikattu!`
      );
    }
  }
}

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
