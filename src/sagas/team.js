import { put, call, select } from "redux-saga/effects";
import { teamsManager } from "../data/selectors";
import difficultyLevels from "../data/difficulty-levels";

const getMoraleMinMax = manager => {
  const difficulty = manager ? manager.get("difficulty") : 2;

  return {
    min: difficultyLevels.getIn([difficulty, "moraleMin"]),
    max: difficultyLevels.getIn([difficulty, "moraleMax"])
  };
};

export function* setStrategy(teamId, strategy) {
  return yield put({
    type: "TEAM_SET_STRATEGY",
    payload: {
      team: teamId,
      strategy
    }
  });
}

export function* setMorale(teamId, morale) {
  const manager = yield select(teamsManager(teamId));
  const { min, max } = getMoraleMinMax(manager);

  return yield put({
    type: "TEAM_SET_MORALE",
    payload: {
      team: teamId,
      morale,
      min,
      max
    }
  });
}

export function* incrementMorale(teamId, amount) {
  const manager = yield select(teamsManager(teamId));

  const { min, max } = getMoraleMinMax(manager);

  return yield put({
    type: "TEAM_INCREMENT_MORALE",
    payload: {
      team: teamId,
      amount,
      min,
      max
    }
  });
}

export function* setReadiness(teamId, readiness) {
  return yield put({
    type: "TEAM_SET_READINESS",
    payload: {
      team: teamId,
      readiness
    }
  });
}

export function* incrementReadiness(teamId, amount) {
  return yield put({
    type: "TEAM_INCREMENT_READINESS",
    payload: {
      team: teamId,
      amount
    }
  });
}

export function* addEffect(team, parameter, amount, duration) {
  yield put({
    type: "TEAM_ADD_EFFECT",
    payload: {
      team,
      effect: {
        amount,
        duration,
        parameter
      }
    }
  });
}

export function* addOpponentEffect(team, parameter, amount, duration) {
  yield put({
    type: "TEAM_ADD_OPPONENT_EFFECT",
    payload: {
      team,
      effect: {
        amount,
        duration,
        parameter
      }
    }
  });
}

export function* decrementReadiness(team, amount) {
  return yield call(incrementReadiness, team, -amount);
}

export function* incrementStrength(teamId, amount) {
  return yield put({
    type: "TEAM_INCREMENT_STRENGTH",
    payload: {
      team: teamId,
      amount
    }
  });
}

export function* decrementStrength(team, amount) {
  return yield call(incrementStrength, team, -amount);
}

export function* decrementMorale(team, amount) {
  return yield call(incrementMorale, team, -amount);
}
