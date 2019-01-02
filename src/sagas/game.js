import competitionData from "../data/competitions";
import competitionTypes from "../services/competition-type";
import teamData from "../data/teams";

import {
  call,
  put,
  putResolve,
  select,
  takeEvery,
  take,
  all
} from "redux-saga/effects";

import actionPhase from "./phase/action";
import eventPhase from "./phase/event";
import gamedayPhase from "./phase/gameday";
import seedPhase from "./phase/seed";
import endOfSeasonPhase from "./phase/end-of-season";
import startOfSeasonPhase from "./phase/start-of-season";
import calendar from "../data/calendar";

import { afterGameday } from "./player";
import { allTeams } from "../data/selectors";

export function* gameLoop() {
  yield takeEvery("GAME_GAMEDAY_COMPLETE", afterGameday);

  do {
    const turn = yield select(state => state.game.get("turn"));

    const roundData = calendar.get(turn.get("round"));

    const phases = roundData.get("phases");

    // console.log(roundData.toJS(), "round data");

    // don't do any calculations for "hidden" turns
    if (phases.includes("action")) {
      yield call(actionPhase);
      yield putResolve({ type: "GAME_DECREMENT_DURATIONS" });
    }

    if (phases.includes("gameday")) {
      yield call(gamedayPhase);
    }

    if (phases.includes("event")) {
      yield call(eventPhase);
    }

    yield call(calculateStats);

    if (phases.includes("seed")) {
      yield call(seedPhase);
    }

    if (phases.includes("startOfSeason")) {
      yield call(startOfSeasonPhase);
    }

    if (phases.includes("endOfSeason")) {
      yield call(endOfSeasonPhase);
    }

    yield putResolve({ type: "GAME_CLEAR_EXPIRED" });

    yield call(nextTurn);
  } while (true);
}

export function* calculateStats() {
  /*
  const competitions = yield select(state => state.game.get("competitions"));

  const actionsToYield = competitions
    .map(competition => {
      return competition
        .getIn(["phases", competition.get("phase"), "groups"])
        .map((group, groupIndex) => {
          console.log("group", group.toJS());

          console.log(competitionTypes, "cts");

          const stats = competitionTypes[group.get("type")].stats(group);

          return putResolve({
            type: "COMPETITION_UPDATE_STATS",
            payload: {
              competition: competition.get("id"),
              phase: competition.get("phase"),
              group: groupIndex,
              stats
            }
          });
        });
    })
    .toList()
    .flatten(true);

  yield all(actionsToYield.toJS());
  */
}

function* competitionStart(competitionId) {
  const competitionStarter = competitionData.getIn([competitionId, "start"]);
  if (competitionStarter) {
    yield call(competitionStarter);
  }
}

export function* seasonStart() {
  const teams = yield select(allTeams);

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

  for (const [key, competitionObj] of competitionData) {
    yield competitionStart(key);

    const competitions = yield select(state => state.game.get("competitions"));

    yield put({
      type: "COMPETITION_START",
      payload: {
        competition: key
      }
    });

    yield put({
      type: "COMPETITION_SEED",
      payload: {
        competition: key,
        phase: 0,
        seed: competitionObj.getIn(["seed", 0])(competitions)
      }
    });
  }

  yield put({
    type: "NEWS_CLEAR"
  });

  yield put({
    type: "SEASON_START"
  });
}

export function* promote(competition, team) {
  const promoteTo = competitionData.getIn([competition, "promoteTo"]);

  yield put({
    type: "COMPETITION_REMOVE_TEAM",
    payload: {
      competition,
      team
    }
  });

  yield put({
    type: "COMPETITION_ADD_TEAM",
    payload: {
      competition: promoteTo,
      team
    }
  });
}

export function* relegate(competition, team) {
  const relegateTo = competitionData.getIn([competition, "relegateTo"]);

  yield put({
    type: "COMPETITION_REMOVE_TEAM",
    payload: {
      competition,
      team
    }
  });

  yield put({
    type: "COMPETITION_ADD_TEAM",
    payload: {
      competition: relegateTo,
      team
    }
  });
}

function* nextTurn() {
  yield put({ type: "EVENT_CLEAR_EVENTS" });
  yield put({ type: "GAME_NEXT_TURN" });
}
