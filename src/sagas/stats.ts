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
import { List, Map } from "immutable";

import { STATS_UPDATE_FROM_FACTS, STATS_SET_SEASON_STAT } from "../ducks/stats";
import {
  managersMainCompetition,
  competitionPhase,
  competitionGroup
} from "../services/selectors";
import {
  CompetitionSeedAction,
  COMPETITION_SEED,
  CompetitionUpdateStatsAction,
  COMPETITION_UPDATE_STATS
} from "../ducks/competition";
import {
  CompetitionNames,
  CompetitionPhase,
  PlayoffsCompetitionGroup,
  RoundRobinCompetitionGroup,
  CompetitionGroup
} from "../types/base";

export function* calculatePhaseStats(
  competition: CompetitionNames,
  phase: number
) {
  console.log("PHASE PARAMETRO", competition, phase);

  const p: CompetitionPhase = yield select(
    competitionPhase(competition, phase)
  );

  console.log("PHASE", p);

  yield all(
    (p.groups as CompetitionGroup[]).map((_, groupId) =>
      call(groupStats, competition, phase, groupId)
    )
  );
}

function* groupStats(
  competition: CompetitionNames,
  phase: number,
  group: number
) {
  const g: CompetitionGroup = yield select(
    competitionGroup(competition, phase, group)
  );

  const statsFunc = competitionTypes[g.type].stats;
  const stats = yield call(statsFunc, g);

  yield putResolve<CompetitionUpdateStatsAction>({
    type: COMPETITION_UPDATE_STATS,
    payload: {
      competition: competition,
      phase: phase,
      group: group,
      stats
    }
  });
}

export function* calculateGroupStats(
  competition: CompetitionNames,
  phase: number,
  group: number
) {
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

export function* createSeasonStories() {
  const managers = yield select(state => state.manager.get("managers"));

  const stats = yield select(state => state.stats.get("currentSeason"));

  for (const [managerId, manager] of managers) {
    const teamId = manager.get("team");

    const mainCompetition = yield select(managersMainCompetition(managerId));

    const competition = yield select(state =>
      state.game.getIn(["competitions", mainCompetition])
    );

    console.log(competition.toJS(), "competitiore");

    const group = yield select(state =>
      state.game.getIn([
        "competitions",
        mainCompetition,
        "phases",
        0,
        "groups",
        0
      ])
    );

    const [ranking, stat] = group
      .get("stats")
      .findEntry(s => s.get("id") === teamId);

    const story = Map({
      mainCompetition,
      mainCompetitionStat: stat,
      ranking,
      promoted: teamId === stats.get("promoted"),
      relegated: teamId === stats.get("relegated"),
      medal: stats.get("medalists").findIndex(m => m === teamId),
      ehlChampion: stats.get("ehlChampionship") === teamId,
      lastPhase: competition
        .get("phases")
        .findLastKey(phase => phase.get("teams").includes(teamId))
    });

    console.log("story", story.toJS());
    yield call(setSeasonStat, ["stories", managerId], story);
  }
}

export function* stats() {
  yield all([
    // TODO: TAKE THIS OUT OF HERE

    takeEvery<CompetitionSeedAction>(COMPETITION_SEED, function*(a) {
      yield calculatePhaseStats(a.payload.competition, a.payload.phase);
    }),
    takeEvery("GAME_GAME_RESULT", gameResult)
  ]);
}
