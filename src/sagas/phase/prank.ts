import { select, call, put } from "redux-saga/effects";
import prankTypes from "../../services/data/pranks";
import { MHMState } from "../../ducks";
import { toPairs } from "ramda";
import { MapOf, Prank } from "../../types/base";

export default function* prankPhase() {
  const pranks: MapOf<Prank> = yield select(
    (state: MHMState) => state.prank.pranks
  );

  for (const [prankId, prank] of toPairs(pranks)) {
    console.log("PRANK TO EXECUTE", prank);
    const prankInfo = prankTypes.get(prank.get("type"));
    const prankExecutor = prankInfo.get("execute");

    yield call(prankExecutor, prank);
    yield put({
      type: "PRANK_DISMISS",
      payload: prankId
    });
  }
}
