import { select, put, call } from "redux-saga/effects";
import calendar from "../../data/calendar";
import { List } from "immutable";
import { seedCompetition } from "../game";

export default function* seedPhase() {
  console.log("SEED PHASE");

  yield put({
    type: "GAME_SET_PHASE",
    payload: "seed"
  });

  const round = yield select(state => state.game.getIn(["turn", "round"]));
  const seeds = calendar.getIn([round, "seed"], List());

  console.log("SEEDS", seeds.toJS());

  if (seeds.count() === 0) {
    return;
  }

  for (const [, seed] of seeds.entries()) {
    const competitionId = seed.get("competition");
    const phaseId = seed.get("phase");
    yield call(seedCompetition, competitionId, phaseId);
  }
}
