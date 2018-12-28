import { Map } from "immutable";
import competitionData from "../data/competitions";
import gameService from "../services/game";
import competitionTypes from "../services/competition-type";

import { call, put, select } from "redux-saga/effects";

export function* gameday(payload) {
  const teams = yield select(state => state.game.get("teams"));
  const competition = yield select(state =>
    state.game.getIn(["competitions", payload])
  );

  const phase = competition.getIn(["phases", competition.get("phase")]);

  const competitionType = competitionTypes[phase.get("type")];

  const round = phase.get("round");

  // console.log("gameday for", competition.toJS(), phase.toJS());

  const pairings = phase.getIn(["schedule", round]);

  //  console.log(pairings, "pairings");

  const gameParams = competitionData.getIn([
    competition.get("id"),
    "parameters",
    "gameday"
  ]);

  const overtime = competitionType.overtime;

  // console.log(gameParams, "game params");

  for (let x = 0; x < pairings.count(); x = x + 1) {
    const playMatch = competitionType.playMatch(phase, round, x);
    console.log("play match", playMatch);

    if (playMatch) {
      const pairing = pairings.get(x);
      const home = teams.get(phase.getIn(["teams", pairing.get("home")]));
      const away = teams.get(phase.getIn(["teams", pairing.get("away")]));

      // console.log("game pairing", pairing);

      const game = Map({
        ...gameParams,
        overtime,
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
    }

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
}
