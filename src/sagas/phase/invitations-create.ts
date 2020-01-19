import { call } from "redux-saga/effects";
import { createInvitations } from "../invitation";

export default function* invitationsCreatePhase() {
  yield call(createInvitations);
}
