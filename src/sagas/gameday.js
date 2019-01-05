import { Map } from "immutable";
import competitionData from "../data/competitions";
import gameService from "../services/game";
import competitionTypes from "../services/competition-type";

import { call, put, select, take } from "redux-saga/effects";

function* playGame(
  group,
  pairing,
  gameParams,
  overtime,
  competitionId,
  phaseId
) {
  const teams = yield select(state => state.game.get("teams"));

  const home = teams.get(group.getIn(["teams", pairing.get("home")]));
  const away = teams.get(group.getIn(["teams", pairing.get("away")]));

  const homeManager = yield select(state =>
    state.manager.getIn(["managers", home.get("manager")])
  );

  const awayManager = yield select(state =>
    state.manager.getIn(["managers", away.get("manager")])
  );

  const game = Map({
    ...gameParams,
    overtime,
    home,
    away,
    homeManager,
    awayManager,
    phaseId,
    competitionId
  });

  const result = yield call(gameService.simulate, game);

  return result;
}

export function* gameday(payload) {
  const competition = yield select(state =>
    state.game.getIn(["competitions", payload])
  );

  const phase = competition.getIn(["phases", competition.get("phase")]);

  const gameParams = competitionData.getIn([
    competition.get("id"),
    "parameters",
    "gameday"
  ]);

  const overtime = competitionTypes.getIn([phase.get("type"), "overtime"]);
  const playMatch = competitionTypes.getIn([phase.get("type"), "playMatch"]);

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
        if (playMatch(group, round, x)) {
          const pairing = pairings.get(x);

          const result = yield call(
            playGame,
            group,
            pairing,
            gameParams,
            overtime,
            competition.get("id"),
            phase.get("id")
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
