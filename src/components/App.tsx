import React, { FunctionComponent } from "react";
import StartMenu from "./StartMenu";
import Game from "./Game";
import * as Sentry from "@sentry/browser";
import { useSelector } from "react-redux";
import { MHMState } from "../ducks";
import LoadingScreen from "./LoadingScreen";

/*
    Sentry.withScope(scope => {
      Object.keys(info).forEach(key => {
        scope.setExtra(key, info[key]);
      });
      Sentry.captureException(error);
    });
*/

const App: FunctionComponent = () => {
  const started = useSelector<MHMState, boolean>(state => state.game.started);
  const isLoading = useSelector((state: MHMState) => state.ui.isLoading);

  if (isLoading) {
    return <LoadingScreen />;
  }

  switch (true) {
    case !started:
      return <StartMenu />;

    default:
      return <Game />;
  }
};

export default App;
