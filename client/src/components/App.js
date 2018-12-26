import React from "react";
import { Switch, Route } from "react-router";
import MainMenu from "./containers/MainMenuContainer";
import TransferMarket from "./containers/TransferMarketContainer";
import Button from "./form/Button";

const App = props => {
  const { started, startGame, loadGame } = props;

  if (!started) {
    return (
      <div>
        <h1>Welcome to MHM 97</h1>

        <Button
          onClick={() => {
            startGame();
          }}
        >
          Uusi peli
        </Button>

        <Button
          onClick={() => {
            loadGame();
          }}
        >
          Lataa peli
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1>MHM 97</h1>

      <Switch>
        <Route exact path="/" component={MainMenu} />
        <Route exact path="/pelaajamarkkinat" component={TransferMarket} />
      </Switch>
    </div>
  );
};

export default App;
