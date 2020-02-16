import { select, call } from "redux-saga/effects";
import { seedCompetition, setPhase } from "../game";
import { CalendarEntry } from "../../types/base";
import { currentCalendarEntry } from "../../services/selectors";

export default function* seedPhase() {
  yield setPhase("seed");

  const calendarEntry: CalendarEntry = yield select(currentCalendarEntry);
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
