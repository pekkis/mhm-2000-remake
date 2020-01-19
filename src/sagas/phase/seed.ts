import { select, call } from "redux-saga/effects";
import { seedCompetition, setPhase } from "../game";
import { MHMTurnDefinition } from "../../types/base";
import { currentCalendarEntry } from "../../data/selectors";

export default function* seedPhase() {
  yield setPhase("seed");

  const calendarEntry: MHMTurnDefinition = yield select(currentCalendarEntry);
  if (!calendarEntry) {
    throw new Error("Invalid calendar round");
  }

  if (!calendarEntry.seed) {
    return;
  }

  for (const seed of calendarEntry.seed) {
    yield call(seedCompetition, seed.competition, seed.phase);
  }
}
