import competitionData from "../data/competitions";
import { SEASON_START } from "../ducks/game";

import teamData from "../data/teams";

import {
  all,
  call,
  put,
  putResolve,
  select,
  takeEvery,
  fork
} from "redux-saga/effects";

import actionPhase from "./phase/action";
import eventCreationPhase from "./phase/event-creation";
import eventPhase from "./phase/event";
import newsPhase from "./phase/news";
import prankPhase from "./phase/prank";
import gamedayPhase from "./phase/gameday";
import invitationsCreatePhase from "./phase/invitations-create";
import invitationsProcessPhase from "./phase/invitations-process";
import seedPhase from "./phase/seed";
import endOfSeasonPhase from "./phase/end-of-season";
import startOfSeasonPhase from "./phase/start-of-season";
import galaPhase from "./phase/gala";

import calculationsPhase from "./phase/calculations";
import calendar from "../data/calendar";
import difficultyLevels from "../data/difficulty-levels";

import { setExtra, decrementBalance, incrementInsuranceExtra } from "./manager";
import { stats } from "./stats";
import {
  allTeams,
  managersTeam,
  managersDifficulty,
  managersMainCompetition,
  managerHasService,
  managersArena
} from "../data/selectors";
import events from "../data/events";

export const GAME_ADVANCE_REQUEST = "GAME_ADVANCE_REQUEST";

export function* beforeGame(action) {
  const {
    payload: { competition, phase, group, round, pairing }
  } = action;

  if (competition === "phl" && phase === 0 && group === 0 && round >= 5) {
    const g = yield select(state =>
      state.game.getIn([
        "competitions",
        competition,
        "phases",
        phase,
        "groups",
        group
      ])
    );

    const teams = yield select(state => state.game.get("teams"));

    const p = g.getIn(["schedule", round, pairing]);

    const t = p.map(p => g.getIn(["teams", p])).map(tid => teams.get(tid));

    const humansInGame = t
      .filter(t => t.get("manager") !== undefined)
      .map(t => t.get("manager"))
      .toList();

    if (humansInGame.count() === 0) {
      return;
    }

    const interestingTeams = g
      .get("stats")
      .take(5)
      .map(s => s.get("id"));

    const gameIsInteresting = t.every(t =>
      interestingTeams.includes(t.get("id"))
    );
    if (!gameIsInteresting) {
      return;
    }

    const event = events.get("topGame");

    for (const manager of humansInGame) {
      yield call(event.create, {
        manager
      });
    }
  }

  return;
}

export function* gameLoop() {
  yield takeEvery("GAME_GAME_BEGIN", beforeGame);
  yield fork(stats);

  do {
    const turn = yield select(state => state.game.get("turn"));

    const roundData = calendar.get(turn.get("round"));

    const phases = roundData.get("phases");

    // console.log(roundData.toJS(), "round data");

    // don't do any calculations for "hidden" turns
    if (phases.includes("action")) {
      yield call(actionPhase);
    }

    // don't do any calculations for "hidden" turns
    if (phases.includes("prank")) {
      yield call(prankPhase);
    }

    if (phases.includes("gameday")) {
      yield call(gamedayPhase);
    }

    // TODO: maybe create calculatores phase
    if (phases.includes("calculations")) {
      yield call(calculationsPhase);
    }

    if (phases.includes("eventCreation")) {
      yield call(eventCreationPhase);
    }

    if (phases.includes("event")) {
      yield call(eventPhase);
    }

    if (phases.includes("news")) {
      yield call(newsPhase);
    }

    if (phases.includes("invitations-create")) {
      yield call(invitationsCreatePhase);
    }

    if (phases.includes("invitations-process")) {
      yield call(invitationsProcessPhase);
    }

    if (phases.includes("startOfSeason")) {
      yield call(startOfSeasonPhase);
    }

    if (phases.includes("seed")) {
      yield call(seedPhase);
    }

    if (phases.includes("gala")) {
      yield call(galaPhase);
    }

    if (phases.includes("endOfSeason")) {
      yield call(endOfSeasonPhase);
    }

    yield putResolve({ type: "GAME_CLEAR_EXPIRED" });

    yield call(nextTurn);
  } while (true);
}

function* competitionStart(competitionId) {
  const competitionStarter = competitionData.getIn([competitionId, "start"]);
  if (competitionStarter) {
    yield call(competitionStarter);
  }
  yield put({
    type: "COMPETITION_START",
    payload: {
      competition: competitionId
    }
  });
}

export function* groupEnd(competition, phase, group) {
  const groupEnder = competitionData.getIn([competition, "groupEnd"]);

  if (groupEnder) {
    yield call(groupEnder, phase, group);
  }

  yield put({
    type: "GAME_GROUP_END",
    payload: {
      competition,
      phase,
      group
    }
  });
}

export function* seasonStart() {
  const turn = yield select(state => state.game.get("turn"));
  const season = turn.get("season");

  const teams = yield select(allTeams);

  // Re-strength European teams.
  const reStrengths = teams.slice(24).map(t => {
    return {
      id: t.get("id"),
      strength: teamData.get(t.get("id")).get("strength")()
    };
  });
  yield put({
    type: "TEAM_SET_STRENGTHS",
    payload: reStrengths.toJS()
  });

  // Start all competitions.
  for (const [key, competitionObj] of competitionData) {
    yield competitionStart(key);
    // const competitions = yield select(state => state.game.get("competitions"));

    /*
    const seed = competitionObj.getIn(["seed", 0])(competitions);
    yield putResolve({
      type: "COMPETITION_SEED",
      payload: {
        competition: key,
        phase: 0,
        seed
      }
    });
    */
  }

  const managers = yield select(state => state.manager.get("managers"));
  for (const [, manager] of managers) {
    console.log("MANAGER", manager);

    // Skip the first season for salary payments.
    if (season > 0) {
      const managerId = manager.get("id");
      const team = yield select(managersTeam(managerId));
      const difficulty = yield select(managersDifficulty(managerId));
      const mainCompetition = yield select(managersMainCompetition(managerId));
      const salaryPerStrength = difficultyLevels.getIn([difficulty, "salary"])(
        mainCompetition
      );
      const totalSalary = salaryPerStrength * team.get("strength");
      yield call(decrementBalance, managerId, totalSalary);

      const hasInsurance = yield select(
        managerHasService(managerId, "insurance")
      );

      if (hasInsurance) {
        const arena = yield select(managersArena(managerId));
        yield call(
          incrementInsuranceExtra,
          managerId,
          -50 * arena.get("level")
        );
      }
    }

    // Reset extra each season.
    yield setExtra(
      manager.get("id"),
      difficultyLevels.getIn([manager.get("difficulty"), "extra"])
    );
  }

  yield put({
    type: SEASON_START
  });
}

export function* promote(competition, team) {
  const promoteTo = competitionData.getIn([competition, "promoteTo"]);
  yield all([
    call(removeTeamFromCompetition, competition, team),
    call(addTeamToCompetition, promoteTo, team)
  ]);
}

export function* relegate(competition, team) {
  const relegateTo = competitionData.getIn([competition, "relegateTo"]);

  yield all([
    call(removeTeamFromCompetition, competition, team),
    call(addTeamToCompetition, relegateTo, team)
  ]);
}

export function* setFlag(flag, value) {
  yield put({
    type: "GAME_SET_FLAG",
    payload: {
      flag,
      value
    }
  });
}

export function* incrementServiceBasePrice(service, amount) {
  const currentAmount = yield select(state =>
    state.game.getIn(["serviceBasePrices", service])
  );

  yield put({
    type: "GAME_SET_SERVICE_BASE_PRICE",
    payload: {
      service,
      amount: currentAmount + amount
    }
  });
}

function* nextTurn() {
  yield put({ type: "NEWS_ANNOUNCEMENTS_CLEAR" });
  yield put({ type: "EVENT_CLEAR_EVENTS" });
  yield put({ type: "GAME_NEXT_TURN" });
}

export function* setPhase(phase) {
  yield put({
    type: "GAME_SET_PHASE",
    payload: phase
  });
}

export function* seedCompetition(competitionId, phase) {
  const competitions = yield select(state => state.game.get("competitions"));
  const competitionObj = competitionData.getIn([competitionId]);

  const seeder = competitionObj.getIn(["seed", phase]);

  const seed = yield call(seeder, competitions);

  yield putResolve({
    type: "COMPETITION_SEED",
    payload: {
      competition: competitionId,
      phase,
      seed
    }
  });
}

export function* removeTeamFromCompetition(competition, team) {
  yield putResolve({
    type: "COMPETITION_REMOVE_TEAM",
    payload: {
      competition,
      team
    }
  });
}

export function* addTeamToCompetition(competition, team) {
  yield putResolve({
    type: "COMPETITION_ADD_TEAM",
    payload: {
      competition,
      team
    }
  });
}

export function* setCompetitionTeams(competition, teams) {
  yield putResolve({
    type: "COMPETITION_SET_TEAMS",
    payload: {
      competition,
      teams
    }
  });
}
