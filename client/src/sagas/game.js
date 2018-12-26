import { List, Map } from "immutable";
import competitionData from "../data/competitions";
import gameService from "../services/game";

import {
  all,
  call,
  getContext,
  put,
  takeLatest,
  takeEvery,
  select,
  take
} from "redux-saga/effects";
import { delay } from "redux-saga";

import gamedayListener from "../listeners/gameday";
import nextTurnListener from "../listeners/next-turn";
import eventListener from "../listeners/event";
import eventProcessListener from "../listeners/event-process";
import seedListener from "../listeners/seed";

const listeners = List.of(
  gamedayListener,
  nextTurnListener,
  eventListener,
  eventProcessListener,
  seedListener
).sortBy(l => l.phase());

function* gameday(action) {
  const { payload } = action;

  const teams = yield select(state => state.game.get("teams"));

  const competition = yield select(state =>
    state.game.getIn(["competitions", payload])
  );

  const phase = competition.getIn(["phases", competition.get("phase")]);

  const round = phase.get("round");

  console.log("gameday for", competition);

  const pairings = phase.getIn(["schedule", round]);

  console.log(pairings, "pairings");

  const gameParams = competitionData.getIn([
    competition.get("id"),
    "parameters",
    "gameday"
  ]);

  for (let x = 0; x < pairings.count(); x = x + 1) {
    const pairing = pairings.get(x);
    const home = teams.get(phase.getIn(["teams", pairing.get("home")]));
    const away = teams.get(phase.getIn(["teams", pairing.get("away")]));

    // console.log("game pairing", pairing);

    const game = Map({
      ...gameParams,
      home,
      away
    });

    const result = yield call(gameService.simulate, game);

    yield put({
      type: "GAME_RESULT",
      payload: {
        competition: competition.get("id"),
        phase: competition.get("phase"),
        round,
        result: result,
        pairing: x
      }
    });

    // console.log("reslut", result.toJS());
  }

  yield put({
    type: "GAME_GAMEDAY_COMPLETE",
    payload: {
      competition: competition.get("id"),
      phase: competition.get("phase"),
      round
    }
  });

  /*

  const home = state.getIn(["teams", teams.get(pairing.get("home"))]);

  const away = state.getIn(["teams", teams.get(pairing.get("away"))]);


  // console.log(gameParams);

  const game = Map({
    ...gameParams,
    home,
    away
  });

  // console.log(game, "geim");

  const result = gameService.simulate(game);

  // console.log(result, "reslut");

  return pairing.set("result", result);

  yield put({
    type: "GAME_GAMEDAY",
    payload
  });
  */
}

function* advanceLoop() {
  do {
    const action = yield take("GAME_ADVANCE_REQUEST");
    yield call(advance, action);
  } while (true);
}

function* advance(action) {
  let stop;
  do {
    const turn = yield select(state => state.game.get("turn"));

    const phase = turn.get("phase");

    const nextPhase = Math.min(
      ...listeners
        .filter(l => l.phase() > phase)
        .map(l => l.phase())
        .toArray()
    );

    const listener = listeners.find(l => l.phase() === phase);

    if (!listener) {
      yield put({
        type: "GAME_SET_PHASE",
        payload: nextPhase
      });
      continue;
    }

    const blocker =
      listener.block ||
      function*() {
        return false;
      };

    const blocking = yield call(blocker);
    if (blocking) {
      return;
    }

    yield listener.generator();

    stop = listener.stop();

    if (!stop) {
      yield put({
        type: "GAME_SET_PHASE",
        payload: nextPhase
      });
    }
  } while (!stop);

  /*
  if (activePlayer === players.count() - 1) {
    yield put({
      type: "GAME_ADVANCE"
    });
  } else {
    yield put({
      type: "PLAYER_NEXT"
    });
  }
  */
}

function* seasonStart() {
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
    type: "SEASON_START"
  });
}

function* promote(action) {
  const {
    payload: { competition, team }
  } = action;

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

function* relegate(action) {
  const {
    payload: { competition, team }
  } = action;

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

function* watchGameday() {
  yield takeEvery("GAME_GAMEDAY_REQUEST", gameday);
}

function* watchSeasonStart() {
  yield takeLatest("SEASON_START_REQUEST", seasonStart);
}

function* watchNextTurn() {
  yield takeLatest("GAME_NEXT_TURN_REQUEST", nextTurn);
}

function* watchPromotionsAndRelegations() {
  yield takeEvery("COMPETITION_RELEGATE", relegate);
  yield takeEvery("COMPETITION_PROMOTE", promote);
}

export default function* gameSagas() {
  yield all([
    advanceLoop(),
    watchSeasonStart(),
    watchGameday(),
    watchNextTurn(),
    watchPromotionsAndRelegations()
  ]);
}
