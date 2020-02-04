import { getContext } from "redux-saga/effects";
import * as H from "history";

export function* routerPush(url: string) {
  const history: H.History = yield getContext("history");
  history.push(url);
}
