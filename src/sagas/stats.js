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

import { STATS_UPDATE_FROM_FACTS, STATS_SET_SEASON_STAT } from "../ducks/stats";

export function* stats() {
  yield all([
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
    payload: { competition, phase, meta, result }
  } = action;

  const streaksToUpdate = List.of("home", "away")
    .map(which => {
      const team = meta.getIn([which, "team"]);
      const manager = meta.getIn([which, "manager"]);
      const facts = resultFacts(result, which);

      return {
        team: team.toString(),
        competition,
        phase: phase.toString(),
        manager,
        facts
      };
    })
    .map(payload =>
      put({
        type: STATS_UPDATE_FROM_FACTS,
        payload
      })
    );

  yield all(streaksToUpdate.toJS());
}

export function* setSeasonStat(path, value) {
  yield put({
    type: STATS_SET_SEASON_STAT,
    payload: {
      path,
      value
    }
  });
}
