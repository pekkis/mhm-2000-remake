import { takeEvery, select, put, putResolve, call } from "redux-saga/effects";
import { gameFacts } from "../services/game";
import competitionList from "../data/competitions";
import playerTypes from "../data/transfer-market";
import { managersTeamId } from "../data/selectors";
import { incrementMorale } from "./team";

export function* hireManager(managerId, teamId) {
  const managersCurrentTeam = yield select(state =>
    state.manager.getIn(["managers", managerId, "team"])
  );

  if (managersCurrentTeam) {
    yield putResolve({
      type: "TEAM_REMOVE_MANAGER",
      payload: {
        team: managersCurrentTeam
      }
    });
  }

  yield putResolve({
    type: "TEAM_ADD_MANAGER",
    payload: {
      team: teamId,
      manager: managerId
    }
  });
}

export function* buyPlayer(action) {
  console.log("buy manager", action);

  const { payload } = action;

  const manager = yield select(state =>
    state.manager.getIn(["managers", payload.manager])
  );

  const playerType = playerTypes.get(payload.playerType);

  yield put({
    type: "MANAGER_INCREMENT_BALANCE",
    payload: {
      manager: manager.get("id"),
      amount: -playerType.buy
    }
  });

  yield put({
    type: "TEAM_INCREMENT_STRENGTH",
    payload: {
      team: manager.get("team"),
      amount: playerType.skill()
    }
  });
}

export function* sellPlayer(action) {
  console.log("SELL PLAYER", action);
}

export function* afterGameday(action) {
  const { payload } = action;

  const managers = yield select(state => state.manager.get("managers"));

  const group = yield select(state =>
    state.game.getIn([
      "competitions",
      payload.competition,
      "phases",
      payload.phase,
      "groups",
      payload.group
    ])
  );

  for (const manager of managers) {
    const managersIndex = group
      .get("teams")
      .findIndex(t => t === manager.get("team"));

    if (managersIndex === -1) {
      continue;
    }

    const game = group.getIn(["schedule", payload.round]).find(pairing => {
      return pairing.includes(managersIndex);
    });

    if (!game) {
      continue;
    }

    const facts = gameFacts(game, managersIndex);

    const amount = competitionList.getIn([payload.competition, "gameBalance"])(
      facts,
      manager
    );

    const moraleBoost = getMoraleBoost(facts);
    if (moraleBoost) {
      const team = yield select(managersTeamId(manager.get("id")));

      yield call(incrementMorale, team, moraleBoost);
    }

    yield put({
      type: "MANAGER_INCREMENT_BALANCE",
      payload: {
        amount,
        manager: manager.get("id")
      }
    });
  }

  // console.log("äkshuun!", action);
}

const getMoraleBoost = facts => {
  if (facts.isWin) {
    return 1;
  } else if (facts.isLoss) {
    return -1;
  }

  return 0;
};

export function* watchTransferMarket() {
  yield takeEvery("MANAGER_BUY_PLAYER", buyPlayer);
}
