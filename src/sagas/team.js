import { put, call, select } from "redux-saga/effects";
import { teamsManagerId, teamsManager } from "../data/selectors";
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

  yield put({
    type: "TEAM_INCREMENT_MORALE",
    payload: {
      team: teamId,
      amount,
      min,
      max
    }
  });
}

export function* decrementMorale(team, amount) {
  yield call(incrementMorale, -decrementMorale);
}
