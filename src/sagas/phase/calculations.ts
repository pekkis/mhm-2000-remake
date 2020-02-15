import { put, putResolve, select, call } from "redux-saga/effects";

import strategies from "../../services/strategies";
import { MHMState } from "../../ducks";
import { Turn, MapOf } from "../../types/base";
import { Team } from "../../types/team";
import { values } from "ramda";
import {
  GameDecrementDurationsActions,
  GAME_DECREMENT_DURATIONS
} from "../../ducks/game";
import {
  TeamIncrementReadinessAction,
  TEAM_INCREMENT_READINESS
} from "../../ducks/team";

export default function* calculationsPhase() {
  const turn: Turn = yield select((state: MHMState) => state.game.turn);

  const teams: MapOf<Team> = yield select(
    (state: MHMState) => state.team.teams
  );

  const readinessIncrements = values(teams).map(team => {
    if (!team.strategy) {
      throw new Error(
        `Team ${team.id} has no strategy. It should not happen?!?`
      );
    }

    return {
      team: team.id,
      amount: strategies[team.strategy].incrementReadiness(turn)
    };
  });

  yield put<TeamIncrementReadinessAction>({
    type: TEAM_INCREMENT_READINESS,
    payload: readinessIncrements
  });

  yield putResolve<GameDecrementDurationsActions>({
    type: GAME_DECREMENT_DURATIONS
  });
}
