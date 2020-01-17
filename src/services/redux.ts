import {
  createStore as reduxCreateStore,
  applyMiddleware,
  combineReducers,
  Store,
  Reducer,
  Middleware,
  StoreEnhancer
} from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { MHMState } from "../ducks";

export function createStore(
  reducers: { [key: string]: Reducer },
  middlewares: Middleware[] = [],
  enhancers: StoreEnhancer[] = [],
  initialState?: MHMState
): Store {
  const createStoreWithMiddleware = composeWithDevTools(
    ...enhancers,
    applyMiddleware(...middlewares)
  )(reduxCreateStore);

  const combinedReducer = combineReducers({
    ...reducers
  });

  return createStoreWithMiddleware(combinedReducer, initialState);
}
