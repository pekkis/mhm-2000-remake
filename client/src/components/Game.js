import React from "react";
import { Switch, Route } from "react-router";
import MainMenu from "./containers/MainMenuContainer";
import TransferMarket from "./containers/TransferMarketContainer";
import LeagueTables from "./containers/LeagueTablesContainer";
import DeveloperMenu from "./containers/DeveloperMenuContainer";
import SelectStrategy from "./containers/SelectStrategyContainer";
import Events from "./containers/EventsContainer";

const Phase = props => {
  const { turn } = props;

  switch (true) {
    case turn.get("phase") === "select-strategy":
      return <SelectStrategy />;

    case turn.get("phase") === "event":
      return <Events />;

    case turn.get("phase") === "action":
    case turn.get("phase") === "seed":
      return (
        <Switch>
          <Route exact path="/" component={MainMenu} />
          <Route exact path="/sarjataulukot" component={LeagueTables} />
          <Route exact path="/pelaajamarkkinat" component={TransferMarket} />
          <Route exact path="/debug" component={DeveloperMenu} />
        </Switch>
      );

    default:
      console.log("turn", turn.toJS());
      return "laddare...";
  }
};

const Game = props => {
  return (
    <div>
      <h1>MHM 97</h1>
      <Phase {...props} />
    </div>
  );
};

export default Game;
