import { mainMenu } from "./game";
import { all } from "redux-saga/effects";

export default function* rootSaga() {
  yield all([mainMenu()]);
}
