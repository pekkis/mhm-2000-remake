import gameSagas from "./sagas/game";
// import { dataMonitor } from "./sagas/data";
import { all, setContext } from "redux-saga/effects";

export default function getSagas() {
  return function* getSagas(context) {
    yield setContext(context);
    yield all([
      gameSagas()
      // userSagas(),
      // uiSagas(),
      // chatSagas(),
      // lootboxSagas(),
      // dataMonitor()
    ]);
  };
}
