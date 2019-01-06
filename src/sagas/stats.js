import { takeEvery, all, select, putResolve, call } from "redux-saga/effects";

import competitionTypes from "../services/competition-type";

export function* stats() {
  yield all([
    takeEvery("GAME_GAMEDAY_COMPLETE", calculateGroupStats),
    takeEvery("TEAM_INCUR_PENALTY", calculateGroupStats),
    takeEvery("COMPETITION_SEED", calculatePhaseStats)
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

export function* calculateGroupStats(action) {
  const { payload } = action;
  yield call(groupStats, payload.competition, payload.phase, payload.group);
}
