import { mainMenu } from "./game";
import { all, setContext } from "redux-saga/effects";
import * as H from "history";

export default function* rootSaga(params: {
  context: {
    history: H.History;
  };
}) {
  yield setContext(params.context);

  yield all([mainMenu()]);
}
