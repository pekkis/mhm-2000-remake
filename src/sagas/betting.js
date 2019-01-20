import { put, all, call, select } from "redux-saga/effects";
import { BETTING_BET_CHAMPION, BETTING_BET } from "../ducks/betting";
import { decrementBalance, incrementBalance } from "./manager";
import { addAnnouncement } from "./news";
import { amount as a } from "../services/format";
import { addNotification } from "./notification";
import { resultFacts } from "../services/game";
import { List } from "immutable";

const victories = List.of(false, false, false, 1, 2, 5, 10);

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

export function* bettingResults(round) {
  const pairings = yield select(state =>
    state.game.getIn([
      "competitions",
      "phl",
      "phases",
      0,
      "groups",
      0,
      "schedule",
      round
    ])
  );

  const facts = pairings.map(p => resultFacts(p.get("result"), "home"));
  const correctCoupon = facts.map(f => {
    if (f.isWin) {
      return "1";
    } else if (f.isDraw) {
      return "x";
    }
    return "2";
  });

  console.log("CORRETTI", correctCoupon);

  const bets = yield select(state => state.betting.get("bets"));

  for (const bet of bets) {
    const correct = bet
      .get("coupon")
      .filter((c, i) => c === correctCoupon.get(i))
      .count();

    const victory = victories.get(correct);
    if (victory) {
      const victoryAmount = Math.round(victory * bet.get("amount"));
      yield all([
        call(incrementBalance, bet.get("manager"), victoryAmount),
        call(
          addAnnouncement,
          bet.get("manager"),
          `Voitit kavioveikkauksessa __${a(
            victoryAmount
          )}__ pekkaa. Rivissäsi oli __${correct}__ oikein. Panoksesi oli __${a(
            bet.get("amount")
          )}__ pekkaa.`
        )
      ]);
    } else {
      yield call(
        addAnnouncement,
        bet.get("manager"),
        `Et voittanut kavioveikkauksessa. Rivissäsi oli __${correct}__ oikein. Panoksesi oli __${a(
          bet.get("amount")
        )}__ pekkaa.`
      );
    }
  }
}

export function* bet(manager, coupon, amount) {
  console.log("BETTING", manager, coupon.toJS(), amount);
  yield all([
    call(
      addNotification,
      manager,
      "Kiikutat veikkauskuponkisi lähimmälle S-kioskille. Olkoon onni myötä!"
    ),
    put({
      type: BETTING_BET,
      payload: {
        manager,
        coupon,
        amount
      }
    }),
    call(decrementBalance, manager, amount)
  ]);
}

export function* betChampion(manager, team, amount, odds) {
  yield all([
    call(
      addNotification,
      manager,
      "Kiikutat mestarusveikkauskuponkisi S-kioskille. Olkoon onni myötä!"
    ),
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
