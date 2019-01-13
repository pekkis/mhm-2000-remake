import React from "react";
import ReactDOM from "react-dom";
import Root from "./Root";

import { getInitialState } from "./config/state";

import createStore from "./store";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faSpinner, faBars } from "@fortawesome/free-solid-svg-icons";

import runtime from "@dr-kobros/serviceworker-webpack-plugin/lib/runtime";

import "./style.pcss";

import * as Sentry from "@sentry/browser";

Sentry.init({
  environment: process.env.NODE_ENV,
  dsn: "https://38630b0d78f645abb5cae7e82bc1582c@sentry.io/1367033"
});

library.add(faSpinner, faBars);

const initialState = getInitialState();

const store = createStore(initialState);

// Just a small DRY abstraction here.
function render(Component, rootElement, method = "render") {
  ReactDOM[method](<Component store={store} />, rootElement);
}

// If we get !undefined state from the server, we hydrate.
const rootElement = document.getElementById("app");
render(Root, rootElement, initialState ? "hydrate" : "render");

runtime.register().then(sw => {
  console.log("sw", "serviis wörker");
});

// Webpack's hot reloading magic happens here.

if (module.hot) {
  module.hot.accept("./Root", () => {
    const HotReloadedRoot = require("./Root").default;
    render(HotReloadedRoot, rootElement, "render");
  });
}
