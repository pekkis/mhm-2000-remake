import {
  takeEvery,
  all,
  select,
  putResolve,
  call,
  put
} from "redux-saga/effects";
import competitionTypes from "../services/competition-type";
import { resultFacts } from "../services/game";
import { List } from "immutable";

import { STATS_UPDATE_TEAM_STREAK_FROM_FACTS } from "../ducks/stats";

export function* stats() {
  yield all([
    takeEvery("TEAM_INCUR_PENALTY", calculateGroupStats),
    takeEvery("COMPETITION_SEED", calculatePhaseStats),
    takeEvery("GAME_GAME_RESULT", gameResult)
  ]);
}

export function* calculatePhaseStats(action) {
  const { payload } = action;
  const phase = yield select(state =>
    state.game.getIn([
      "competitions",
      payload.competition,
      "phases",
      payload.phase
    ])
  );

  yield all(
    phase
      .get("groups")
      .map((group, groupId) =>
        call(groupStats, payload.competition, payload.phase, groupId)
      )
      .toJS()
  );
}

function* groupStats(competitionId, phaseId, groupId) {
  const group = yield select(state =>
    state.game.getIn([
      "competitions",
      competitionId,
      "phases",
      phaseId,
      "groups",
      groupId
    ])
  );

  const stats = yield call(
    competitionTypes.getIn([group.get("type"), "stats"]),
    group
  );

  yield putResolve({
    type: "COMPETITION_UPDATE_STATS",
    payload: {
      competition: competitionId,
      phase: phaseId,
      group: groupId,
      stats
    }
  });
}

export function* calculateGroupStats(competition, phase, group) {
  yield call(groupStats, competition, phase, group);
}

function* gameResult(action) {
  const {
    payload: { competition, meta, result }
  } = action;

  const streaksToUpdate = List.of("home", "away")
    .map(which => {
      const team = meta.getIn([which, "team"]);
      const facts = resultFacts(result, which);

      return {
        team,
        competition,
        facts
      };
    })
    .map(payload =>
      put({
        type: STATS_UPDATE_TEAM_STREAK_FROM_FACTS,
        payload
      })
    );

  yield all(streaksToUpdate.toJS());
}
