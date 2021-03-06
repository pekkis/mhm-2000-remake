import { ascend, map, sortWith, toPairs } from "ramda";
import {
  all,
  call,
  cancel,
  delay,
  fork,
  put,
  putResolve,
  race,
  select,
  take,
  takeEvery
} from "redux-saga/effects";
import {
  CompetitionSeedAction,
  CompetitionStartAction,
  COMPETITION_SEED,
  COMPETITION_START
} from "../ducks/competition";
import {
  GameAdvanceAction,
  GameLoadedAction,
  GameLoadStateAction,
  GameNextTurnAction,
  GameSeasonStartAction,
  GameSetPhaseAction,
  GAME_LOADED,
  GAME_LOAD_REQUEST,
  GAME_LOAD_STATE,
  GAME_NEXT_TURN,
  GAME_QUIT_TO_MAIN_MENU,
  GAME_SEASON_START,
  GAME_SET_PHASE,
  GAME_START,
  GAME_START_REQUEST
} from "../ducks/game";
import { TeamSetStrengthsAction, TEAM_SET_STRENGTHS } from "../ducks/team";
import { UISetLoadingAction, UI_SET_LOADING } from "../ducks/ui";
import competitionData from "../services/competitions";
import gameStateService from "../services/game-state";
import {
  selectActiveManager,
  allTeams,
  currentCalendarEntry
} from "../services/selectors";
import { teamLevelToStrength } from "../services/team";
import {
  CalendarEntry,
  CompetitionNames,
  CompetitionPhase,
  ForEvery,
  MHMTurnPhase
} from "../types/base";
import { Team, TeamStrength } from "../types/team";
import { addTeamToCompetition, removeTeamFromCompetition } from "./competition";
import { initializeManagers } from "./game-start/game-start";
import { addManager } from "./manager";
import { addNotification } from "./notification";
import actionPhase from "./phase/action";
import calculationsPhase from "./phase/calculations";
import cleanupPhase from "./phase/cleanup";
import endOfSeasonPhase from "./phase/end-of-season";
import eventPhase from "./phase/event";
import eventCreationPhase from "./phase/event-creation";
import galaPhase from "./phase/gala";
import gamedayPhase from "./phase/gameday";
import invitationsCreatePhase from "./phase/invitations-create";
import invitationsProcessPhase from "./phase/invitations-process";
import newsPhase from "./phase/news";
import prankPhase from "./phase/prank";
import seedPhase from "./phase/seed";
import startOfSeasonPhase from "./phase/start-of-season";
import { createSponsorshipProposals } from "./sponsor";
import { stats } from "./stats";

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

interface PhaseDescriptor {
  weight: number;
  saga?: () => Generator;
}

const phaseDescriptors: ForEvery<MHMTurnPhase, PhaseDescriptor> = {
  action: { weight: 1000, saga: actionPhase },
  prank: { weight: 2000, saga: prankPhase },
  gameday: { weight: 3000, saga: gamedayPhase },
  results: { weight: 3100 },
  calculations: { weight: 4000, saga: calculationsPhase },
  eventCreation: { weight: 5000, saga: eventCreationPhase },
  event: { weight: 6000, saga: eventPhase },
  news: { weight: 7000, saga: newsPhase },
  invitationsCreate: { weight: 8000, saga: invitationsCreatePhase },
  invitationsProcess: { weight: 9000, saga: invitationsProcessPhase },
  startOfSeason: { weight: 10000, saga: startOfSeasonPhase },
  seed: { weight: 11000, saga: seedPhase },
  gala: { weight: 12000, saga: galaPhase },

  endOfSeason: { weight: 13000, saga: endOfSeasonPhase },
  selectStrategy: { weight: 14000 },
  championshipBetting: { weight: 14000 },
  worldChampionships: { weight: 20000 },

  cleanup: {
    weight: 1000000,
    saga: cleanupPhase
  }
};

const phaseSorter = (pd: ForEvery<MHMTurnPhase, PhaseDescriptor>) =>
  sortWith([ascend((phase: MHMTurnPhase) => pd[phase].weight)]);

export function* gameLoop() {
  // what is this?
  yield takeEvery("GAME_GAME_BEGIN", beforeGame);
  yield fork(stats);

  do {
    const calendarEntry: CalendarEntry = yield select(currentCalendarEntry);

    const phases = phaseSorter(phaseDescriptors)(calendarEntry.phases);

    for (const phase of phases) {
      console.log("RUNNING PHASE", phase);
      const phaseDescriptor = phaseDescriptors[phase];
      if (phaseDescriptor.saga) {
        yield phaseDescriptor.saga();
      }
    }

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

export function* initializeStrengths() {
  const teams: Team[] = yield select(allTeams);

  // Initialize team strengths
  const strengths: [string, TeamStrength][] = map(
    team => [team.id, teamLevelToStrength(team.level)],
    teams
  );
  yield put<TeamSetStrengthsAction>({
    type: TEAM_SET_STRENGTHS,
    payload: strengths
  });
}

export function* prepareSeason() {
  yield call(initializeStrengths);
  // Start all competitions.
  for (const [key] of toPairs(competitionData)) {
    yield competitionStart(key);
  }

  // Initialize sponsorship proposals
  yield call(createSponsorshipProposals);

  yield putResolve<GameSeasonStartAction>({
    type: GAME_SEASON_START
  });
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
  const relegateTo = competitionData[competition].relegateTo;
  if (!relegateTo) {
    throw new Error("Invalid relegation");
  }

  yield all([
    call(removeTeamFromCompetition, competition, team),
    call(addTeamToCompetition, relegateTo, team)
  ]);
}

function* nextTurn() {
  // TODO: Refactor this to be better (pre and post effect, let the reducers deduce their own logic), maybe merge this logic with cleanup?

  yield put<GameNextTurnAction>({ type: GAME_NEXT_TURN });
}

export function* setPhase(phase: MHMTurnPhase, subphase?: string) {
  yield put<GameSetPhaseAction>({
    type: GAME_SET_PHASE,
    payload: { phase, subphase }
  });
}

export function* seedCompetition(competition: CompetitionNames, phase: number) {
  const competitions = yield select(state => state.competition.competitions);

  const seeder = competitionData[competition].seed[phase];
  if (!seeder) {
    throw new Error(`Invalid seeder for ${competition}; ${phase}`);
  }

  const seed: CompetitionPhase = yield call(seeder, competitions);

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

  yield putResolve<UISetLoadingAction>({
    type: UI_SET_LOADING,
    payload: true
  });

  // TODO: this is a kludge for the first season...
  yield call(initializeStrengths);

  // TODO: multiple managers... very soon, actually!
  yield call(addManager, action.payload);
  yield call(initializeManagers);

  yield call(prepareSeason);

  yield delay(500);

  yield putResolve({
    type: GAME_START
  });
}

export function* gameSave() {
  const manager = yield select(selectActiveManager);
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

// Unrefactorade

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
