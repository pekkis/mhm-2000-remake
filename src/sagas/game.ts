import competitionData from "../services/competitions";
import {
  GAME_SEASON_START,
  GameSetPhaseAction,
  GAME_LOAD_STATE,
  GameLoadStateAction,
  GameLoadedAction,
  GAME_LOADED,
  GameAdvanceAction,
  GameStartAction,
  GAME_START,
  GAME_SET_PHASE,
  GAME_LOAD_REQUEST,
  GAME_START_REQUEST,
  GAME_QUIT_TO_MAIN_MENU,
  GameSeasonStartAction,
  GameCleanupAction,
  GAME_CLEAR_EXPIRED,
  GameNextTurnAction,
  GAME_NEXT_TURN,
  GameSaveRequestAction
} from "../ducks/game";

import {
  all,
  call,
  put,
  putResolve,
  select,
  takeEvery,
  fork,
  take,
  cancel,
  race
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
import gameStateService from "../services/game-state";

import calculationsPhase from "./phase/calculations";
import difficultyLevels from "../services/difficulty-levels";

import {
  setExtra,
  decrementBalance,
  incrementInsuranceExtra,
  addManager
} from "./manager";
import { stats } from "./stats";
import {
  allTeams,
  managersTeam,
  managersDifficulty,
  managersMainCompetition,
  managerHasService,
  managersArena,
  currentCalendarEntry,
  humanManagers,
  activeManager
} from "../services/selectors";
import events from "../data/events";
import { nth, map, values, toPairs, range } from "ramda";
import {
  MHMTurnPhase,
  MHMTurnDefinition,
  Turn,
  CompetitionNames,
  CompetitionPhase
} from "../types/base";
import { MHMState } from "../ducks";
import { Team, TeamStrength } from "../types/team";
import { teamLevelToStrength } from "../services/team";
import { TeamSetStrengthsAction, TEAM_SET_STRENGTHS } from "../ducks/team";
import {
  CompetitionStartAction,
  COMPETITION_START,
  CompetitionSeedAction,
  COMPETITION_SEED
} from "../ducks/competition";
import { addNotification } from "./notification";
import { removeTeamFromCompetition, addTeamToCompetition } from "./competition";

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
  // what is this?
  yield takeEvery("GAME_GAME_BEGIN", beforeGame);
  yield fork(stats);

  do {
    const calendarEntry: MHMTurnDefinition = yield select(currentCalendarEntry);

    // const turn = yield select((state: MHMState) => state.game.turn);
    // const calendar = yield select(state => state.game.get("calendar"));
    // const roundData = nth(turn.get("round"), calendar);
    // if (!roundData) {
    //   throw new Error("Invalid turn data");
    // }

    const phases = calendarEntry.phases;

    // console.log(roundData.toJS(), "round data");

    // don't do any calculations for "hidden" turns
    if (phases.includes("action")) {
      yield call(actionPhase);
    }

    // don't do any calculations for "hidden" turns
    if (phases.includes("prank")) {
      yield call(prankPhase);
    }

    // This is a MEGA KLUDGE :D
    if (phases.includes("gameday")) {
      const numberOfGamedayPhases = phases.filter(p => p === "gameday").length;
      for (const gd of range(0, numberOfGamedayPhases)) {
        yield call(gamedayPhase);
      }
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

    if (phases.includes("invitationsCreate")) {
      yield call(invitationsCreatePhase);
    }

    if (phases.includes("invitationsProcess")) {
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

    // Todo: this should be in a turn cleanup phase.
    yield putResolve<GameCleanupAction>({ type: GAME_CLEAR_EXPIRED });

    yield call(nextTurn);
  } while (true);
}

function* competitionStart(competitionId: string) {
  const competition = competitionData[competitionId];

  if (competition.start) {
    yield call(competition.start);
  }

  yield put<CompetitionStartAction>({
    type: COMPETITION_START,
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
  const turn: Turn = yield select((state: MHMState) => state.game.turn);

  const teams: Team[] = yield select(allTeams);

  console.log("teams", teams);

  const strengths: [string, TeamStrength][] = map(
    team => [team.id, teamLevelToStrength(team.level)],
    teams
  );

  console.log("strenghtetore", strengths);

  // Re-strength European teams.

  /*
  const reStrengths = teams.slice(24).map(t => {
    return {
      id: t.get("id"),
      strength: teamData.get(t.get("id")).get("strength")()
    };
  });
  */

  yield put<TeamSetStrengthsAction>({
    type: TEAM_SET_STRENGTHS,
    payload: strengths
  });

  // Start all competitions.
  for (const [key, competitionObj] of toPairs(competitionData)) {
    console.log("HELLU", key);
    yield competitionStart(key);
  }

  console.log("HELLUREI!!!!!!");

  yield putResolve<GameSeasonStartAction>({
    type: GAME_SEASON_START
  });

  console.log("HELLUREI!!!!!!");
}

export function* promote(competition: CompetitionNames, team: string) {
  const promoteTo = competitionData[competition].promoteTo;
  if (!promoteTo) {
    throw new Error("Invalid promotion");
  }

  yield all([
    call(removeTeamFromCompetition, competition, team),
    call(addTeamToCompetition, promoteTo, team)
  ]);
}

export function* relegate(competition: CompetitionNames, team: string) {
  console.log("RELAGDO", competition, team);

  const relegateTo = competitionData[competition].relegateTo;
  if (!relegateTo) {
    throw new Error("Invalid relegation");
  }

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
  // TODO: Refactor this to be better (pre and post effect, let the reducers deduce their own logic), maybe merge this logic with cleanup?

  yield put({ type: "NEWS_ANNOUNCEMENTS_CLEAR" });
  yield put({ type: "EVENT_CLEAR_EVENTS" });
  yield put<GameNextTurnAction>({ type: GAME_NEXT_TURN });
}

export function* setPhase(phase: MHMTurnPhase) {
  yield put<GameSetPhaseAction>({
    type: GAME_SET_PHASE,
    payload: phase
  });
}

export function* seedCompetition(competition: CompetitionNames, phase: number) {
  console.log("SEEDING", competition);

  const competitions = yield select(state => state.competition.competitions);

  const seeder = competitionData[competition].seed[phase];
  if (!seeder) {
    throw new Error(`Invalid seeder for ${competition}; ${phase}`);
  }

  const seed: CompetitionPhase = yield call(seeder, competitions);

  console.log("SEED2", competition);

  yield putResolve<CompetitionSeedAction>({
    type: COMPETITION_SEED,
    payload: {
      competition: competition,
      phase,
      seed
    }
  });
}

export function* gameStart() {
  const action: GameAdvanceAction = yield take(GAME_ADVANCE_REQUEST);

  // TODO: multiple managers... very soon, actually!
  yield call(addManager, action.payload);

  yield putResolve({
    type: GAME_START
  });
}

export function* gameSave() {
  const manager = yield select(activeManager);
  const state = yield select(state => state);
  yield call(gameStateService.saveGame, state);
  yield call(addNotification, manager.id, "Peli tallennettiin.");
}

export function* gameLoad() {
  const state = yield call(gameStateService.loadGame);
  yield putResolve<GameLoadStateAction>({
    type: GAME_LOAD_STATE,
    payload: state
  });

  yield putResolve<GameLoadedAction>({
    type: GAME_LOADED
  });
}

export function* mainMenu() {
  do {
    const { load } = yield race({
      load: take(GAME_LOAD_REQUEST),
      start: take(GAME_START_REQUEST)
    });

    if (load) {
      yield call(gameLoad);
    } else {
      yield call(gameStart);
    }

    const task = yield fork(gameLoop);

    yield take(GAME_QUIT_TO_MAIN_MENU);
    yield cancel(task);
  } while (true);
}
