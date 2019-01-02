import { Map } from "immutable";
import competitionData from "../data/competitions";
import gameService from "../services/game";
import competitionTypes from "../services/competition-type";

import { call, put, select, take } from "redux-saga/effects";

function* playGame(group, pairing, gameParams, overtime) {
  const teams = yield select(state => state.game.get("teams"));

  const home = teams.get(group.getIn(["teams", pairing.get("home")]));
  const away = teams.get(group.getIn(["teams", pairing.get("away")]));

  const game = Map({
    ...gameParams,
    overtime,
    home,
    away
  });

  const result = yield call(gameService.simulate, game);

  return result;
}

export function* gameday(payload) {
  const competition = yield select(state =>
    state.game.getIn(["competitions", payload])
  );

  const phase = competition.getIn(["phases", competition.get("phase")]);

  const competitionType = competitionTypes[phase.get("type")];
  const gameParams = competitionData.getIn([
    competition.get("id"),
    "parameters",
    "gameday"
  ]);

  const overtime = competitionType.overtime;

  for (const [groupIndex, group] of phase.get("groups").entries()) {
    const rounds =
      phase.get("type") === "tournament" ? group.get("schedule").count() : 1;

    for (
      let roundNumber = 1;
      roundNumber <= rounds;
      roundNumber = roundNumber + 1
    ) {
      const round = yield select(state =>
        state.game.getIn([
          "competitions",
          payload,
          "phases",
          competition.get("phase"),
          "groups",
          groupIndex,
          "round"
        ])
      );
      const pairings = group.getIn(["schedule", round]);
      for (let x = 0; x < pairings.count(); x = x + 1) {
        const playMatch = competitionType.playMatch(group, round, x);

        if (playMatch) {
          const pairing = pairings.get(x);

          const result = yield call(
            playGame,
            group,
            pairing,
            gameParams,
            overtime
          );

          yield put({
            type: "GAME_RESULT",
            payload: {
              competition: competition.get("id"),
              phase: competition.get("phase"),
              group: groupIndex,
              round,
              result: result,
              pairing: x
            }
          });
        }
      }
      yield put({
        type: "GAME_GAMEDAY_COMPLETE",
        payload: {
          competition: competition.get("id"),
          phase: competition.get("phase"),
          group: groupIndex,
          round
        }
      });

      if (phase.get("type") === "tournament") {
        if (roundNumber < rounds) {
          yield put({
            type: "GAME_SET_PHASE",
            payload: "results"
          });

          yield take("GAME_ADVANCE_REQUEST");

          yield put({
            type: "GAME_SET_PHASE",
            payload: "gameday"
          });

          yield take("GAME_ADVANCE_REQUEST");
        }
      }
    }
  } // console.log("reslut", result.toJS());
  // }
}
