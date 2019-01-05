import { select, call } from "redux-saga/effects";
import prankTypes from "../../data/pranks";

export default function* prankPhase() {
  const pranks = yield select(state => state.prank.get("pranks"));

  console.log("PRANK FUCKING TIME!");

  for (const prank of pranks) {
    console.log("PRANK TO EXECUTE", prank.toJS());
    const prankInfo = prankTypes.get(prank.get("type"));
    const prankExecutor = prankInfo.get("execute");

    yield call(prankExecutor, prank);
  }
}
