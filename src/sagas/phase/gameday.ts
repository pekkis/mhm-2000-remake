import { select, call, take, put, putResolve, all } from "redux-saga/effects";
import { setPhase, GAME_ADVANCE_REQUEST } from "../game";
import {
  CalendarEntry,
  Competition,
  MapOf,
  MatchInput,
  MatchResultsSet,
  CompetitionNames,
  ForEveryCompetition,
  CompetitionGroup,
  ScheduleGame
} from "../../types/base";
import {
  currentCalendarEntry,
  allTeamsMap,
  allManagersMap
} from "../../services/selectors";
import competitionData from "../../services/competitions";
import competitionTypes from "../../services/competition-type";
import { groupEnd } from "../game";
import { calculateGroupStats } from "../stats";
import { MHMState } from "../../ducks";
import { Team } from "../../types/team";
import { playMatch } from "../../services/match";
import { GameMatchResultsAction, GAME_MATCH_RESULTS } from "../../ducks/game";
import {
  CompetitionAdvanceAction,
  COMPETITION_ADVANCE
} from "../../ducks/competition";
import { Manager } from "../../types/manager";

function* playRoundOfMatches(
  competitionId: string,
  phaseId: number,
  groupId: number,
  roundId: number
) {
  const competition: Competition = yield select(
    (state: MHMState) => state.competition.competitions[competitionId]
  );

  const teams: MapOf<Team> = yield select(allTeamsMap);

  const managers: MapOf<Manager> = yield select(allManagersMap);

  const phase = competition.phases[phaseId];
  const group = phase.groups[groupId];

  const playMatchFunc = competitionTypes[group.type].playMatch;

  const results: ScheduleGame[] = [];

  for (const [pairingId, pairing] of group.schedule[roundId].entries()) {
    console.log("P", pairingId, pairing);

    if (!playMatchFunc(group, roundId, pairingId)) {
      // This is a bit kludgy but my previous optimizations dictate this.
      results.push(pairing);
      continue;
    }

    const homeTeam = teams[group.teams[pairing.home]];
    const awayTeam = teams[group.teams[pairing.away]];

    const matchInput: MatchInput = {
      competition,
      group,
      phase,
      matchup: pairingId,
      teams: {
        home: homeTeam,
        away: awayTeam
      }
    };

    const matchOutput = yield call(playMatch, matchInput);

    const result: ScheduleGame = {
      ...pairing,
      ...matchOutput
    };

    console.log("reslut", result);
    results.push(result);
  }

  return {
    competition: competitionId,
    phase: phaseId,
    group: groupId,
    round: roundId,
    results
  } as MatchResultsSet;
}

export function* gameday(competitionIds: CompetitionNames[]) {
  const competitions: ForEveryCompetition<Competition> = yield select(
    (state: MHMState) => state.competition.competitions
  );

  const results: MatchResultsSet[][] = [];

  for (const competitionId of competitionIds) {
    const competition = competitions[competitionId];

    const currentPhase = competition.phases[competition.phase];

    for (const [
      groupId,
      group
    ] of (currentPhase.groups as CompetitionGroup[]).entries()) {
      const groupResults = yield call(
        playRoundOfMatches,
        competition.id,
        competition.phase,
        groupId,
        group.round
      );

      results.push(groupResults);
    }
  }

  const flattened = results.flat();
  yield putResolve<GameMatchResultsAction>({
    type: GAME_MATCH_RESULTS,
    payload: flattened
  });

  yield all(
    flattened.map(resultSet => {
      return call(
        completeGameday,
        resultSet.competition,
        resultSet.phase,
        resultSet.group,
        resultSet.round
      );
    })
  );

  console.log("FINAL FLATTENED RESULTS", flattened);
}

function* completeGameday(
  competition: CompetitionNames,
  phase: number,
  group: number,
  round: number
) {
  yield call(calculateGroupStats, competition, phase, group);

  return;

  // yield call(afterGameday, competition, phase, group, round);

  /*
  if (competition === "phl" && phase === 0 && group === 0) {
    yield call(bettingResults, round);
  }
  */

  yield putResolve({
    type: "GAME_GAMEDAY_COMPLETE",
    payload: {
      competition,
      phase,
      group,
      round
    }
  });
}

function* beforeGameday(competitionIds: CompetitionNames[]) {
  // before gameday
}

function* afterGameday(competitionIds: CompetitionNames[]) {
  yield putResolve<CompetitionAdvanceAction>({
    type: COMPETITION_ADVANCE,
    payload: { competitions: competitionIds }
  });
}

export default function* gamedayPhase() {
  yield call(setPhase, "gameday");
  yield take(GAME_ADVANCE_REQUEST);

  const calendarEntry: CalendarEntry = yield select(currentCalendarEntry);

  yield call(beforeGameday, calendarEntry.gamedays);
  yield call(gameday, calendarEntry.gamedays);

  yield call(setPhase, "results");
  yield take(GAME_ADVANCE_REQUEST);

  yield call(afterGameday, calendarEntry.gamedays);
}
