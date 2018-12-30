import React from "react";
import StartMenu from "./containers/StartMenuContainer";
import Game from "./containers/GameContainer";

const App = props => {
  const { started } = props;

  switch (true) {
    case !started:
      return <StartMenu />;

    default:
      return <Game />;
  }
};

export default App;
