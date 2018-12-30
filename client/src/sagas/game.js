import competitionData from "../data/competitions";

import { call, put, select, takeEvery } from "redux-saga/effects";

import actionPhase from "./phase/action";
import eventPhase from "./phase/event";
import gamedayPhase from "./phase/gameday";
import seedPhase from "./phase/seed";
import endOfSeasonPhase from "./phase/end-of-season";

import { afterGameday } from "./player";

export function* gameLoop() {
  yield takeEvery("GAME_GAMEDAY_COMPLETE", afterGameday);

  do {
    console.log("ACTION PHASE");

    yield call(actionPhase);

    yield call(gamedayPhase);

    yield call(eventPhase);

    yield call(seedPhase);

    yield call(endOfSeasonPhase);

    yield call(nextTurn);
  } while (true);
}

export function* seasonStart() {
  const competitions = yield select(state => state.game.get("competitions"));

  for (const [key, competitionObj] of competitionData) {
    yield put({
      type: "COMPETITION_START",
      payload: {
        competition: key
      }
    });

    yield put({
      type: "COMPETITION_SEED",
      payload: {
        competition: key,
        phase: 0,
        seed: competitionObj.getIn(["seed", 0])(competitions)
      }
    });
  }

  yield put({
    type: "NEWS_CLEAR"
  });

  yield put({
    type: "SEASON_START"
  });
}

export function* promote(competition, team) {
  const promoteTo = competitionData.getIn([competition, "promoteTo"]);

  yield put({
    type: "COMPETITION_REMOVE_TEAM",
    payload: {
      competition,
      team
    }
  });

  yield put({
    type: "COMPETITION_ADD_TEAM",
    payload: {
      competition: promoteTo,
      team
    }
  });
}

export function* relegate(competition, team) {
  const relegateTo = competitionData.getIn([competition, "relegateTo"]);

  yield put({
    type: "COMPETITION_REMOVE_TEAM",
    payload: {
      competition,
      team
    }
  });

  yield put({
    type: "COMPETITION_ADD_TEAM",
    payload: {
      competition: relegateTo,
      team
    }
  });
}

function* nextTurn() {
  yield put({ type: "GAME_NEXT_TURN" });
}
