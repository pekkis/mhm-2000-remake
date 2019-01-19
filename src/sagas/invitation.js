import { putResolve } from "redux-saga/effects";
import tournamentList from "../data/tournaments";
import { call, select, put } from "redux-saga/effects";

import {
  INVITATION_ADD,
  INVITATION_ANSWER,
  INVITATION_CLEAR
} from "../ducks/invitation";

export function* acceptInvitation(managerId, tournament) {
  yield putResolve({
    type: ""
  });
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
            tournament: tournamentId
          }
        });
      }
    }
  }
}
