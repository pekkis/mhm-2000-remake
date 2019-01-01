import { select, put } from "redux-saga/effects";
import competitionData from "../../data/competitions";
import calendar from "../../data/calendar";
import { List } from "immutable";

export default function* seedPhase() {
  yield put({
    type: "GAME_SET_PHASE",
    payload: "seed"
  });

  const round = yield select(state => state.game.getIn(["turn", "round"]));
  const seeds = calendar.getIn([round, "seed"], List());

  if (seeds.count() === 0) {
    console.log("NO SEEDING WILL HAPPEN");
    return;
  }

  console.log("WILL PLANT MY SEEDS NOW", seeds.entries());

  const competitions = yield select(state => state.game.get("competitions"));
  for (const [i, seed] of seeds.entries()) {
    console.log("seed", seed);

    const competitionId = seed.get("competition");
    const phaseId = seed.get("phase");
    const competitionObj = competitionData.get(competitionId);
    yield put({
      type: "COMPETITION_SEED",
      payload: {
        competition: competitionId,
        phase: phaseId,
        seed: competitionObj.getIn(["seed", phaseId])(competitions)
      }
    });
  }
}
