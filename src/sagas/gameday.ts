import { Map } from "immutable";
import competitionData from "../data/competitions";
import gameService from "../services/game";
import competitionTypes from "../services/competition-type";

import { call, put, putResolve, select, take, all } from "redux-saga/effects";
import { groupEnd } from "./game";
import { calculateGroupStats } from "./stats";
import { afterGameday } from "./manager";
import { bettingResults } from "./betting";
import {
  CompetitionNames,
  Competition,
  CompetitionGroup,
  MapOf,
  Competitions,
  ForEveryCompetition,
  MatchResultsSet
} from "../types/base";
import { MHMState } from "../ducks";
import { allTeamsMap } from "../services/selectors";
import { Team } from "../types/team";
import { MatchInput } from "../types/match";
import { playMatch } from "../services/match";
import { evolve } from "ramda";
import { GameMatchResultsAction, GAME_MATCH_RESULTS } from "../ducks/game";

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

  const phase = competition.phases[phaseId];
  const group = phase.groups[groupId];

  const overtimeFunc = competitionTypes[group.type].overtime;
  const playMatchFunc = competitionTypes[group.type].playMatch;

  const results: any[] = [];

  for (const [pairingId, pairing] of group.schedule[roundId].entries()) {
    console.log("P", pairingId, pairing);

    const matchInput: MatchInput = {
      competition: {
        id: competition.id,
        group: groupId,
        phase: phaseId
      },
      teams: {
        home: teams[group.teams[pairing.home]],
        away: teams[group.teams[pairing.home]]
      }
    };

    const matchOutput = playMatch(matchInput);

    const result = {
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

  return;

  return;

  // Play one round if not a tournament, otherwise loop all rounds.
  // TODO: Will not work for multiple sizes of tournaments (groups) as this.
  const rounds =
    phase.get("type") === "tournament"
      ? phase
          .getIn(["groups", 0])
          .get("schedule")
          .count()
      : 1;

  for (
    let roundNumber = 1;
    roundNumber <= rounds;
    roundNumber = roundNumber + 1
  ) {
    for (const [groupIndex, group] of phase.get("groups").entries()) {
      console.log(competitionData.toJS(), "cd");

      const gameParams = competitionData.getIn([
        competition.get("id"),
        "parameters",
        "gameday"
      ])(competition.get("phase"), groupIndex);

      console.log(gameParams, "gameParams");

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

          yield put({
            type: "GAME_GAME_BEGIN",
            payload: {
              competition: competition.get("id"),
              phase: competition.get("phase"),
              group: groupIndex,
              round,
              pairing: x
            }
          });

          const [result, meta] = yield call(
            playGame,
            group,
            pairing,
            gameParams,
            overtime,
            competition.get("id"),
            phase.get("id")
          );

          yield put({
            type: "GAME_GAME_RESULT",
            payload: {
              competition: competition.get("id"),
              phase: competition.get("phase"),
              group: groupIndex,
              round,
              result: result,
              pairing: x,
              meta
            }
          });
        }
      }
      yield completeGameday(
        competition.get("id"),
        competition.get("phase"),
        groupIndex,
        round
      );
    }

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

  for (const [groupIndex] of phase.get("groups").entries()) {
    console.log({
      competition,
      payload,
      groupIndex,
      phase: competition.get("phase")
    });

    const theGroup = yield select(state =>
      state.game.getIn([
        "competitions",
        payload,
        "phases",
        competition.get("phase"),
        "groups",
        groupIndex
      ])
    );

    const isItOver = theGroup.get("schedule").count() === theGroup.get("round");
    if (isItOver) {
      yield call(groupEnd, payload, competition.get("phase"), groupIndex);
    }
  }
}

// End of refattori

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

  return [
    result,
    Map({
      home: Map({
        manager: homeManager && homeManager.get("id"),
        team: home.get("id")
      }),
      away: Map({
        manager: awayManager && awayManager.get("id"),
        team: away.get("id")
      })
    })
  ];
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
