import { takeEvery, all, select, put } from "redux-saga/effects";
import { gameFacts } from "../services/game";
import competitionList from "../data/competitions";
import playerTypes from "../data/transfer-market";

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

  const phase = yield select(state =>
    state.game.getIn([
      "competitions",
      payload.competition,
      "phases",
      payload.phase
    ])
  );

  for (const player of players) {
    const playersIndex = phase
      .get("teams")
      .findIndex(t => t === player.get("team"));

    if (playersIndex === -1) {
      continue;
    }

    console.log("playersIndex", playersIndex);

    const game = phase.getIn(["schedule", payload.round]).find(pairing => {
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

export function* watchTransferMarket() {
  yield takeEvery("PLAYER_BUY_PLAYER", buyPlayer);
}
