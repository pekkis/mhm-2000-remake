import { putResolve } from "redux-saga/effects";
import tournamentList from "../data/tournaments";
import { call, select, put } from "redux-saga/effects";

import { INVITATION_ADD, INVITATION_ACCEPT } from "../ducks/invitation";
import { addNotification } from "./notification";
import { managersTeamId } from "../data/selectors";
import { addTeamToCompetition } from "./game";

export function* acceptInvitation(managerId, id) {
  const team = yield select(managersTeamId(managerId));

  yield putResolve({
    type: INVITATION_ACCEPT,
    payload: { manager: managerId, id }
  });

  yield call(addTeamToCompetition, "tournaments", team);

  yield call(
    addNotification,
    managerId,
    "Hyväksyit turnauskutsun. Sihteerisi vastasi kaikkiin muihin potentiaalisiin turnauskutsuihin kieltävästi."
  );
}

export function* createInvitations() {
  const managers = yield select(state => state.manager.get("managers"));

  for (const [managerId] of managers) {
    for (const [tournamentId, tournament] of tournamentList.entries()) {
      const isInvited = yield call(tournament.get("isInvited"), managerId);
      if (isInvited) {
        yield put({
          type: INVITATION_ADD,
          payload: {
            manager: managerId,
            tournament: tournamentId,
            duration: 3
          }
        });
      }
    }
  }
}
