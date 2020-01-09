import { put, all, call, select } from "redux-saga/effects";
import {
  BETTING_BET_CHAMPION,
  BETTING_BET,
  Bet,
  BettingBetAction,
  BettingCouponRow,
  BettingBetChampionAction
} from "../ducks/betting";
import { decrementBalance, incrementBalance } from "./manager";
import { addAnnouncement } from "./news";
import { amount as a } from "../services/format";
import { addNotification } from "./notification";
import { resultFacts } from "../services/game";
import { List } from "immutable";
import { MHMState } from "../ducks";
import { ChampionshipBet } from "../ducks/betting";

const victories = List.of(false, false, false, 1, 2, 5, 10);

export function* processChampionBets() {
  const bets: ChampionshipBet[] = yield select(
    (state: MHMState) => state.betting.championshipBets
  );
  const stats = yield select(state => state.stats.get("currentSeason"));

  const champion = stats.getIn(["medalists", 0]);

  for (const bet of bets) {
    if (bet.team === champion) {
      const amount = Math.round(bet.amount * bet.odds);
      yield call(incrementBalance, bet.manager, amount);
      yield call(
        addAnnouncement,
        bet.manager,
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

  const bets: Bet[] = yield select((state: MHMState) => state.betting.bets);

  for (const bet of bets) {
    const correct = bet.coupon.filter((c, i) => c === correctCoupon.get(i))
      .length;

    const victory = victories.get(correct);
    if (victory) {
      const victoryAmount = Math.round(victory * bet.amount);
      yield all([
        call(incrementBalance, bet.manager, victoryAmount),
        call(
          addAnnouncement,
          bet.manager,
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
        bet.manager,
        `Et voittanut kavioveikkauksessa. Rivissäsi oli __${correct}__ oikein. Panoksesi oli __${a(
          bet.amount
        )}__ pekkaa.`
      );
    }
  }
}

export function* bet(
  manager: string,
  coupon: BettingCouponRow[],
  amount: number
) {
  yield all([
    call(
      addNotification,
      manager,
      "Kiikutat veikkauskuponkisi lähimmälle S-kioskille. Olkoon onni myötä!"
    ),
    put<BettingBetAction>({
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
    put<BettingBetChampionAction>({
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
