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

  const gameParams = competitionData.getIn([
    competition.get("id"),
    "parameters",
    "gameday"
  ]);

  const overtime = competitionType.overtime;

  for (const [groupIndex, group] of phase.get("groups").entries()) {
    const round = group.get("round");
    const pairings = group.getIn(["schedule", round]);
    for (let x = 0; x < pairings.count(); x = x + 1) {
      const playMatch = competitionType.playMatch(group, round, x);

      if (playMatch) {
        const pairing = pairings.get(x);
        const home = teams.get(phase.getIn(["teams", pairing.get("home")]));
        const away = teams.get(phase.getIn(["teams", pairing.get("away")]));

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
            group: groupIndex,
            round,
            result: result,
            pairing: x
          }
        });
      }

      // console.log("GAMEDAY");

      // console.log("gameday for", competition.toJS(), phase.toJS());

      //  console.log(pairings, "pairings");

      // console.log(gameParams, "game params");

      // console.log("game pairing", pairing);
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
  } // console.log("reslut", result.toJS());
}
