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

export function* incrementReadiness(teamId, amount) {
  return yield put({
    type: "TEAM_INCREMENT_READINESS",
    payload: {
      team: teamId,
      amount
    }
  });
}

export function* decrementReadiness(team, amount) {
  return yield call(incrementMorale, -decrementMorale);
}

export function* decrementMorale(team, amount) {
  return yield call(incrementMorale, -decrementMorale);
}
