import React from "react";
import ReactDOM from "react-dom";
import Root from "./Root";

import { getInitialState } from "./config/state";

import createStore from "./store";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

library.add(faSpinner);

const initialState = getInitialState();

const store = createStore(initialState);

store.dispatch({
  type: "GAME_START_REQUEST"
});

// Just a small DRY abstraction here.
function render(Component, rootElement, method = "render") {
  ReactDOM[method](<Component store={store} />, rootElement);
}

// If we get !undefined state from the server, we hydrate.
const rootElement = document.getElementById("app");
render(Root, rootElement, initialState ? "hydrate" : "render");

// Webpack's hot reloading magic happens here.
if (module.hot) {
  module.hot.accept("./Root", () => {
    const HotReloadedRoot = require("./Root").default;
    render(HotReloadedRoot, rootElement, "render");
  });
}
