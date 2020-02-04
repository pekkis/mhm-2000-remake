import React from "react";
import ReactDOM from "react-dom";
import Root from "./Root";
import { createStore } from "./services/redux";
import {
  getMiddlewares,
  getReducers,
  getEnhancers,
  getSagaMiddleware
} from "./config/redux";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSpinner,
  faBars,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";
// import runtime from "@dr-kobros/serviceworker-webpack-plugin/lib/runtime";
import * as Sentry from "@sentry/browser";
import rootSaga from "./sagas/root";
import { BrowserRouter } from "react-router-dom";

if (process.env.NODE_ENV !== "production") {
  const axe = require("react-axe");
  axe(React, ReactDOM, 1000);
}

/*
Sentry.init({
  environment: process.env.NODE_ENV,
  dsn: "https://38630b0d78f645abb5cae7e82bc1582c@sentry.io/1367033"
});
*/

library.add(faSpinner, faBars, faExclamationCircle);

const store = createStore(getReducers(), getMiddlewares(), getEnhancers());

const sagaMiddleware = getSagaMiddleware();

// Just a small DRY abstraction here.
function render(Component: typeof Root, rootElement: HTMLElement) {
  ReactDOM.render(
    <BrowserRouter>
      <Component
        store={store}
        sagaMiddleware={sagaMiddleware}
        rootSaga={rootSaga}
      />
    </BrowserRouter>,
    rootElement
  );
}

// If we get !undefined state from the server, we hydrate.
const rootElement = document.getElementById("app");
if (!rootElement) {
  throw new Error("Oh noes, no root element be found!");
}

render(Root, rootElement);

/*
runtime.register().then((sw: ServiceWorker) => {
  console.log(sw, "serviis wörker");
});
*/

// Webpack's hot reloading magic happens here.

if (module.hot) {
  module.hot.accept("./Root", () => {
    const HotReloadedRoot = require("./Root").default;
    render(HotReloadedRoot, rootElement);
  });
}
