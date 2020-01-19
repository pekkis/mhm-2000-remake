import * as reducers from "../ducks";
import createSagaMiddleware, { SagaMiddleware } from "redux-saga";
import { Middleware, Reducer, StoreEnhancer } from "redux";

const sagaMiddleware = createSagaMiddleware();

export function getMiddlewares(): Middleware[] {
  const middlewares = [sagaMiddleware];
  return middlewares;
}

export function getSagaMiddleware(): SagaMiddleware {
  return sagaMiddleware;
}

export function getReducers(): { [key: string]: Reducer } {
  return reducers;
}

export function getEnhancers(): StoreEnhancer[] {
  return [];
}
