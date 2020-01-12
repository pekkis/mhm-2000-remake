import React, { FunctionComponent } from "react";
import StartMenu from "./containers/StartMenuContainer";
import Game from "./containers/GameContainer";
import * as Sentry from "@sentry/browser";

/*
    Sentry.withScope(scope => {
      Object.keys(info).forEach(key => {
        scope.setExtra(key, info[key]);
      });
      Sentry.captureException(error);
    });
*/

interface Props {
  started: boolean;
}

const App: FunctionComponent<Props> = props => {
  const { started } = props;

  switch (true) {
    case !started:
      return <StartMenu />;

    default:
      return <Game />;
  }
};

export default App;
