import { takeEvery, select, put } from "redux-saga/effects";
import { gameFacts } from "../services/game";
import competitionList from "../data/competitions";
import playerTypes from "../data/transfer-market";
import { playersTeamId } from "../data/selectors";

export function* buyPlayer(action) {
  console.log("buy player", action);

  const { payload } = action;

  const player = yield select(state =>
    state.player.getIn(["players", payload.player])
  );

  const playerType = playerTypes.get(payload.playerType);

  yield put({
    type: "PLAYER_INCREMENT_BALANCE",
    payload: {
      player: player.get("id"),
      amount: -playerType.buy
    }
  });

  yield put({
    type: "TEAM_INCREMENT_STRENGTH",
    payload: {
      team: player.get("team"),
      amount: playerType.skill()
    }
  });
}

export function* sellPlayer(action) {
  console.log("SELL PLAYER", action);
}

export function* afterGameday(action) {
  const { payload } = action;

  const players = yield select(state => state.player.get("players"));

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

  for (const player of players) {
    const playersIndex = group
      .get("teams")
      .findIndex(t => t === player.get("team"));

    if (playersIndex === -1) {
      continue;
    }

    const game = group.getIn(["schedule", payload.round]).find(pairing => {
      return pairing.includes(playersIndex);
    });

    if (!game) {
      continue;
    }

    const facts = gameFacts(game, playersIndex);

    const amount = competitionList.getIn([payload.competition, "gameBalance"])(
      facts,
      player
    );

    const moraleBoost = getMoraleBoost(facts);
    if (moraleBoost) {
      const team = yield select(playersTeamId(player.get("id")));
      yield put({
        type: "TEAM_INCREMENT_MORALE",
        payload: {
          team,
          amount: moraleBoost
        }
      });
    }

    yield put({
      type: "PLAYER_INCREMENT_BALANCE",
      payload: {
        amount,
        player: player.get("id")
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
  yield takeEvery("PLAYER_BUY_PLAYER", buyPlayer);
}
