import { take, putResolve, select, call, all, race } from "redux-saga/effects";
import { seasonStart } from "../game";
import strategies from "../../services/strategies";
import { BETTING_BET_CHAMPION_REQUEST } from "../../ducks/betting";
import { betChampion } from "../betting";
import { setActiveManager } from "../manager";
import { range } from "ramda";
import { createRandomPlayer } from "../../services/player";
import {
  PlayerCreatePlayerAction,
  PLAYER_CREATE_PLAYER
} from "../../ducks/player";

export default function* startOfSeasonPhase() {
  const players = range(0, 1000).map(() => {
    return createRandomPlayer();
  });

  yield putResolve<PlayerCreatePlayerAction>({
    type: PLAYER_CREATE_PLAYER,
    payload: {
      players
    }
  });

  // yield call(selectStrategy);
  // yield call(championshipBetting);
}
