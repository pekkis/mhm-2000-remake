import { select, put, call } from "redux-saga/effects";
import { List } from "immutable";
import { seedCompetition, setPhase } from "../game";
import { MHMCalendar } from "../../types/base";
import { nth } from "ramda";

export default function* seedPhase() {
  yield setPhase("seed");

  const calendar: MHMCalendar = yield select(state =>
    state.game.get("calendar")
  );

  const round = yield select(state => state.game.getIn(["turn", "round"]));
  const calRound = nth(round, calendar);

  if (!calRound) {
    throw new Error("Invalid calendar round");
  }

  if (!calRound.seed) {
    return;
  }

  for (const seed of calRound.seed) {
    yield call(seedCompetition, seed.competition, seed.phase);
  }
}
