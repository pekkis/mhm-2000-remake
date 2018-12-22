import { createStore } from "./services/redux";
import {
  getMiddlewares,
  getReducers,
  getEnhancers,
  getSagaMiddleware
} from "./config/redux";
import getSagas from "./getSagas";

export default function getStore(initialState) {
  const store = createStore(
    getReducers(),
    getMiddlewares(),
    getEnhancers(),
    initialState
  );

  const sagaMiddleware = getSagaMiddleware();

  // then run the saga
  sagaMiddleware.run(getSagas(), {});

  return store;
}
